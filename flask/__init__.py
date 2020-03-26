from flask import Flask
app = Flask(__name__, static_folder='ui', static_url_path='/')

@app.route('/api/login', methods=['POST'])
def login():
    return 'Login'

@app.route('/api/urls', methods=['GET'])
def list_url():
    return 'List url'

@app.route('/api/urls', methods=['POST'])
def store_url():
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
