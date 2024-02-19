from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from PIL import Image
from pydub import AudioSegment
from moviepy.editor import VideoFileClip
import mimetypes
import os

@csrf_exempt
def upload_file(request):
    if request.method == 'POST':
        file = request.FILES.get('file')
        new_file_type = request.POST.get('file_type')

        if not file:
            return JsonResponse({'error': 'No file uploaded'}, status=400)

        if not new_file_type:
            return JsonResponse({'error': 'No file type specified'}, status=400)

        file_type = determine_file_type(file)

        if file_type.startswith("image"):
            converted_file_path = convert_image(file, new_file_type)
        elif file_type.startswith("audio"):
            converted_file_path = convert_audio(file, new_file_type)
        elif file_type.startswith("video"):
            converted_file_path = convert_video(file, new_file_type)
        else:
            return JsonResponse({'error': 'Unsupported file type'}, status=400)

        with open(converted_file_path, 'rb') as f:
            filename = os.path.basename(converted_file_path)
            content_type = mimetypes.guess_type(filename)[0]
            response = HttpResponse(f, content_type=content_type)
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            return response
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)


def determine_file_type(filename):
    mime_type, _ = mimetypes.guess_type(filename.name)
    return mime_type


def convert_image(file, new_file_type):
    image = Image.open(file)
    if new_file_type == 'PNG':
        image = image.convert('RGBA')
    else:
        image = image.convert('RGB')
    converted_file_path = os.path.join(settings.MEDIA_ROOT, f'ConvertedImg.{new_file_type.lower()}')
    image.save(converted_file_path, new_file_type.upper())
    return converted_file_path


def convert_audio(file, new_file_type):
    audio = AudioSegment.from_file(file)
    converted_file_path = os.path.join(settings.MEDIA_ROOT, f'ConvertedAudio.{new_file_type.lower()}')
    audio.export(converted_file_path, format=new_file_type.lower())
    return converted_file_path


def convert_video(file, new_file_type):
    video = VideoFileClip(file.temporary_file_path())
    converted_file_path = os.path.join(settings.MEDIA_ROOT, f'ConvertedVideo.{new_file_type.lower()}')
    video.write_videofile(converted_file_path)
    return converted_file_path
