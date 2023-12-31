# Payment System Backend

Welcome to the Payment System Backend repository! This Node.js application is built using Express, Prisma with MySQL as the database, and integrates with the dLocal payment gateway. It provides a robust and flexible platform for managing payments and related functionalities.

## Features

### User Authentication
- Complete user authentication system to secure access to the system.
- User roles and permissions for fine-grained access control.

### Logging
- Comprehensive logging system for tracking and monitoring application activities.
- Logs are collected to facilitate debugging, analysis, and auditing.

### Product Category System
- Organize products using a category system for better product management.
- Create, update, and delete product categories as needed.

### Products System
- Manage products, including adding new products, updating existing ones, and deleting products.
- Associate products with categories for better organization.

### Orders System
- Place orders, view order history, and manage order status.
- Secure payment processing through the dLocal payment gateway.
- Support for order customization and special instructions.

### Company System
- Support for running multiple customers within the same environment.
- Isolate customer data and settings to ensure data integrity and security.
- Easily manage and switch between different customer accounts.

## Getting Started

Follow these steps to set up and run the Payment System Backend on your local environment:

1. Clone this repository:
```bash
git clone https://github.com/hlatki01/payments-system-backend.git
cd payment-system-backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure your environment variables:
Create a .env file in the project root and specify your configuration settings, including database connection details and dLocal API keys.

4. Set up the database schema:
```bash
npx prisma migrate dev
```

5. Seed the database:
```bash
npm run seed
```

6. Start the application:
```bash
npm run dev
```

The Payment System Backend should now be up and running on your local machine.

## API Documentation
For detailed information on available API endpoints and how to use them, refer to the API Documentation (WIP).

## Contributing
We wholeheartedly welcome contributions to enhance the Payment System Backend. Whether you're interested in addressing bugs or introducing exciting new features, your contributions are highly valued and encouraged.

## License
This project is licensed under the MIT License.

## Contact
If you have any questions or need assistance, feel free to open an issue.

Thank you for using the Payment System Backend! We hope it helps streamline your payment management process.


