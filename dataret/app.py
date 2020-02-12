from flask import Flask
from modeltest import data_reader
app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/dataretrieval')
def dynamic_page():
    return data_reader()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port='8018', debug=True)