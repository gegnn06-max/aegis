"""Admin CLI to approve or deny access requests directly via MongoDB.

Usage:
  python admin_approve.py approve <username> [--role user]
  python admin_approve.py deny <username> [--reason "...]

This script requires the backend .env MONGO_URL and MONGO_DB_NAME to be set.
"""
import os
import sys
from dotenv import load_dotenv
import pymongo
from datetime import datetime

load_dotenv()

MONGO_URL = os.environ.get('MONGO_URL')
DB_NAME = os.environ.get('MONGO_DB_NAME', 'fraud_detection')
if not MONGO_URL:
    print('MONGO_URL not set in environment. Fill backend/.env or your environment variables.')
    sys.exit(1)

client = pymongo.MongoClient(MONGO_URL)
db = client[DB_NAME]


def approve(username, role='user'):
    req = db.access_requests.find_one({'username': username})
    if not req:
        print('Access request not found for', username)
        return

    existing = db.approved_users.find_one({'$or': [{'username': username}, {'email': req.get('email')}]})
    if existing:
        print('User already exists in approved_users. Marking request approved for audit.')
        db.access_requests.update_one({'username': username}, {'$set': {'status': 'approved', 'updated_at': datetime.utcnow(), 'approved_at': datetime.utcnow()}})
        return

    new_user = {
        'username': req['username'],
        'email': req.get('email'),
        'password': req['password'],
        'role': role,
        'created_at': datetime.utcnow()
    }
    db.approved_users.insert_one(new_user)
    db.access_requests.update_one({'username': username}, {'$set': {'status': 'approved', 'updated_at': datetime.utcnow(), 'approved_at': datetime.utcnow()}})
    print('Approved and created user', username)


def deny(username, reason=None):
    req = db.access_requests.find_one({'username': username})
    if not req:
        print('Access request not found for', username)
        return
    update = {'status': 'denied', 'updated_at': datetime.utcnow(), 'denied_at': datetime.utcnow()}
    if reason:
        update['denied_reason'] = reason
    db.access_requests.update_one({'username': username}, {'$set': update})
    print('Denied access request for', username)


if __name__ == '__main__':
    if len(sys.argv) < 3:
        print('Usage: python admin_approve.py <approve|deny> <username> [--role ROLE] [--reason "text"]')
        sys.exit(1)

    cmd = sys.argv[1]
    username = sys.argv[2]
    role = 'user'
    reason = None

    # parse optional flags
    for i in range(3, len(sys.argv)):
        if sys.argv[i] == '--role' and i+1 < len(sys.argv):
            role = sys.argv[i+1]
        if sys.argv[i] == '--reason' and i+1 < len(sys.argv):
            reason = sys.argv[i+1]

    if cmd == 'approve':
        approve(username, role)
    elif cmd == 'deny':
        deny(username, reason)
    else:
        print('Unknown command', cmd)
