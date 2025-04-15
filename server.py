from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import os
from datetime import datetime
from urllib.parse import urlparse, parse_qs

# Simple in-memory database
users = []
transactions = []

class BankHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def do_POST(self):
        if self.path == '/api/register':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data)
            
            # Check if email already exists
            if any(user['email'] == data['email'] for user in users):
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Email already exists'}).encode())
                return
            
            # Create new user
            new_user = {
                'id': len(users) + 1,
                'name': data['name'],
                'email': data['email'],
                'phone': data['phone'],
                'address': data['address'],
                'password': data['password'],  # In real app, hash this
                'balance': 0.0,
                'totalDeposits': 0.0,
                'totalWithdrawals': 0.0
            }
            users.append(new_user)
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'message': 'Registration successful'}).encode())
            
        elif self.path == '/api/login':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data)
            
            user = next((user for user in users if user['email'] == data['email'] and user['password'] == data['password']), None)
            
            if user:
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'token': str(user['id']),  # Simple token, in real app use JWT
                    'user': {
                        'name': user['name'],
                        'email': user['email'],
                        'balance': user['balance'],
                        'totalDeposits': user['totalDeposits'],
                        'totalWithdrawals': user['totalWithdrawals']
                    }
                }).encode())
            else:
                self.send_response(401)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Invalid credentials'}).encode())
                
        elif self.path == '/api/transactions':
            token = self.headers.get('Authorization', '').split(' ')[-1]
            user = next((user for user in users if str(user['id']) == token), None)
            
            if not user:
                self.send_response(401)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Unauthorized'}).encode())
                return
                
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data)
            
            # Process transaction
            amount = float(data['amount'])
            if data['type'] == 'withdrawal' and user['balance'] < amount:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Insufficient funds'}).encode())
                return
                
            # Update user balance
            if data['type'] == 'deposit':
                user['balance'] += amount
                user['totalDeposits'] += amount
            elif data['type'] == 'withdrawal':
                user['balance'] -= amount
                user['totalWithdrawals'] += amount
                
            # Record transaction
            transaction = {
                'id': len(transactions) + 1,
                'userId': user['id'],
                'type': data['type'],
                'amount': amount,
                'description': data['description'],
                'date': datetime.now().isoformat(),
                'status': 'completed'
            }
            transactions.append(transaction)
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'message': 'Transaction successful',
                'balance': user['balance']
            }).encode())
            
    def do_GET(self):
        if self.path == '/api/user':
            token = self.headers.get('Authorization', '').split(' ')[-1]
            user = next((user for user in users if str(user['id']) == token), None)
            
            if not user:
                self.send_response(401)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Unauthorized'}).encode())
                return
                
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'name': user['name'],
                'email': user['email'],
                'phone': user['phone'],
                'address': user['address'],
                'balance': user['balance'],
                'totalDeposits': user['totalDeposits'],
                'totalWithdrawals': user['totalWithdrawals']
            }).encode())
            
        elif self.path == '/api/transactions':
            token = self.headers.get('Authorization', '').split(' ')[-1]
            user = next((user for user in users if str(user['id']) == token), None)
            
            if not user:
                self.send_response(401)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Unauthorized'}).encode())
                return
                
            user_transactions = [t for t in transactions if t['userId'] == user['id']]
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(user_transactions).encode())
            
        else:
            # Handle static files and HTML pages
            path = self.path
            if path == '/':
                path = '/index.html'
            
            # Get the file extension
            _, ext = os.path.splitext(path)
            
            # Set appropriate content type
            content_type = {
                '.html': 'text/html',
                '.css': 'text/css',
                '.js': 'application/javascript',
                '.json': 'application/json',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.gif': 'image/gif',
                '.svg': 'image/svg+xml',
                '.ico': 'image/x-icon'
            }.get(ext, 'text/plain')
            
            try:
                # Open and read the file
                with open('.' + path, 'rb') as file:
                    self.send_response(200)
                    self.send_header('Content-type', content_type)
                    self.end_headers()
                    self.wfile.write(file.read())
            except FileNotFoundError:
                self.send_response(404)
                self.send_header('Content-type', 'text/html')
                self.end_headers()
                self.wfile.write(b'404 Not Found')
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'text/html')
                self.end_headers()
                self.wfile.write(b'500 Internal Server Error')

def run(server_class=HTTPServer, handler_class=BankHandler, port=8000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f'Starting server on port {port}...')
    httpd.serve_forever()

if __name__ == '__main__':
    run() 