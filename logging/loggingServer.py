import sqlite3
from queue import Queue
from threading import Lock
import threading
import os

userID = 1

class ConnectionPool:
    def __init__(self, max_connections, userID):
        self.max_connections = max_connections
        self.connections = Queue(max_connections)
        self.lock = Lock()
        
        # print(f"working dir: {os.getcwd()}")
        # print(os.path.join('logs', 'user' + str(userID) + '_log.db'))
        for _ in range(max_connections):
            connection = sqlite3.connect(os.path.join('logs', 'user' + str(userID) + '_log.db'))
            self.connections.put(connection)
    
    def get_connection(self):
        # return self.connections.get()

        # Return a new connection for the current thread
        return sqlite3.connect(os.path.join('logs', 'user' + str(userID) + '_log.db'))
    
    def release_connection(self, connection):
        # self.connections.put(connection)

        connection.close()

# Create a connection pool with a maximum of 5 connections
connection_pool = ConnectionPool(max_connections=5, userID=userID)

# Use thread-local storage to store connections for each thread
thread_local = threading.local()

def get_thread_connection():
    # Get or create a connection for the current thread
    if not hasattr(thread_local, "connection"):
        thread_local.connection = connection_pool.get_connection()
    return thread_local.connection

def release_thread_connection():
    # Release the connection for the current thread
    if hasattr(thread_local, "connection"):
        connection_pool.release_connection(thread_local.connection)
        del thread_local.connection





from flask import Flask, render_template, request
from flask_cors import CORS
# import sqlite3
# import os


app = Flask(__name__)
CORS(app, origins=["http://localhost:2222"])  # Allow CORS for all routes

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/add_event', methods=['POST'])
def add_event():

    # raw_data = request.data.decode('utf-8')  # Decode raw data to string
    # app.logger.debug("Raw Request Data:" + raw_data)
    # app.logger.debug(str(request.form.get('context')))
    # app.logger.debug("END")

    print(f"request: {request.args}")
    context = request.form.get('context')
    action = request.form.get('action')

    app.logger.debug("context " + str(context))
    app.logger.debug("action " + str(action))
    app.logger.debug("END")
    
    # Get a connection from the pool
    connection = get_thread_connection()
    cursor = connection.cursor()
    
    try:
        cursor.execute('INSERT INTO events (context, action) VALUES (?, ?)', (context, action))
        connection.commit()
    except Exception as e:
        connection.rollback()
        raise e
    finally:
        # Release the connection back to the pool
        connection_pool.release_connection(connection)
    
    return 'Event added successfully'

if __name__ == '__main__':
    app.run(debug=True)