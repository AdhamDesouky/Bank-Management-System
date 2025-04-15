# Bank Management System

A modern web-based bank management system with a clean, responsive interface built using HTML, CSS, and JavaScript.

## Features

- User Authentication (Login/Register)
- Account Management
- Transaction Processing (Deposits, Withdrawals)
- Real-time Balance Updates
- Transaction History
- Responsive Design
- Modern UI with Bootstrap

## Technologies Used

- Frontend:
  - HTML5
  - CSS3
  - JavaScript (ES6+)
  - Bootstrap 5
  - Font Awesome Icons

- Backend:
  - Python HTTP Server
  - JSON-based API
  - In-memory Database

## Getting Started

1. Make sure you have Python 3.x installed
2. Clone this repository
3. Run the server:
   ```bash
   python server.py
   ```
4. Open your browser and navigate to `http://localhost:8000`

## Project Structure

```
bank-management-system/
├── index.html          # Main landing page
├── dashboard.html      # User dashboard
├── styles.css         # Custom styles
├── script.js          # Main JavaScript
├── dashboard.js       # Dashboard functionality
├── server.py          # Python HTTP server
└── README.md          # Project documentation
```

## API Endpoints

- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `GET /api/user` - Get user profile
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions` - Create new transaction

## Security Features

- Basic authentication
- Input validation
- Error handling
- Secure password storage (in-memory)

## Future Enhancements

- Database integration
- Email verification
- Two-factor authentication
- Transaction notifications
- Account statements
- Admin dashboard

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License. 