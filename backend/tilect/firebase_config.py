import firebase_admin
from firebase_admin import credentials, db

# Initialize Firebase Admin SDK
cred = credentials.Certificate('./firebase-key/firebase-admin-sdk-key.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://kjaxgames-tilect-default-rtdb.firebaseio.com/'
})