import os, re
from pathlib import Path
from dotenv import load_dotenv
from flask import Flask, request, redirect
from functools import wraps
from models import db, Url

env_path = Path(os.path.dirname(__file__) + '/../.env').resolve()
load_dotenv(dotenv_path=env_path)

app = Flask(__name__, static_folder='ui', static_url_path='/')
sqlite_path = Path(os.path.dirname(__file__) + '/../urlshorter.db').resolve()
app.config['DEBUG'] = True
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + str(sqlite_path)

db.init_app(app)
with app.app_context():
    db.create_all()
    urls = Url.query.all()
    if len(urls) == 0:
        db.session.add(Url(name='Urlshorter GitHub', real_url='https://github.com/mynameismail/urlshorter'))
        db.session.commit()

def basic_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth = request.authorization
        if auth and auth.username == os.getenv('APP_USERNAME') and auth.password == os.getenv('APP_PASSWORD'):
            return f(*args, **kwargs)

        return 'Unauthorized', 401
    return decorated_function

@app.route('/api/login', methods=['POST'])
def login():
    req_body = request.get_json(force=True)
    username = req_body['username'] if 'username' in req_body else ''
    password = req_body['password'] if 'password' in req_body else ''

    if username == os.getenv('APP_USERNAME') and password == os.getenv('APP_PASSWORD'):
        return 'Correct login', 200
    
    return 'Wrong login', 401

@app.route('/api/urls', methods=['GET'])
@basic_auth
def list_url():
    try:
        urls = Url.query.all()
        return {
            'data': list([url.serialize() for url in urls]),
            'message': 'Success'
        }, 200
    except:
        pass

    return 'Error', 500

@app.route('/api/urls', methods=['POST'])
@basic_auth
def store_url():
    req_body = request.get_json(force=True)
    name = (req_body['name'] if 'name' in req_body else '') or 'New URL'
    real_url = req_body['real_url'] if 'real_url' in req_body else ''
    if not real_url:
        return 'Bad request', 400
    
    try:
        new_url = Url(name=name, real_url=real_url)
        db.session.add(new_url)
        db.session.commit()
        return 'Success', 200
    except:
        pass

    return 'Error', 500

@app.route('/api/urls/<int:id>', methods=['PUT'])
@basic_auth
def update_url(id):
    req_body = request.get_json(force=True)
    name = req_body['name'] if 'name' in req_body else ''
    real_url = req_body['real_url'] if 'real_url' in req_body else ''
    if not real_url:
        return 'Bad request', 400

    try:
        url = Url.query.get(id)
        if url:
            url.name = name
            url.real_url = real_url
            db.session.commit()
            return 'Success', 200
        else:
            return 'Not found', 404
    except:
        pass

    return 'Error', 500

@app.route('/api/urls/<int:id>', methods=['DELETE'])
@basic_auth
def delete_url(id):
    try:
        url = Url.query.get(id)
        if url:
            db.session.delete(url)
            db.session.commit()
            return 'Success', 200
        else:
            return 'Not found', 404
    except:
        pass

    return 'Error', 500

@app.route('/v/<int:id>', methods=['GET'])
def visit_url(id):
    try:
        url = Url.query.get(id)
        if url:
            url.visited = url.visited + 1
            db.session.commit()
            return redirect(url.real_url)
        else:
            return 'Not found', 404
    except:
        pass

    return 'Error', 500

@app.route('/app', defaults={'path': ''}, methods=['GET'])
@app.route('/app/<path:path>', methods=['GET'])
def catch_all(path):
    return app.send_static_file('app.html')

if __name__ == '__main__':
    app.run()
