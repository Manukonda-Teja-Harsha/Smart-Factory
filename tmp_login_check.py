import json, urllib.request
payload = json.dumps({'email':'admin@smartfactory.com','password':'Admin@123','remember_me':False}).encode()
req = urllib.request.Request('http://127.0.0.1:8000/api/auth/login', data=payload, headers={'Content-Type':'application/json'})
try:
    with urllib.request.urlopen(req, timeout=10) as r:
        print(r.status)
        print(r.read().decode())
except Exception as e:
    print(type(e).__name__, e)
