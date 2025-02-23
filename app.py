from flask import Flask, jsonify, request
import sqlite3

app = Flask(__name__)

# Connect to the database
def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

# Home Route
@app.route('/')
def home():
    return "Welcome to the AI Finance Manager Backend!"

# Fetch All Transactions
@app.route('/transactions', methods=['GET'])
def get_transactions():
    conn = get_db_connection()
    transactions = conn.execute('SELECT * FROM transactions').fetchall()
    conn.close()
    return jsonify([dict(row) for row in transactions])

# Add a New Transaction
@app.route('/transactions', methods=['POST'])
def add_transaction():
    data = request.json
    conn = get_db_connection()
    conn.execute('''
        INSERT INTO transactions (description, amount, type, category) 
        VALUES (?, ?, ?, ?)
    ''', (data['description'], data['amount'], data['type'], data['category']))
    
    conn.commit()
    conn.close()
    return jsonify({"message": "Transaction added successfully!"}), 201

if __name__ == '__main__':
    app.run(debug=True)
