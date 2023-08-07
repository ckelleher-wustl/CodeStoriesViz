import sqlite3
from queue import Queue
from threading import Lock

class ConnectionPool:
    def __init__(self, max_connections, userID):
        self.max_connections = max_connections
        self.connections = Queue(max_connections)
        self.lock = Lock()
        
        for _ in range(max_connections):
            connection = sqlite3.connect("logging/logs/user" + userID + "_log.db")
            self.connections.put(connection)
    
    def get_connection(self):
        return self.connections.get()
    
    def release_connection(self, connection):
        self.connections.put(connection)

# Create a connection pool with a maximum of 5 connections
connection_pool = ConnectionPool(max_connections=5)