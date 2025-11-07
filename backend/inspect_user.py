"""Quick inspector to check if a username exists in approved_users or access_requests.

Usage:
  python inspect_user.py <username>

Reads MONGO_URL and MONGO_DB_NAME from backend/.env (via dotenv).
"""
import os
import sys
from dotenv import load_dotenv
import pymongo

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))

MONGO_URL = os.environ.get('MONGO_URL')
DB_NAME = os.environ.get('MONGO_DB_NAME', 'fraud_detection')
if not MONGO_URL:
    print('MONGO_URL not set in backend/.env or environment')
    sys.exit(1)

client = pymongo.MongoClient(MONGO_URL)
db = client[DB_NAME]

if len(sys.argv) < 2:
    print('Usage: python inspect_user.py <username>')
    sys.exit(1)

username = sys.argv[1]

print(f"Checking username: {username}\n")
approved = db.approved_users.find_one({'username': username})
request = db.access_requests.find_one({'username': username})

print('approved_users:')
if approved:
    approved.pop('_id', None)
    print(approved)
else:
    print('  <not found>')

print('\naccess_requests:')
if request:
    request.pop('_id', None)
    # do not print password hash
    request.pop('password', None)
    print(request)
else:
    print('  <not found>')
