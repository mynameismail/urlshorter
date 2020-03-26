import os
from pathlib import Path
from dotenv import load_dotenv
from flask import Flask, jsonify
from models import db, Url

env_path = Path(os.path.dirname(__file__) + '/../.env').resolve()
load_dotenv(dotenv_path=env_path)

sqlite_path = Path(os.path.dirname(__file__) + '/../urlshorter.db').resolve()
app = Flask(__name__, static_folder='ui', static_url_path='/')
app.config['DEBUG'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + str(sqlite_path)

db.init_app(app)
with app.app_context():
    db.create_all()
    urls = Url.query.all()
    if len(urls) == 0:
        db.session.add(Url(name='Urlshorter GitHub', real_url='https://github.com/mynameismail/urlshorter'))
        db.session.commit()

@app.route('/api/login', methods=['POST'])
def login():
    return 'Login'

@app.route('/api/urls', methods=['GET'])
def list_url():
    urls = Url.query.all()
    return {
        'data': list([url.serialize() for url in urls]),
        'message': 'Success'
    }

@app.route('/api/urls', methods=['POST'])
def store_url():
    db.session.add(Url(name='Flask Quickstart', real_url='https://flask.palletsprojects.com/en/1.1.x/quickstart'))
    db.session.commit()
    return 'Store url'

@app.route('/api/urls/<int:id>', methods=['PUT'])
def update_url(id):
    return 'Update url with id = %d' % id

@app.route('/api/urls/<int:id>', methods=['DELETE'])
def delete_url(id):
    return 'Delete url with id = %d' % id

@app.route('/v/<int:id>', methods=['GET'])
def visit_url(path):
    return 'Visit url with id = %d' % id

@app.route('/app', defaults={'path': ''}, methods=['GET'])
@app.route('/app/<path:path>', methods=['GET'])
def catch_all(path):
    return app.send_static_file('app.html')

if __name__ == '__main__':
    app.run()
