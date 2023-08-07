import sqlite3
import os

userID = 1

# Connect to or create the database file
conn = sqlite3.connect(os.path.join('logging/logs', 'user' + str(userID) + '_log.db'))
cursor = conn.cursor()

# Create the "events" table
cursor.execute('''
    CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        context TEXT,
        action TEXT
    )
''')

# Commit changes and close the connection
conn.commit()
conn.close()