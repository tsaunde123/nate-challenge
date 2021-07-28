from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def time(request):
    import time
    return Response({"time": time.time()})
