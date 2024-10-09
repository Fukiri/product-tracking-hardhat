# Product Tracking Database Setup

This README provides instructions on how to set up the PostgreSQL database for the Product Tracking application.

## Prerequisites

- Ensure you have a compatible operating system (Windows, macOS, or Linux).
- Internet connection to download PostgreSQL.

## Installation Steps

1. **Download PostgreSQL:**

   - Go to the [official PostgreSQL website](https://www.postgresql.org/download/) and download the installer for your operating system.

2. **Run the Installer:**

   - Launch the PostgreSQL installer.
   - During installation, ensure you select the following components:
     - **PostgreSQL Server**
     - **Command Line Tools**
     - **pgAdmin 4** (if you need a GUI for managing the database)
   - Click **Next** to proceed.

3. **Set Password:**

   - Set a strong password for the default PostgreSQL user (`postgres`). **Make sure to remember this password!**
   - The default username is `postgres` and the default port is `5432`.

4. **Complete Installation:**
   - Wait for the installation to finish. Once done, you can close the installer.


## Accessing the Command Line PostgreSQL

- After installation, you can access the PostgreSQL command line interface (psql) to run SQL commands directly.
- **Windows:**
  - Open the **Command Prompt** or **PowerShell**.
  - Type the following command to access PostgreSQL:
    ```bash
    psql -U postgres
    ```
  - Enter the password you set during installation.

- **macOS/Linux:**
  - Open the **Terminal**.
  - Type the following command:
    ```bash
    psql -U postgres
    ```
  - Enter the password when prompted.



## Database Setup

1. **Open Terminal:**

   - Navigate to the directory of your project:
     ```bash
     cd product-tracking-hardhat/product-tracking-database
     ```

2. **Create Database and Tables:**
   - Execute the following command to create the necessary tables, triggers, and insert an admin account along with some mock data:
     ```bash
     psql -U postgres -f setup_database.sql
     ```
   - Enter the password you set earlier when prompted.

## Configuring the Express Server

1. **Edit Configuration:**

   - Open `index.js` located in the `product-tracking-hardhat/product-tracking-database` directory.
   - Scroll down to line 17 where you'll find a placeholder for your PostgreSQL password. Replace it with the password you created during the installation.

2. **Start the Server:**
   - In the terminal, navigate to product-tracking-hardhat/product-tracking-database, run the following command to start the Express server:
     ```bash
     node index.js
     ```
	The server is now listening on http://localhost:5000.

## PostgreSQL Commands

- For basic PostgreSQL commands, you can refer to [GeeksforGeeks PostgreSQL psql Commands](https://www.geeksforgeeks.org/postgresql-psql-commands/).

## User Access

- You can sign up or log in through the website.
- To access the admin page, use the following credentials:
  - **Email ID:** admin@etherweave.com
  - **Password:** admin

## Mock Data

- Initial mock data is stored in the `mock_data.txt` file. 


## Troubleshooting

- If you encounter any issues during installation or setup, refer to the official PostgreSQL documentation or seek assistance in relevant forums.