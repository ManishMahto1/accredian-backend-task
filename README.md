# Referral Modal and Backend API

## Project Overview

This project implements a referral system consisting of a React-based referral modal for the frontend and a Node.js/Express.js backend with RESTful APIs. The backend utilizes Prisma ORM to interact with a MySQL database to store referral information and sends email notifications via the Gmail API upon successful referral submissions.

## Features

*   **Referral Modal (Frontend - React):**
    *   Multi-step form for collecting referral details (Friend's Name, Email, Phone, Vertical).
    *   Form validation at each step to ensure data integrity.
    *   Mobile-responsive design.
    *   Clean and user-friendly interface using Tailwind CSS and Lucide React icons.
*   **RESTful APIs (Backend - Node.js/Express.js):**
    *   `POST /api/referrals`: Endpoint to receive and save referral form data.
    *   Data validation on the backend to ensure data integrity.
    *   Error handling for invalid requests and server issues.
*   **Database (MySQL):**
    *   Stores referral information persistently using a MySQL database.
    *   Prisma ORM for type-safe database interactions.
*   **Email Notifications (Gmail API):**
    *   Sends confirmation emails to the referred friend upon successful submission using the Gmail API.

## Technologies Used

**Frontend:**

*   [React](https://reactjs.org/) - JavaScript library for building user interfaces.
*   [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework for styling.
*   [Lucide React](https://lucide.dev/icons) - Icon library.
*   [Vite](https://vitejs.dev/) -  Build tool for fast frontend development.

**Backend:**

*   [Node.js](https://nodejs.org/) - JavaScript runtime environment.
*   [Express.js](https://expressjs.com/) - Web application framework for Node.js.
*   [Prisma ORM](https://www.prisma.io/) - Next-generation ORM for Node.js and TypeScript.
*   [MySQL](https://www.mysql.com/) - Relational database management system.
*   [Gmail API](https://developers.google.com/gmail/api) - Google's API for accessing Gmail.
*   [Nodemailer](https://nodemailer.com/about/) - Node.js library for sending emails.
*   [googleapis](https://www.npmjs.com/package/googleapis) - Node.js client for Google APIs.

**Other:**

*   [npm](https://www.npmjs.com/) - Package manager.
*   [dotenv](https://www.npmjs.com/package/dotenv) - For managing environment variables.
*   [TypeScript](https://www.typescriptlang.org/) (Optional - if you used TypeScript in the backend).

## Setup and Installation

Follow these steps to set up and run the project locally.

### Prerequisites

*   [Node.js](https://nodejs.org/) (version >= 16 recommended) and npm installed.
*   [MySQL Server](https://dev.mysql.com/downloads/mysql/) installed and running.
*   Google Cloud Project with Gmail API enabled and OAuth 2.0 credentials created (see Email Notifications section below).

### Backend Setup (`referral-backend` directory)

1.  **Navigate to the backend directory:**

    ```bash
    cd referral-backend
    ```

2.  **Install backend dependencies:**

    ```bash
    npm install
    ```

3.  **Set up your MySQL database:**

    *   Create a database named `referral_db` (or your preferred name) in your MySQL server.
    *   Create a MySQL user (e.g., `referral_user`) and grant it all privileges to the `referral_db`.
    *   Update the `.env` file in the `referral-backend` directory with your database connection details. Example `.env`:

        ```dotenv
        DATABASE_URL="mysql://referral_user:your_password@localhost:3306/referral_db?schema=public"
        PORT=3001 # Or your preferred port
        GMAIL_REFRESH_TOKEN="YOUR_GMAIL_API_REFRESH_TOKEN" # (See Email Notifications setup)
        ```
        **Note:** You'll need to generate a Gmail API refresh token as described in the "Email Notifications Setup" section below and paste it into `.env`.

4.  **Generate Prisma Client:**

    ```bash
    npx prisma generate
    ```

5.  **Push Prisma schema to database (initial setup):**

    ```bash
    npx prisma db push
    ```

6.  **Start the backend server:**

    ```bash
    npm run dev # For development with nodemon (if configured in package.json)
    # or
    npm start     # For production-like start (if configured)
    # or
    node server.js # If you're not using scripts from package.json
    # or
    npx ts-node server.ts # If using TypeScript and ts-node
    ```

    The backend server should now be running on `http://localhost:3001` (or the port specified in your `.env` file).

### Frontend Setup (`frontend-task` directory)

1.  **Navigate to the frontend directory:**

    ```bash
    cd frontend-task
    ```

2.  **Install frontend dependencies:**

    ```bash
    npm install
    ```

3.  **Start the frontend development server:**

    ```bash
    npm start # or npm run dev, depending on your package.json scripts
    ```

    The frontend should be running on `http://localhost:5173` (or the default Vite development server URL).

## Email Notifications Setup (Gmail API)

To enable email notifications, you need to set up the Gmail API and obtain OAuth 2.0 credentials:

1.  **Enable Gmail API and Create OAuth 2.0 Credentials:** Follow the steps described in the detailed guide provided earlier (search for "Prerequisites" section in the email notification implementation instructions). **Make sure to download the `credentials.json` file and place it in the `referral-backend` directory root.**
2.  **Generate Refresh Token:** Run the `getAccessToken()` function (uncomment it in `server.ts` and run the backend server once) to obtain a refresh token as described in the implementation guide.
3.  **Store Refresh Token:** Copy the generated refresh token and paste it into your `referral-backend/.env` file as the value for `GMAIL_REFRESH_TOKEN`.
4.  **Configure Email in `server.ts`:** Ensure you have updated `'your-gmail-email@gmail.com'` with your actual Gmail address in the `sendReferralEmail` function within `server.ts`.

**Important:** For production deployments, consider using a dedicated email sending service instead of directly using the Gmail API for better reliability and scalability. Also, handle API credentials and refresh tokens securely in a production environment.

## API Endpoints

### `POST /api/referrals`

*   **Description:** Creates a new referral record in the database and sends an email notification to the referred friend.
*   **Request Body (JSON):**

    ```json
    {
      "friendName": "Friend's Name",
      "friendEmail": "friend@email.com",
      "friendPhone": "1234567890",
      "vertical": "Selected Vertical"
    }
    ```

    *   `friendName` (string, required): Name of the referred friend.
    *   `friendEmail` (string, required): Email address of the referred friend (must be a valid email format).
    *   `friendPhone` (string, required): Phone number of the referred friend (must be a 10-digit number).
    *   `vertical` (string, required): Selected vertical/program for referral.

*   **Success Response (201 Created):**

    ```json
    {
      "message": "Referral created successfully",
      "referral": {
        // Referral object details from the database (including ID and timestamps)
      }
    }
    ```

*   **Error Responses:**
    *   **400 Bad Request:** For validation errors (e.g., missing fields, invalid email, invalid phone number). Response body will contain an `error` and `message` describing the validation issue.
    *   **500 Internal Server Error:** For server-side errors (e.g., database connection errors, email sending failures). Response body will contain an `error` and `message` with error details.

## How to Use

1.  **Start both the backend and frontend servers** as described in the "Setup and Installation" section.
2.  **Access the frontend** application in your browser .
3.  **Open the Referral Modal** in the frontend application.
4.  **Fill in the referral form** with your friend's details and select a vertical.
5.  **Submit the form.**
6.  **Upon successful submission:**
    *   The frontend modal will close.
    *   A new referral record will be created in the MySQL database.
    *   An email notification will be sent to the referred friend's email address (check their inbox, and also spam/junk folders if they don't see it in the primary inbox).
    *   You can check the backend server console for logs of successful referral creation and email sending.

## Contributing

[If you are open to contributions, add this section. Otherwise, you can remove it.]

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix (`git checkout -b feature/your-feature-name`).
3.  Make your changes and commit them (`git commit -am 'Add some feature'`).
4.  Push to the branch (`git push origin feature/your-feature-name`).
5.  Create a new Pull Request.

Please ensure your code follows the existing style and includes appropriate tests.

## License

[Choose a license and add it. MIT License is a common permissive license. If you don't want to use an open-source license, you can remove this section.]

This project is licensed under the [MIT License](LICENSE) - see the `LICENSE` file for details.

## Author

[Manish] - [manishmahto378@gmail.com]

---

**Note:** This documentation is a template. Please customize it to accurately reflect the specifics of your project, add more details as needed, and ensure all placeholders are replaced with your actual project information. Consider adding screenshots or diagrams if they help clarify the project setup or usage.