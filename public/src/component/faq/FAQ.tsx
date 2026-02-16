import React from 'react';
import styles from "./faq.module.css";

function FAQ() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.avatar}>❓</div>
        <div className={styles.title}>
          <h1>MERN Stack Interview Questions</h1>
          <p>Most frequently asked questions with detailed answers</p>
        </div>
      </header>

      {/* JavaScript Fundamentals */}
      <section className={styles.category}>
        <h2>JavaScript Fundamentals</h2>
        
        <details className={styles.question}>
          <summary className={styles.summary}>
            <strong>1. What is the difference between let, const, and var?</strong>
          </summary>
          <div className={styles.answer}>
            <p><strong>var:</strong> Function-scoped, can be redeclared and reassigned, hoisted with undefined value.</p>
            <p><strong>let:</strong> Block-scoped, can be reassigned but not redeclared in same scope, not hoisted.</p>
            <p><strong>const:</strong> Block-scoped, cannot be reassigned or redeclared, must be initialized during declaration.</p>
            <div className={styles.code}>
              <pre>
                <code>{`// var - function scoped
function example() {
  var x = 1;
  if (true) {
    var x = 2; // Same variable
    console.log(x); // 2
  }
  console.log(x); // 2
}

// let - block scoped
function example() {
  let x = 1;
  if (true) {
    let x = 2; // Different variable
    console.log(x); // 2
  }
  console.log(x); // 1
}

// const - cannot reassign
const PI = 3.14;
// PI = 3.15; // Error: Assignment to constant`}</code>
              </pre>
            </div>
          </div>
        </details>

        <details className={styles.question}>
          <summary className={styles.summary}>
            <strong>2. Explain hoisting in JavaScript with examples</strong>
          </summary>
          <div className={styles.answer}>
            <p>Hoisting is JavaScript's behavior of moving declarations to the top of their scope before code execution.</p>
            <p><strong>Function declarations</strong> are fully hoisted - can be called before declaration.</p>
            <p><strong>var variables</strong> are hoisted but initialized with undefined.</p>
            <p><strong>let/const variables</strong> are hoisted but not initialized (Temporal Dead Zone).</p>
            <div className={styles.code}>
              <pre>
                <code>{`// Function hoisting - WORKS
sayHello(); // "Hello!"
function sayHello() {
  console.log("Hello!");
}

// var hoisting - value is undefined
console.log(x); // undefined
var x = 5;

// let/const hoisting - ERROR
console.log(y); // ReferenceError: Cannot access before initialization
let y = 10;`}</code>
              </pre>
            </div>
          </div>
        </details>

        <details className={styles.question}>
          <summary className={styles.summary}>
            <strong>3. What are arrow functions and how do they differ from regular functions?</strong>
          </summary>
          <div className={styles.answer}>
            <p><strong>Arrow functions</strong> provide shorter syntax and don't have their own <code>this</code> context.</p>
            <p><strong>Key differences:</strong></p>
            <ul>
              <li>No <code>this</code> binding - inherits from parent scope</li>
              <li>Cannot be used as constructors</li>
              <li>No <code>arguments</code> object</li>
              <li>Shorter syntax for simple functions</li>
            </ul>
            <div className={styles.code}>
              <pre>
                <code>{`// Regular function
function add(a, b) {
  return a + b;
}

// Arrow function
const add = (a, b) => a + b;

// 'this' context difference
const obj = {
  name: "John",
  regular: function() {
    console.log(this.name); // "John"
  },
  arrow: () => {
    console.log(this.name); // undefined (inherits window scope)
  }
};`}</code>
              </pre>
            </div>
          </div>
        </details>

        <details className={styles.question}>
          <summary className={styles.summary}>
            <strong>4. Explain destructuring in JavaScript with examples</strong>
          </summary>
          <div className={styles.answer}>
            <p>Destructuring allows extracting values from arrays or properties from objects into distinct variables.</p>
            <div className={styles.code}>
              <pre>
                <code>{`// Array destructuring
const numbers = [1, 2, 3];
const [first, second, third] = numbers;
console.log(first); // 1

// Object destructuring
const user = { name: "John", age: 30, email: "john@email.com" };
const { name, age } = user;
console.log(name); // "John"

// Function parameter destructuring
function bookRoom({ roomId, guestName, nights = 1 }) {
  return \`Booking \${roomId} for \${guestName} - \${nights} nights\`;
}

// Nested destructuring
const hotel = {
  name: "Grand Plaza",
  location: { city: "NYC", country: "USA" }
};
const { name, location: { city } } = hotel;
console.log(city); // "NYC"`}</code>
              </pre>
            </div>
          </div>
        </details>

        <details className={styles.question}>
          <summary className={styles.summary}>
            <strong>5. What are template literals and their advantages?</strong>
          </summary>
          <div className={styles.answer}>
            <p>Template literals use backticks (`) for string interpolation and multi-line strings.</p>
            <p><strong>Advantages:</strong></p>
            <ul>
              <li>String interpolation with <code>variable</code></li>
              <li>Multi-line strings without concatenation</li>
              <li>Embed expressions directly</li>
              <li>Cleaner and more readable code</li>
            </ul>
            <div className={styles.code}>
              <pre>
                <code>{`const name = "Alice";
const roomNumber = 305;
const nights = 3;

// Old way - concatenation
const message1 = "Hello " + name + ", your room " + roomNumber + 
  " is ready for " + nights + " nights.";

// Template literal - cleaner
const message2 = \`Hello \${name}, your room \${roomNumber} is ready for \${nights} nights.\`;

// Multi-line string
const receipt = \`
  === HOTEL RECEIPT ===
  Guest: \${name}
  Room: \${roomNumber}
  Total: $\${120 * nights}
  =====================
\`;`}</code>
              </pre>
            </div>
          </div>
        </details>
      </section>

      {/* Node.js & Express.js */}
      <section className={styles.category}>
        <h2>Node.js & Express.js</h2>

        <details className={styles.question}>
          <summary className={styles.summary}>
            <strong>6. What is Express.js and why is it used?</strong>
          </summary>
          <div className={styles.answer}>
            <p><strong>Express.js</strong> is a minimal and flexible Node.js web application framework that provides robust features for building web and mobile applications.</p>
            <p><strong>Why use Express.js:</strong></p>
            <ul>
              <li>Simplifies server creation and routing</li>
              <li>Middleware support for request processing</li>
              <li>Easy integration with template engines and databases</li>
              <li>Large ecosystem of plugins and middleware</li>
              <li>Lightweight and fast</li>
            </ul>
            <div className={styles.code}>
              <pre>
                <code>{`import express from 'express';
const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});

app.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});`}</code>
              </pre>
            </div>
          </div>
        </details>

        <details className={styles.question}>
          <summary className={styles.summary}>
            <strong>7. Explain different types of routing in Express.js</strong>
          </summary>
          <div className={styles.answer}>
            <p>Express.js supports three main types of routing:</p>
            <p><strong>1. Basic Routes:</strong> Fixed URL paths</p>
            <p><strong>2. Dynamic Routes:</strong> Routes with parameters using <code>:param</code></p>
            <p><strong>3. Query String Routes:</strong> Routes with optional query parameters</p>
            <div className={styles.code}>
              <pre>
                <code>{`// 1. Basic Routes
app.get('/api/users', (req, res) => {
  res.json({ message: 'Get all users' });
});

app.post('/api/register', (req, res) => {
  res.json({ message: 'User registered' });
});

// 2. Dynamic Routes
app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  res.json({ message: \`Get user \${userId}\` });
});

// 3. Query String Routes
app.get('/api/search', (req, res) => {
  const { name, location, price } = req.query;
  res.json({ name, location, price });
});`}</code>
              </pre>
            </div>
          </div>
        </details>

        <details className={styles.question}>
          <summary className={styles.summary}>
            <strong>8. What is middleware in Express.js? Give examples</strong>
          </summary>
          <div className={styles.answer}>
            <p><strong>Middleware</strong> are functions that have access to the request and response objects, and the next middleware function in the application's request-response cycle.</p>
            <p><strong>Common middleware examples:</strong></p>
            <ul>
              <li><code>express.json()</code> - Parses JSON request bodies</li>
              <li><code>express.urlencoded()</code> - Parses URL-encoded data</li>
              <li><code>cors()</code> - Enables Cross-Origin Resource Sharing</li>
              <li>Custom authentication middleware</li>
            </ul>
            <div className={styles.code}>
              <pre>
                <code>{`import express from 'express';
import cors from 'cors';

const app = express();

// Built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Third-party middleware
app.use(cors());

// Custom middleware
const logger = (req, res, next) => {
  console.log(\`\${req.method} \${req.url}\`);
  next();
};
app.use(logger);

// Route-specific middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied' });
  next();
};

app.get('/api/profile', auth, (req, res) => {
  res.json({ message: 'Protected route' });
});`}</code>
              </pre>
            </div>
          </div>
        </details>

        <details className={styles.question}>
          <summary className={styles.summary}>
            <strong>9. What is CORS and why is it needed?</strong>
          </summary>
          <div className={styles.answer}>
            <p><strong>CORS (Cross-Origin Resource Sharing)</strong> is a security mechanism that allows or restricts resources on a web page to be requested from another domain outside the domain from which the first resource was served.</p>
            <p><strong>Why CORS is needed:</strong></p>
            <ul>
              <li>Browser security feature to prevent cross-site requests</li>
              <li>Required when frontend and backend are on different domains/ports</li>
              <li>Prevents malicious scripts from making unauthorized requests</li>
            </ul>
            <div className={styles.code}>
              <pre>
                <code>{`// Without CORS - Browser blocks request
// Frontend: http://localhost:5173
// Backend: http://localhost:3000
fetch('http://localhost:3000/api/users') // CORS error

// With CORS enabled
import cors from 'cors';
app.use(cors());

// Or configure specific origins
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));`}</code>
              </pre>
            </div>
          </div>
        </details>
      </section>

      {/* Authentication & Security */}
      <section className={styles.category}>
        <h2>Authentication & Security</h2>

        <details className={styles.question}>
          <summary className={styles.summary}>
            <strong>10. Why should we hash passwords and how does bcrypt work?</strong>
          </summary>
          <div className={styles.answer}>
            <p><strong>Password hashing</strong> is essential for security to prevent storing passwords in plain text.</p>
            <p><strong>Why hash passwords:</strong></p>
            <ul>
              <li>Prevents plain text storage in database</li>
              <li>Protects user data even if database is compromised</li>
              <li>Industry security standard</li>
            </ul>
            <p><strong>How bcrypt works:</strong></p>
            <ul>
              <li>Generates salt (random data) before hashing</li>
              <li>Uses work factor to control hashing complexity</li>
              <li>Produces irreversible hash strings</li>
            </ul>
            <div className={styles.code}>
              <pre>
                <code>{`import bcrypt from 'bcrypt';

// Hash password during registration
const register = async (req, res) => {
  const { email, password } = req.body;
  
  // Hash password with salt rounds
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Store hashed password in database
  await db.query('INSERT INTO users (email, password) VALUES (?, ?)', 
    [email, hashedPassword]);
};

// Verify password during login
const login = async (req, res) => {
  const { email, password } = req.body;
  
  // Get user from database
  const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  const user = users[0];
  
  // Compare password with hash
  const isMatch = await bcrypt.compare(password, user.password);
  
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Login successful
  res.json({ message: 'Login successful' });
};`}</code>
              </pre>
            </div>
          </div>
        </details>

        <details className={styles.question}>
          <summary className={styles.summary}>
            <strong>11. Explain JWT tokens and their structure</strong>
          </summary>
          <div className={styles.answer}>
            <p><strong>JWT (JSON Web Token)</strong> is a compact, URL-safe means of representing claims to be transferred between two parties.</p>
            <p><strong>JWT Structure (3 parts separated by dots):</strong></p>
            <ul>
              <li><strong>Header:</strong> Algorithm and token type</li>
              <li><strong>Payload:</strong> Claims (user data) and metadata</li>
              <li><strong>Signature:</strong> Verifies token authenticity</li>
            </ul>
            <p><strong>Format:</strong> header.payload.signature</p>
            <div className={styles.code}>
              <pre>
                <code>{`import jwt from 'jsonwebtoken';

// Create JWT token
const token = jwt.sign(
  {
    id: user.id,
    email: user.email,
    name: user.name
  },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

// Token structure:
// Header: { "alg": "HS256", "typ": "JWT" }
// Payload: { "id": 123, "email": "user@email.com", "exp": 1234567890 }
// Signature: HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)

// Verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};`}</code>
              </pre>
            </div>
          </div>
        </details>

        <details className={styles.question}>
          <summary className={styles.summary}>
            <strong>12. What are environment variables and why use them?</strong>
          </summary>
          <div className={styles.answer}>
            <p><strong>Environment variables</strong> are external configuration values stored outside the codebase.</p>
            <p><strong>Why use environment variables:</strong></p>
            <ul>
              <li>Security: Keep sensitive data out of code</li>
              <li>Configuration: Different values for different environments</li>
              <li>Flexibility: Easy to change without code modification</li>
              <li>Best Practice: Industry standard for application configuration</li>
            </ul>
            <div className={styles.code}>
              <pre>
                <code>{`// .env file (never commit to version control)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_secure_password
DB_NAME=hotel_management
JWT_SECRET=your_jwt_secret_key
PORT=3000

// In code - using dotenv
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

const port = process.env.PORT || 3000;

// .gitignore - add this line
.env
.env.local`}</code>
              </pre>
            </div>
          </div>
        </details>
      </section>

      {/* Database & MVC */}
      <section className={styles.category}>
        <h2>Database & MVC Architecture</h2>

        <details className={styles.question}>
          <summary className={styles.summary}>
            <strong>13. Explain MVC architecture in Express.js</strong>
          </summary>
          <div className={styles.answer}>
            <p><strong>MVC (Model-View-Controller)</strong> is a software design pattern that separates application logic into three interconnected components.</p>
            <p><strong>Components:</strong></p>
            <ul>
              <li><strong>Model:</strong> Handles data logic and database operations</li>
              <li><strong>View:</strong> Handles presentation layer (UI)</li>
              <li><strong>Controller:</strong> Handles business logic and request processing</li>
            </ul>
            <div className={styles.code}>
              <pre>
                <code>{`// Model (models/db.js) - Database connection
import mysql from 'mysql2/promise';
const db = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME
});
export default db;

// Controller (controllers/userController.js) - Business logic
import db from '../models/db.js';
export const getUsers = async (req, res) => {
  try {
    const [users] = await db.query('SELECT * FROM users');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Router (routes/userRoutes.js) - Route definitions
import express from 'express';
import { getUsers } from '../controllers/userController.js';
const router = express.Router();
router.get('/users', getUsers);
export { router };`}</code>
              </pre>
            </div>
          </div>
        </details>

        <details className={styles.question}>
          <summary className={styles.summary}>
            <strong>14. What is a connection pool and why use it?</strong>
          </summary>
          <div className={styles.answer}>
            <p><strong>Connection pool</strong> is a cache of database connections maintained so that the connections can be reused when future requests to the database are required.</p>
            <p><strong>Why use connection pools:</strong></p>
            <ul>
              <li><strong>Performance:</strong> Reuses existing connections instead of creating new ones</li>
              <li><strong>Efficiency:</strong> Manages multiple concurrent connections</li>
              <li><strong>Reliability:</strong> Automatic reconnection if connection fails</li>
              <li><strong>Scalability:</strong> Handles high traffic with connection limits</li>
            </ul>
            <div className={styles.code}>
              <pre>
                <code>{`import mysql from 'mysql2/promise';

// Create connection pool
const db = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,      // Max simultaneous connections
  queueLimit: 0,            // Unlimited queued requests
  acquireTimeout: 60000,    // 60 seconds timeout
  reconnect: true           // Auto-reconnect
});

// Using connection pool
const [users] = await db.query('SELECT * FROM users');
// Connection automatically returned to pool after query`}</code>
              </pre>
            </div>
          </div>
        </details>

        <details className={styles.question}>
          <summary className={styles.summary}>
            <strong>15. How does async/await work and why use it?</strong>
          </summary>
          <div className={styles.answer}>
            <p><strong>Async/await</strong> is syntactic sugar built on top of promises that makes asynchronous code look and behave more like synchronous code.</p>
            <p><strong>How it works:</strong></p>
            <ul>
              <li><code>async</code> function always returns a promise</li>
              <li><code>await</code> pauses execution until promise is resolved</li>
              <li>Automatic error handling with try/catch</li>
            </ul>
            <div className={styles.code}>
              <pre>
                <code>{`// Promise version (callback hell)
function getData() {
  return fetch('/api/users')
    .then(response => response.json())
    .then(users => {
      return fetch(\`/api/users/\${users[0].id}\`);
    })
    .then(user => console.log(user))
    .catch(error => console.error(error));
}

// Async/await version (cleaner)
async function getData() {
  try {
    const response = await fetch('/api/users');
    const users = await response.json();
    const userResponse = await fetch(\`/api/users/\${users[0].id}\`);
    const user = await userResponse.json();
    console.log(user);
  } catch (error) {
    console.error(error);
  }
}

// In Express routes
const getUser = async (req, res) => {
  try {
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, data: users[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};`}</code>
              </pre>
            </div>
          </div>
        </details>
      </section>

      {/* Project Setup & Tools */}
      <section className={styles.category}>
        <h2>Project Setup & Tools</h2>

        <details className={styles.question}>
          <summary className={styles.summary}>
            <strong>16. What is Vite and why is it better than Create React App?</strong>
          </summary>
          <div className={styles.answer}>
            <p><strong>Vite</strong> is a modern frontend build tool that provides a faster and leaner development experience.</p>
            <p><strong>Advantages over Create React App:</strong></p>
            <ul>
              <li><strong>Faster dev server:</strong> Uses native ES modules</li>
              <li><strong>Hot Module Replacement (HMR):</strong> Instant updates</li>
              <li><strong>Optimized builds:</strong> Faster production builds</li>
              <li><strong>Modern tooling:</strong> Built on esbuild and Rollup</li>
              <li><strong>Better developer experience:</strong> Faster startup and updates</li>
            </ul>
            <div className={styles.code}>
              <pre>
                <code>{`# Create Vite project
npm create vite@latest my-app -- --template react

# Project structure:
my-app/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── App.css
├── index.html
├── vite.config.js
└── package.json

# Start development server
npm run dev
# Server runs at http://localhost:5173`}</code>
              </pre>
            </div>
          </div>
        </details>

        <details className={styles.question}>
          <summary className={styles.summary}>
            <strong>17. Explain package.json and its important fields</strong>
          </summary>
          <div className={styles.answer}>
            <p><strong>package.json</strong> is the manifest file for Node.js projects containing metadata and dependencies.</p>
            <p><strong>Important fields:</strong></p>
            <ul>
              <li><strong>name:</strong> Project name</li>
              <li><strong>version:</strong> Project version</li>
              <li><strong>type:</strong> "module" for ES6 imports</li>
              <li><strong>scripts:</strong> Custom npm commands</li>
              <li><strong>dependencies:</strong> Production dependencies</li>
              <li><strong>devDependencies:</strong> Development dependencies</li>
            </ul>
            <div className={styles.code}>
              <pre>
                <code>{`{
  "name": "hotel-management",
  "version": "1.0.0",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^5.1.0",
    "bcrypt": "^6.0.0",
    "jsonwebtoken": "^9.0.2",
    "mysql2": "^3.15.2",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.1.10",
    "dotenv": "^17.2.3"
  }
}`}</code>
              </pre>
            </div>
          </div>
        </details>

        <details className={styles.question}>
          <summary className={styles.summary}>
            <strong>18. What is the difference between dependencies and devDependencies?</strong>
          </summary>
          <div className={styles.answer}>
            <p><strong>dependencies:</strong> Packages required for the application to run in production.</p>
            <p><strong>devDependencies:</strong> Packages only needed for development and testing.</p>
            <div className={styles.comparison}>
              <div className={styles.comparisonItem}>
                <h4>Dependencies (Production)</h4>
                <ul>
                  <li>express - Web framework</li>
                  <li>bcrypt - Password hashing</li>
                  <li>jsonwebtoken - Authentication</li>
                  <li>mysql2 - Database driver</li>
                  <li>cors - Cross-origin requests</li>
                </ul>
              </div>
              <div className={styles.comparisonItem}>
                <h4>DevDependencies (Development)</h4>
                <ul>
                  <li>nodemon - Auto-restart server</li>
                  <li>dotenv - Environment variables</li>
                  <li>jest - Testing framework</li>
                  <li>eslint - Code linting</li>
                  <li>prettier - Code formatting</li>
                </ul>
              </div>
            </div>
            <div className={styles.code}>
              <pre>
                <code>{`# Install as dependency (production)
npm install express bcrypt

# Install as devDependency (development)
npm install -D nodemon dotenv

# package.json result:
{
  "dependencies": {
    "express": "^5.1.0",
    "bcrypt": "^6.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.10",
    "dotenv": "^17.2.3"
  }
}`}</code>
              </pre>
            </div>
          </div>
        </details>
      </section>

      <div className={styles.tips}>
        <h3>💡 Interview Tips</h3>
        <ul>
          <li>Practice explaining concepts in simple terms</li>
          <li>Be prepared to write code on whiteboard or online editor</li>
          <li>Understand the "why" behind each concept</li>
          <li>Be honest about what you don't know</li>
          <li>Ask clarifying questions if needed</li>
          <li>Show enthusiasm for learning and problem-solving</li>
        </ul>
      </div>
    </div>
  );
}

export default FAQ;