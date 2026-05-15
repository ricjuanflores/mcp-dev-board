import json
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from google import genai

from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        task_status = self.request.query_params.get('status')
        if task_status:
            qs = qs.filter(status=task_status)
        return qs

    @action(detail=False, methods=['post'], url_path='ai-suggest')
    def ai_suggest(self, request):
        title = request.data.get('title', '').strip()
        if not title:
            return Response({'error': 'The title field is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if not settings.GEMINI_API_KEY:
            return Response(
                {'error': 'GEMINI_API_KEY is not configured. Add it to the .env file.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        try:
            client = genai.Client(api_key=settings.GEMINI_API_KEY)
            prompt = f"""You are an expert software project management assistant.
For the following development task: "{title}"

Respond ONLY with a valid JSON using this exact structure:
{{
  "description": "clear technical description in 1-2 sentences",
  "estimated_hours": 4,
  "subtasks": ["specific subtask 1", "specific subtask 2", "specific subtask 3"]
}}

No additional text, no markdown, just the JSON."""

            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
            )

            text = response.text.strip()
            if text.startswith('```'):
                lines = text.split('\n')
                text = '\n'.join(lines[1:-1])

            suggestion = json.loads(text)
            return Response(suggestion)

        except json.JSONDecodeError:
            return Response({'error': 'Failed to parse Gemini response.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
