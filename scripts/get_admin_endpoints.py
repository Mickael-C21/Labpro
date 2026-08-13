import json
import urllib.request

LOGIN_URL = 'http://127.0.0.1:8000/login'
USERS_URL = 'http://127.0.0.1:8000/users'
CALLS_URL = 'http://127.0.0.1:8000/calls'

payload = {"email": "admin@test.fr", "password": "admin123"}

try:
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(LOGIN_URL, data=data, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=10) as r:
        resp = json.loads(r.read().decode('utf-8'))
    token = resp.get('access_token')
    if not token:
        print('Login failed')
    else:
        print('Logged in as admin, fetching /users and /calls...')
        req_users = urllib.request.Request(USERS_URL, headers={'Authorization': f'Bearer {token}'})
        with urllib.request.urlopen(req_users, timeout=10) as r:
            users = json.loads(r.read().decode('utf-8'))
        print('\n/users:')
        print(json.dumps(users, indent=2, ensure_ascii=False))

        req_calls = urllib.request.Request(CALLS_URL, headers={'Authorization': f'Bearer {token}'})
        with urllib.request.urlopen(req_calls, timeout=10) as r:
            calls = json.loads(r.read().decode('utf-8'))
        print('\n/calls:')
        print(json.dumps(calls, indent=2, ensure_ascii=False))

except Exception as e:
    print('Error:', e)
