import React from "react";
import styles from "./MVCStructure.module.css";

function MVCStructure() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.avatar}>🚀</div>
        <div className={styles.title}>
          <h1>MERN Backend Setup - Complete Guide</h1>
          <p>
            Step-by-step explanation of our MVC architecture and dependencies
          </p>
        </div>
      </header>

      {/* Project Initialization */}
      <section className={styles.card}>
        <h3>1. Project Initialization - npm init -y</h3>
        <p>
          <strong>What it does:</strong> Creates a <code>package.json</code>{" "}
          file with default values
          <br />
          <strong>Why we need it:</strong> This file tracks our dependencies,
          scripts, and project configuration
        </p>
        <div className={styles.code}>
          <pre>
            <code>{`// Terminal Command
npm init -y

// Creates package.json with:
{
  "name": "server",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}`}</code>
          </pre>
        </div>
      </section>

      {/* Dependencies Installation */}
      <section className={styles.card}>
        <h3>2. Installing Dependencies</h3>
        <p>
          <strong>Why we need these packages:</strong>
        </p>
        <div className={styles.dependencyList}>
          <div className={styles.dependencyItem}>
            <strong>express</strong> - Web framework for building APIs and
            handling HTTP requests
          </div>
          <div className={styles.dependencyItem}>
            <strong>nodemon</strong> - Automatically restarts server when files
            change (development only)
          </div>
          <div className={styles.dependencyItem}>
            <strong>dotenv</strong> - Loads environment variables from .env file
            for security
          </div>
          <div className={styles.dependencyItem}>
            <strong>mysql2</strong> - MySQL database driver for Node.js with
            promise support
          </div>
        </div>
        <div className={styles.code}>
          <pre>
            <code>{`// Terminal Command
npm install express nodemon dotenv mysql2

// Updated package.json dependencies:
"dependencies": {
  "express": "^5.1.0",
  "nodemon": "^3.1.10",
  "dotenv": "^17.2.3",
  "mysql2": "^3.15.2"
}`}</code>
          </pre>
        </div>
      </section>

      {/* Package.json Configuration */}
      <section className={styles.card}>
        <h3>3. Configuring package.json</h3>
        <p>
          <strong>Key configurations explained:</strong>
        </p>
        <div className={styles.configList}>
          <div className={styles.configItem}>
            <strong>"type": "module"</strong> - Enables ES6 import/export syntax
            instead of CommonJS
          </div>
          <div className={styles.configItem}>
            <strong>"start": "node server.js"</strong> - Production script to
            run server
          </div>
          <div className={styles.configItem}>
            <strong>"dev": "nodemon server.js"</strong> - Development script
            with auto-restart
          </div>
        </div>
        <div className={styles.code}>
          <pre>
            <code>{`{
  "name": "server",
  "version": "1.0.0",
  "main": "server.js",
  "type": "module",           // ← Enables ES6 imports
  "scripts": {
    "start": "node server.js",    // ← Production
    "dev": "nodemon server.js"    // ← Development
  },
  "dependencies": {
    "express": "^5.1.0",
    "nodemon": "^3.1.10"
  }
}`}</code>
          </pre>
        </div>
      </section>

      {/* Server.js - Main Entry Point */}
      <section className={styles.card}>
        <h3>4. server.js - The Main Entry Point</h3>
        <p>
          <strong>What is a server?</strong> A program that listens for incoming
          network requests and responds to them
          <br />
          <strong>What is a port?</strong> A numbered gate (3000) where our
          server listens for requests
        </p>
        <div className={styles.code}>
          <pre>
            <code>{`import express from "express";
import { router } from "./router/router.js";

// Create Express application
const app = express();
const port = 3000;

// Middleware: Parse JSON request bodies
app.use(express.json());

// Routes: All API routes start with /api
app.use('/api', router);

// Basic route to test server
app.get("/", (req, res) => {
  res.json({ msg: "You are on the server side" });
});

// Start listening on port 3000
app.listen(port, () => {
  console.log(\`Server running on http://localhost:\${port}\`);
});`}</code>
          </pre>
        </div>
        <div className={styles.explanation}>
          <h4>Key Concepts Explained:</h4>
          <div className={styles.concept}>
            <strong>express.json()</strong> - Middleware that parses incoming
            JSON requests and makes them available in <code>req.body</code>
          </div>
          <div className={styles.concept}>
            <strong>app.use('/api', router)</strong> - Mounts all routes from
            router.js under the <code>/api</code> base URL
          </div>
          <div className={styles.concept}>
            <strong>Base URL</strong> - The root address of our API:{" "}
            <code>http://localhost:3000/api</code>
          </div>
        </div>
      </section>

      {/* Router Layer */}
      <section className={styles.card}>
        <h3>5. Router Layer - Route Definitions</h3>
        <p>
          <strong>What are routes/endpoints?</strong> URLs that define where
          clients can send requests
          <br />
          <strong>HTTP Methods:</strong> GET (read), POST (create), PUT
          (update), DELETE (remove)
        </p>
        <div className={styles.code}>
          <pre>
            <code>{`import express from 'express';
import { users } from '../controller/user/user.js';
import register from '../controller/user/register.js';
import login from '../controller/user/login.js';
import tables from '../controller/tables.js';

const router = express.Router();

// Define endpoints and connect to controllers
router.get("/user", users);        // GET /api/user
router.post("/register", register); // POST /api/register
router.post("/login", login);       // POST /api/login
router.get('/table', tables);       // GET /api/table

export { router }`}</code>
          </pre>
        </div>
        <div className={styles.endpointExamples}>
          <h4>Complete API Endpoints:</h4>
          <div className={styles.endpoint}>
            <code>GET http://localhost:3000/api/user</code> - Get all users
          </div>
          <div className={styles.endpoint}>
            <code>POST http://localhost:3000/api/register</code> - Create new
            user
          </div>
          <div className={styles.endpoint}>
            <code>POST http://localhost:3000/api/login</code> - User
            authentication
          </div>
          <div className={styles.endpoint}>
            <code>GET http://localhost:3000/api/table</code> - Create database
            tables
          </div>
        </div>
      </section>

      {/* Controller Layer */}
      <section className={styles.card}>
        <h3>6. Controller Layer - Business Logic</h3>
        <p>
          <strong>What controllers do:</strong> Handle the application logic,
          process requests, and send responses
          <br />
          <strong>Separation of concerns:</strong> Controllers focus on business
          logic, not database operations
        </p>
        <div className={styles.controllerExamples}>
          <div className={styles.controllerFile}>
            <h4>register.js - User Registration</h4>
            <div className={styles.code}>
              <pre>
                <code>{`const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // 1. Validate input
    // 2. Hash password
    // 3. Save to database
    // 4. Send response
    
    res.json({ 
      success: true, 
      message: "User registered successfully" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

export default register;`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Model Layer */}
      <section className={styles.card}>
        <h3>7. Model Layer - Database Connection</h3>
        <p>
          <strong>What models do:</strong> Handle all database operations and
          data logic
          <br />
          <strong>Why separate models:</strong> Keep database code organized and
          reusable across controllers
        </p>
        <div className={styles.code}>
          <pre>
            <code>{`import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create database connection pool
const db = await mysql.createPool({
  host: process.env.dbhost,      // Database server address
  user: process.env.dbuser,      // Database username
  password: process.env.dbpassword, // Database password
  database: process.env.dbdatabase  // Database name
});

console.log('Database connected successfully');
export default db;`}</code>
          </pre>
        </div>
        <div className={styles.explanation}>
          <h4>Environment Variables (.env file):</h4>
          <div className={styles.envVars}>
            <code>dbhost=localhost</code>
            <code>dbuser=root</code>
            <code>dbpassword=yourpassword</code>
            <code>dbdatabase=hotel_management</code>
          </div>
          <p>
            <strong>Why use environment variables?</strong> Keep sensitive
            information out of code and easily configurable for different
            environments (development, production).
          </p>
        </div>
      </section>

      {/* Complete Flow Visualization */}
      <section className={styles.card}>
        <h3>8. Complete Request-Response Flow</h3>
        <p>How a request travels through our entire application:</p>

        <div className={styles.flow}>
          <div className={styles.flowStep}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <strong>Client sends request:</strong>
              <code>POST http://localhost:3000/api/register</code>
            </div>
          </div>

          <div className={styles.flowArrow}>↓</div>

          <div className={styles.flowStep}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <strong>server.js receives request</strong> and parses JSON body
            </div>
          </div>

          <div className={styles.flowArrow}>↓</div>

          <div className={styles.flowStep}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <strong>router.js routes</strong> to appropriate controller based
              on URL and method
            </div>
          </div>

          <div className={styles.flowArrow}>↓</div>

          <div className={styles.flowStep}>
            <div className={styles.stepNumber}>4</div>
            <div className={styles.stepContent}>
              <strong>Controller (register.js)</strong> handles business logic,
              uses model for database operations
            </div>
          </div>

          <div className={styles.flowArrow}>↓</div>

          <div className={styles.flowStep}>
            <div className={styles.stepNumber}>5</div>
            <div className={styles.stepContent}>
              <strong>Model (db.js)</strong> executes database queries and
              returns results
            </div>
          </div>

          <div className={styles.flowArrow}>↓</div>

          <div className={styles.flowStep}>
            <div className={styles.stepNumber}>6</div>
            <div className={styles.stepContent}>
              <strong>Response flows back</strong> through the same path to
              client
            </div>
          </div>
        </div>
      </section>

      {/* Folder Structure */}
      <section className={styles.card}>
        <h3>9. MVC Folder Structure</h3>
        <p>Organized separation of concerns for maintainable code:</p>
        <div className={styles.folderStructure}>
          <div className={styles.folder}>
            <span className={styles.folderIcon}>📁</span>
            <span className={styles.folderName}>server/</span>
            <div className={styles.children}>
              <div className={styles.file}>
                <span className={styles.fileIcon}>📦</span>
                <span>package.json</span> - Dependencies & scripts
              </div>
              <div className={styles.file}>
                <span className={styles.fileIcon}>🚀</span>
                <span>server.js</span> - Main entry point
              </div>

              <div className={styles.folder}>
                <span className={styles.folderIcon}>📁</span>
                <span className={styles.folderName}>controller/</span>
                <div className={styles.children}>
                  <div className={styles.folder}>
                    <span className={styles.folderIcon}>📁</span>
                    <span className={styles.folderName}>user/</span>
                    <div className={styles.children}>
                      <div className={styles.file}>
                        <span className={styles.fileIcon}>📜</span>
                        <span>user.js</span> - User operations
                      </div>
                      <div className={styles.file}>
                        <span className={styles.fileIcon}>📜</span>
                        <span>register.js</span> - Registration logic
                      </div>
                      <div className={styles.file}>
                        <span className={styles.fileIcon}>📜</span>
                        <span>login.js</span> - Authentication logic
                      </div>
                    </div>
                  </div>
                  <div className={styles.file}>
                    <span className={styles.fileIcon}>📜</span>
                    <span>tables.js</span> - Database setup
                  </div>
                </div>
              </div>

              <div className={styles.folder}>
                <span className={styles.folderIcon}>📁</span>
                <span className={styles.folderName}>model/</span>
                <div className={styles.children}>
                  <div className={styles.file}>
                    <span className={styles.fileIcon}>📜</span>
                    <span>db.js</span> - Database connection
                  </div>
                </div>
              </div>

              <div className={styles.folder}>
                <span className={styles.folderIcon}>📁</span>
                <span className={styles.folderName}>router/</span>
                <div className={styles.children}>
                  <div className={styles.file}>
                    <span className={styles.fileIcon}>📜</span>
                    <span>router.js</span> - Route definitions
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className={styles.summary}>
        <h4>Key Takeaways</h4>
        <ul>
          <li>
            <strong>package.json</strong> is the heart of our Node.js project
            configuration
          </li>
          <li>
            <strong>Express.js</strong> provides the framework for building web
            servers and APIs
          </li>
          <li>
            <strong>MVC Pattern</strong> separates concerns: Models (data),
            Views (UI), Controllers (logic)
          </li>
          <li>
            <strong>Routes/Endpoints</strong> define how clients interact with
            our API
          </li>
          <li>
            <strong>Middleware</strong> like express.json() processes requests
            before they reach routes
          </li>
          <li>
            <strong>Environment Variables</strong> keep sensitive configuration
            secure and flexible
          </li>
          <li>
            <strong>Port 3000</strong> is where our server listens for incoming
            requests
          </li>
        </ul>
      </section>
    </div>
  );
}

export default MVCStructure;
