from django.shortcuts import render
from django.http import JsonResponse
from .models import Billboard


def home(request):
    return render(request, 'home.html')



def get_billboard_data(request):
    billboards = Billboard.objects.all().values('content', 'x_position', 'z_position')
    return JsonResponse(list(billboards), safe=False)



