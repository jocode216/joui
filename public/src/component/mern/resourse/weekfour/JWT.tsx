import React from "react";
import styles from "./weekfour.module.css";

function WeekFour() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.avatar}>🔐</div>
        <div className={styles.title}>
          <h1>Authentication & Security</h1>
          <p>
            Understanding bcrypt, JWT tokens, and CORS for secure web
            applications
          </p>
        </div>
      </header>

      {/* Bcrypt Explanation */}
      <section className={styles.card}>
        <h3>1. Bcrypt - Password Hashing</h3>
        <p>
          <strong>What is bcrypt?</strong> A library for hashing passwords
          securely before storing them in the database
        </p>

        <div className={styles.conceptGrid}>
          <div className={styles.concept}>
            <h4>🔒 Why Hash Passwords?</h4>
            <ul>
              <li>
                <strong>Security:</strong> Prevents plain text password storage
              </li>
              <li>
                <strong>Data Protection:</strong> Even if database is
                compromised, passwords are safe
              </li>
              <li>
                <strong>Best Practice:</strong> Industry standard for user
                authentication
              </li>
            </ul>
          </div>

          <div className={styles.concept}>
            <h4>⚡ How Bcrypt Works</h4>
            <ul>
              <li>
                <strong>Hashing:</strong> Converts password to irreversible
                string
              </li>
              <li>
                <strong>Salting:</strong> Adds random data before hashing
              </li>
              <li>
                <strong>Work Factor:</strong> Configurable complexity (10-12
                recommended)
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.codeComparison}>
          <div className={styles.codeExample}>
            <h4>❌ Without Bcrypt (Dangerous)</h4>
            <div className={styles.code}>
              <pre>
                <code>{`// Password stored in plain text - UNSAFE!
const insertUser = \`
  INSERT INTO users (email, password) 
  VALUES (?, ?)
\`;

await db.query(insertUser, [email, password]);

// Database stores: "myPassword123" 
// Hackers can read it directly!`}</code>
              </pre>
            </div>
          </div>

          <div className={styles.codeExample}>
            <h4>✅ With Bcrypt (Secure)</h4>
            <div className={styles.code}>
              <pre>
                <code>{`// Password hashed before storage - SECURE!
import bcrypt from 'bcrypt';

// Hash password with salt rounds
const hashedPassword = await bcrypt.hash(password, 10);

const insertUser = \`
  INSERT INTO users (email, password) 
  VALUES (?, ?)
\`;

await db.query(insertUser, [email, hashedPassword]);

// Database stores: "$2b$10$X4zL6M8yVfFhGJkL9N2qR.Tc..."
// Impossible to reverse to original password!`}</code>
              </pre>
            </div>
          </div>
        </div>

        <div className={styles.registrationFlow}>
          <h4>Registration Flow with Bcrypt</h4>
          <div className={styles.flowSteps}>
            <div className={styles.flowStep}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <strong>User submits registration form</strong>
                <code>{`password: "mySecurePassword123"`}</code>
              </div>
            </div>
            <div className={styles.flowArrow}>↓</div>
            <div className={styles.flowStep}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <strong>Server hashes password</strong>
                <code>{`bcrypt.hash(password, 10)`}</code>
              </div>
            </div>
            <div className={styles.flowArrow}>↓</div>
            <div className={styles.flowStep}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <strong>Store hashed version in database</strong>
                <code>{`$2b$10$X4zL6M8yVfFhGJkL9N2qR...`}</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JWT Explanation */}
      <section className={styles.card}>
        <h3>2. JWT (JSON Web Tokens)</h3>
        <p>
          <strong>What are JWTs?</strong> Compact, URL-safe tokens that securely
          transmit information between parties as JSON objects
        </p>

        <div className={styles.conceptGrid}>
          <div className={styles.concept}>
            <h4>🎫 JWT Structure</h4>
            <ul>
              <li>
                <strong>Header:</strong> Algorithm & token type
              </li>
              <li>
                <strong>Payload:</strong> User data (id, email, name)
              </li>
              <li>
                <strong>Signature:</strong> Verifies token authenticity
              </li>
            </ul>
          </div>

          <div className={styles.concept}>
            <h4>🔑 Why Use JWT?</h4>
            <ul>
              <li>
                <strong>Stateless:</strong> No session storage needed
              </li>
              <li>
                <strong>Secure:</strong> Digitally signed and verified
              </li>
              <li>
                <strong>Portable:</strong> Contains all user information
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.codeComparison}>
          <div className={styles.codeExample}>
            <h4>JWT Token Creation</h4>
            <div className={styles.code}>
              <pre>
                <code>{`import jwt from 'jsonwebtoken';

// Create JWT token after successful login
const token = jwt.sign(
  {
    id: user.id,
    email: user.email,
    name: user.name
  },
  process.env.JWT_SECRET,  // Secret key from .env
  { expiresIn: '7d' }      // Token expires in 7 days
);

// Response to client
res.json({
  success: true,
  token: token,
  user: {
    id: user.id,
    name: user.name,
    email: user.email
  }
});`}</code>
              </pre>
            </div>
          </div>

          <div className={styles.codeExample}>
            <h4>JWT Token Verification</h4>
            <div className={styles.code}>
              <pre>
                <code>{`import jwt from 'jsonwebtoken';

// Middleware to verify JWT tokens
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access denied. No token provided.' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Add user data to request
    next();  // Continue to next middleware/route
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

// Protected route
app.get('/api/profile', verifyToken, (req, res) => {
  res.json({ 
    success: true, 
    user: req.user 
  });
});`}</code>
              </pre>
            </div>
          </div>
        </div>

        <div className={styles.authFlow}>
          <h4>Authentication Flow with JWT</h4>
          <div className={styles.flowSteps}>
            <div className={styles.flowStep}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <strong>User logs in</strong>
                <code>POST /api/login</code>
              </div>
            </div>
            <div className={styles.flowArrow}>↓</div>
            <div className={styles.flowStep}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <strong>Server validates credentials</strong>
                <code>bcrypt.compare(password, hash)</code>
              </div>
            </div>
            <div className={styles.flowArrow}>↓</div>
            <div className={styles.flowStep}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <strong>Create JWT token</strong>
                <code>jwt.sign(userData, secret)</code>
              </div>
            </div>
            <div className={styles.flowArrow}>↓</div>
            <div className={styles.flowStep}>
              <div className={styles.stepNumber}>4</div>
              <div className={styles.stepContent}>
                <strong>Client stores token</strong>
                <code>localStorage or cookies</code>
              </div>
            </div>
            <div className={styles.flowArrow}>↓</div>
            <div className={styles.flowStep}>
              <div className={styles.stepNumber}>5</div>
              <div className={styles.stepContent}>
                <strong>Send token with requests</strong>
                <code>Authorization: Bearer token</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORS Explanation */}
      <section className={styles.card}>
        <h3>3. CORS (Cross-Origin Resource Sharing)</h3>
        <p>
          <strong>What is CORS?</strong> A security mechanism that allows or
          restricts resources on a web page to be requested from another domain
        </p>

        <div className={styles.conceptGrid}>
          <div className={styles.concept}>
            <h4>🌐 The Problem</h4>
            <ul>
              <li>
                <strong>Frontend:</strong> http://localhost:5173 (Vite)
              </li>
              <li>
                <strong>Backend:</strong> http://localhost:3000 (Express)
              </li>
              <li>
                <strong>Different origins = CORS error</strong>
              </li>
            </ul>
          </div>

          <div className={styles.concept}>
            <h4>✅ The Solution</h4>
            <ul>
              <li>
                <strong>CORS middleware</strong> enables cross-origin requests
              </li>
              <li>
                <strong>Specify allowed origins</strong> (frontend URLs)
              </li>
              <li>
                <strong>Control HTTP methods</strong> and headers
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.codeComparison}>
          <div className={styles.codeExample}>
            <h4>❌ Without CORS</h4>
            <div className={styles.code}>
              <pre>
                <code>{`// Frontend trying to call backend
fetch('http://localhost:3000/api/users')
  .then(response => response.json())
  .then(data => console.log(data));

// Browser Console Error:
// Access to fetch at 'http://localhost:3000/api/users' 
// from origin 'http://localhost:5173' has been blocked 
// by CORS policy: No 'Access-Control-Allow-Origin' 
// header is present on the requested resource.`}</code>
              </pre>
            </div>
          </div>

          <div className={styles.codeExample}>
            <h4>✅ With CORS Enabled</h4>
            <div className={styles.code}>
              <pre>
                <code>{`import express from 'express';
import cors from 'cors';

const app = express();

// Enable CORS for all routes
app.use(cors());

// Or configure specific origins
app.use(cors({
  origin: 'http://localhost:5173',  // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true  // Allow cookies if needed
}));

// Now frontend can successfully call:
// fetch('http://localhost:3000/api/users')`}</code>
              </pre>
            </div>
          </div>
        </div>

        <div className={styles.installation}>
          <h4>Installation & Setup</h4>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h5>Install CORS package</h5>
                <div className={styles.code}>
                  <pre>
                    <code>npm install cors</code>
                  </pre>
                </div>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h5>Import and use in server.js</h5>
                <div className={styles.code}>
                  <pre>
                    <code>{`import cors from 'cors';
app.use(cors());`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Authentication Example */}
      <section className={styles.card}>
        <h3>4. Complete Authentication System</h3>
        <p>
          Putting it all together - Registration, Login, and Protected Routes
        </p>

        <div className={styles.code}>
          <pre>
            <code>{`// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router } from './router/router.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', router);

app.listen(3000, () => {
  console.log('Server running with CORS enabled');
});

// router.js
import express from 'express';
import register from '../controller/user/register.js';
import login from '../controller/user/login.js';
import { getProfile } from '../controller/user/profile.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', getProfile);  // Protected route

export { router };

// register.js
import db from "../../model/db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const register = async (req, res) => {
  const { name, email, password, phone, image } = req.body;

  try {
    // Check if user exists
    const [existingUser] = await db.query(
      'SELECT * FROM users WHERE email = ?', 
      [email]
    );

    if (existingUser.length > 0) {
      return res.json({ msg: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, phone, image) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone, image]
    );

    // Create JWT token
    const token = jwt.sign(
      { id: result.insertId, email, name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      msg: 'User registered successfully',
      token,
      user: { id: result.insertId, name, email, phone, image }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ msg: 'Server error during registration' });
  }
};

export default register;

// login.js  
import db from "../../model/db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.json({ msg: 'User not found' });
    }

    const user = users[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.json({ msg: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        image: user.image,
        phone: user.phone 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      msg: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        phone: user.phone
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ msg: 'Server error during login' });
  }
};

export default login;`}</code>
          </pre>
        </div>
      </section>

      {/* Security Best Practices */}
      <section className={styles.card}>
        <h3>5. Security Best Practices</h3>

        <div className={styles.bestPractices}>
          <div className={styles.practice}>
            <h4>🔐 Password Security</h4>
            <ul>
              <li>
                Always use <strong>bcrypt</strong> for password hashing
              </li>
              <li>
                Use <strong>salt rounds 10-12</strong> for optimal security
              </li>
              <li>Never store passwords in plain text</li>
            </ul>
          </div>

          <div className={styles.practice}>
            <h4>🎫 JWT Security</h4>
            <ul>
              <li>
                Store <strong>JWT_SECRET</strong> in environment variables
              </li>
              <li>
                Set appropriate <strong>expiration times</strong> (7d, 1d)
              </li>
              <li>Don't store sensitive data in JWT payload</li>
            </ul>
          </div>

          <div className={styles.practice}>
            <h4>🌐 CORS Configuration</h4>
            <ul>
              <li>
                Specify <strong>exact origins</strong> in production
              </li>
              <li>
                Use <strong>environment variables</strong> for allowed origins
              </li>
              <li>
                Limit <strong>HTTP methods</strong> to only what's needed
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className={styles.summary}>
        <h4>Key Takeaways</h4>
        <ul>
          <li>
            <strong>Bcrypt:</strong> Securely hash passwords before database
            storage
          </li>
          <li>
            <strong>JWT Tokens:</strong> Stateless authentication tokens
            containing user data
          </li>
          <li>
            <strong>CORS:</strong> Enables cross-origin requests between
            frontend and backend
          </li>
          <li>
            <strong>Environment Variables:</strong> Store secrets like
            JWT_SECRET securely
          </li>
          <li>
            <strong>Password Comparison:</strong> Use{" "}
            <code>bcrypt.compare()</code> to verify login credentials
          </li>
          <li>
            <strong>Token Expiration:</strong> Set reasonable expiry times for
            security
          </li>
          <li>
            <strong>Error Handling:</strong> Properly handle authentication
            failures
          </li>
        </ul>
      </section>
    </div>
  );
}

export default WeekFour;
