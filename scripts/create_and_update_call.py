import json
import urllib.request

LOGIN_URL = 'http://127.0.0.1:8000/login'
CALLS_URL = 'http://127.0.0.1:8000/calls'

# Login as admin (will also act as the caller in this simple test)
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
        print('Creating a test call...')
        new_call = {
            "product_id": None,
            "call_type": "appointment",
            "name": "Test Caller",
            "phone": "+33123456789",
            "email": "caller@test.fr",
            "subject": "Demande de maintenance",
            "scheduled_at": None
        }
        req_create = urllib.request.Request(CALLS_URL, data=json.dumps(new_call).encode('utf-8'), headers={'Content-Type': 'application/json','Authorization': f'Bearer {token}'})
        with urllib.request.urlopen(req_create, timeout=10) as r:
            created = json.loads(r.read().decode('utf-8'))
        print('Created call:')
        print(json.dumps(created, indent=2, ensure_ascii=False))

        call_id = created.get('id')
        if not call_id:
            print('No id found for created call')
        else:
            print('\nUpdating the call (mark as completed with feedback)...')
            update = {"status": "completed", "feedback": "Intervention réalisée", "result": "resolved"}
            req_update = urllib.request.Request(f"{CALLS_URL}/{call_id}", data=json.dumps(update).encode('utf-8'), method='PATCH', headers={'Content-Type': 'application/json','Authorization': f'Bearer {token}'})
            with urllib.request.urlopen(req_update, timeout=10) as r:
                updated = json.loads(r.read().decode('utf-8'))
            print('Updated call:')
            print(json.dumps(updated, indent=2, ensure_ascii=False))

except urllib.error.HTTPError as e:
    try:
        body = e.read().decode('utf-8')
    except Exception:
        body = '<no body>'
    print('HTTPError', e.code, e.reason)
    print(body)
except Exception as e:
    print('Error:', e)
