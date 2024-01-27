from django.db import models
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


# Create your models here.


from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

# from sphere.consumers import BillboardConsumer

class Billboard(models.Model):
    content = models.TextField()
    x_position = models.FloatField()
    z_position = models.FloatField()

    def __str__(self):
        return f"Billboard at position ({self.x_position}, {self.z_position})"


# # Signal handler
# @receiver(post_save, sender=Billboard)
# def handle_billboard_update(sender, instance, created, **kwargs):
#     # This function will run every time a Billboard instance is saved
#     message = {
#         'type': 'create' if created else 'update',
#         'content': instance.content,
#         'x_position': instance.x_position,
#         'z_position': instance.z_position
#     }
#     # Get the channel layer
#     channel_layer = get_channel_layer()

#     print(channel_layer)
#     print(message)
    

#     # Group name to send the message to (you can customize this)
#     group_name = "billboard_group"

#     # Send the message to the group (you can customize the group name)
#     async_to_sync(channel_layer.group_send)(group_name, {
#         'type': 'send_message',
#         'message': message
#     })
