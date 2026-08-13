import json
import urllib.request
import urllib.error

LOGIN_URL = 'http://127.0.0.1:8000/login'
STATS_URL = 'http://127.0.0.1:8000/admin/stats'

payload = {"email": "admin@test.fr", "password": "admin123"}

try:
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(LOGIN_URL, data=data, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=10) as r:
        resp = r.read().decode('utf-8')
    print('LOGIN_RESPONSE:')
    print(resp)
    token = json.loads(resp).get('access_token')
    if not token:
        print('No access_token in response; aborting')
    else:
        req2 = urllib.request.Request(STATS_URL, headers={'Authorization': f'Bearer {token}'})
        with urllib.request.urlopen(req2, timeout=10) as r2:
            resp2 = r2.read().decode('utf-8')
        print('\nADMIN_STATS:')
        print(resp2)
except urllib.error.HTTPError as e:
    try:
        body = e.read().decode('utf-8')
    except Exception:
        body = '<no body>'
    print('HTTPError', e.code, e.reason)
    print(body)
except Exception as e:
    print('Error:', str(e))
