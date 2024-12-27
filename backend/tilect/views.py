from django.shortcuts import render

# Create your views here.

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import firebase_admin
from firebase_admin import db
from .firebase_config import firebase_admin

@csrf_exempt  # Temporarily disable CSRF for simplicity (use a better solution in production)
def create_game(request):
    if request.method == 'POST':
        # Get player data (you can extend this to add more player data)
        player = request.POST.get('player', 'Guest')

        # Create a new game object in Firebase Realtime Database
        game_ref = db.reference('gameRooms')
        new_game_ref = game_ref.push({
            'players': {
                player: {
                    'name': player,
                    'score': 0,
                }
            },
            'gameState': {
                'turn': player,
                'board': Array(9).fill(null),  # Initialize an empty board for a 3x3 game
            }
        })

        # Return the new game object created
        return JsonResponse({'gameId': new_game_ref.key, 'gameState': new_game_ref.get()})
    return JsonResponse({'error': 'Invalid request'}, status=400)