from django.core.management.base import BaseCommand
from sphere.models import Billboard  # Replace ... with the actual path

class Command(BaseCommand):
    help = 'Handles the queue for search terms'

    def handle(self, *args, **kwargs):
        
        billboard = Billboard.objects.all().first()

        billboard.content = "fdsaf"
        billboard.x_position = -1
        billboard.z_position = -3
        billboard.save()
