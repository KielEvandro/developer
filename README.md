# Developer Tools MCP Server

This project exposes a set of developer-focused tools over the Model Context Protocol (MCP), allowing remote execution of scripts, file operations, and SQL queries on a Linux server via a secure HTTP API.

## Exposed Tools

The following tools are available via MCP:

- **write-file**: Write content to a file, with optional owner, group, and permissions.
- **read-file**: Read the contents of a file.
- **sql-query**: Run SQL queries on a configured MySQL database.
- **bash-script**: Execute a bash script in a specified directory.
- **exec-command**: Run a shell command in a specified directory.
- **python-script**: Execute a Python script in a specified directory.
- **php-script**: Execute a PHP script in a specified directory.
- **java-script**: Execute a JavaScript (Node.js) script in a specified directory.

Each tool validates input and returns structured output, including error details if execution fails.

---

## Installation & Setup

### 1. Clone the repository

```sh
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### 2. Install dependencies

```sh
npm install
```

### 3. Configure environment

Copy `.env.example` to `.env` and fill in your settings:

```env
LOG_LEVEL=info
MCP_PORT=4000
MCP_TOKEN=abcd1234
DB_HOST=your-mysql-host
DB_USER=your-mysql-user
DB_PASS=your-mysql-password
```

### 4. Run the server

```sh
node developer.mjs
```

### 5. (Optional) Run tests

```sh
npm test
```

---

## Systemd Service Setup

To run as a background service on Linux:

1. Copy `developer.service` to your systemd directory:

   ```sh
   sudo cp developer.service /usr/lib/systemd/system/developer.service
   ```

2. Edit the service file as needed:
   - Set `WorkingDirectory` and `ExecStart` to your app’s location and main file.
   - Set `EnvironmentFile` to your `.env` location.
   - Change `User` and `Group` to a non-root user.

3. Reload systemd and enable the service:

   ```sh
   sudo systemctl daemon-reload
   sudo systemctl enable developer.service
   sudo systemctl start developer.service
   sudo systemctl status developer.service
   ```

---

## Security & Best Practices

- **Keep your `.env` file secret**—never commit it to version control.
- Use a dedicated, non-root user for running the service.
- Only expose the MCP port to trusted networks.

---

## Support

Email: <russell.purinton@gmail.com>  
Discord: laozi101

---
