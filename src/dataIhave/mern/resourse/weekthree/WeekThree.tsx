import React from "react";
import styles from "./weekthree.module.css";

function WeekThree() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.avatar}>🌐</div>
        <div className={styles.title}>
          <h1>Backend Routing & Frontend Setup</h1>
          <p>Understanding routing types, environment variables, and Vite project setup</p>
        </div>
      </header>

      {/* Routing Types */}
      <section className={styles.card}>
        <h3>1. Express Routing Types</h3>
        <p>
          <strong>What is routing?</strong> Defining how your application responds to client requests at specific endpoints (URLs)
        </p>
        
        <div className={styles.routingTypes}>
          <div className={styles.routingType}>
            <h4>🔹 Basic Routes</h4>
            <p>Simple fixed URL paths that match exactly</p>
            <div className={styles.code}>
              <pre>
                <code>{`// Basic GET route
app.get('/api/users', (req, res) => {
  res.json({ message: 'Get all users' });
});

// Basic POST route  
app.post('/api/register', (req, res) => {
  res.json({ message: 'User registered' });
});

// Route Methods:
// GET - Read data
// POST - Create data
// PUT - Update data
// DELETE - Remove data`}</code>
              </pre>
            </div>
          </div>

          <div className={styles.routingType}>
            <h4>🔹 Dynamic Routes</h4>
            <p>Routes with parameters that can change (URL parameters)</p>
            <div className={styles.code}>
              <pre>
                <code>{`// Dynamic route with :id parameter
app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id; // Access parameter
  res.json({ message: \`Get user \${userId}\` });
});

// Multiple parameters
app.get('/api/hotels/:hotelId/rooms/:roomId', (req, res) => {
  const { hotelId, roomId } = req.params;
  res.json({ 
    hotel: hotelId, 
    room: roomId 
  });
});

// Example URLs:
// /api/users/123      → req.params.id = "123"
// /api/users/abc      → req.params.id = "abc"`}</code>
              </pre>
            </div>
          </div>

          <div className={styles.routingType}>
            <h4>🔹 Query String Routes</h4>
            <p>Routes with optional parameters in the URL query string</p>
            <div className={styles.code}>
              <pre>
                <code>{`// Query string parameters
app.get('/api/search', (req, res) => {
  const { name, location, price } = req.query;
  
  res.json({
    search: {
      name: name,
      location: location,
      maxPrice: price
    }
  });
});

// Example URLs:
// /api/search?name=marriott&location=nyc
// /api/search?price=200&location=london

// req.query will be:
// { name: "marriott", location: "nyc" }
// { price: "200", location: "london" }`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Environment Variables & dotenv */}
      <section className={styles.card}>
        <h3>2. Environment Variables with dotenv</h3>
        <p>
          <strong>Why use environment variables?</strong> Store sensitive configuration separately from code for security and flexibility
        </p>
        
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h4>Install dotenv package</h4>
              <div className={styles.code}>
                <pre>
                  <code>npm install dotenv</code>
                </pre>
              </div>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h4>Create .env file</h4>
              <p>Add sensitive configuration (never commit to Git!)</p>
              <div className={styles.code}>
                <pre>
                  <code>{`# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_secure_password
DB_NAME=hotel_management

# Server Configuration
PORT=3000
JWT_SECRET=your_jwt_secret_key

# API Keys
WEATHER_API_KEY=abc123xyz
EMAIL_API_KEY=def456uvw`}</code>
                </pre>
              </div>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h4>Load environment variables</h4>
              <p>Import and configure dotenv in your main file</p>
              <div className={styles.code}>
                <pre>
                  <code>{`import dotenv from 'dotenv';

// Load .env file contents into process.env
dotenv.config();

// Access environment variables
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

const port = process.env.PORT || 3000; // Fallback value`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.importantNote}>
          <strong>💡 Important:</strong> Add <code>.env</code> to your <code>.gitignore</code> file to prevent committing sensitive data!
        </div>
      </section>

      {/* Database Connection Process */}
      <section className={styles.card}>
        <h3>3. Database Connection Process</h3>
        <p>
          <strong>MySQL2 with Connection Pool:</strong> Efficient database connections for web applications
        </p>

        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h4>Install MySQL2</h4>
              <div className={styles.code}>
                <pre>
                  <code>npm install mysql2</code>
                </pre>
              </div>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h4>Create db.js connection file</h4>
              <div className={styles.code}>
                <pre>
                  <code>{`import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create connection pool (recommended for web apps)
const db = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,           // Maximum simultaneous connections
  queueLimit: 0,                 // Unlimited queued connection requests
  acquireTimeout: 60000,         // 60 seconds timeout
  reconnect: true               // Auto-reconnect if connection fails
});

console.log('✅ Database connected successfully');
export default db;`}</code>
                </pre>
              </div>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h4>Use database in controllers</h4>
              <div className={styles.code}>
                <pre>
                  <code>{`import db from '../model/db.js';

const getUsers = async (req, res) => {
  try {
    // Execute SQL query
    const [users] = await db.query('SELECT * FROM users');
    
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.connectionBenefits}>
          <h4>Connection Pool Benefits:</h4>
          <ul>
            <li><strong>Performance:</strong> Reuses connections instead of creating new ones</li>
            <li><strong>Efficiency:</strong> Manages multiple concurrent database operations</li>
            <li><strong>Reliability:</strong> Automatic reconnection if database connection drops</li>
            <li><strong>Scalability:</strong> Handles high traffic with connection limits</li>
          </ul>
        </div>
      </section>

      {/* Vite Frontend Setup */}
      <section className={styles.card}>
        <h3>4. Vite Frontend Project Setup</h3>
        <p>
          <strong>Why Vite?</strong> Fast development server, hot module replacement, and optimized builds
        </p>

        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h4>Create Vite project</h4>
              <div className={styles.code}>
                <pre>
                  <code>{`# Using npm
npm create vite@latest hotel-frontend -- --template react

# Using yarn
yarn create vite hotel-frontend --template react

# Using pnpm  
pnpm create vite hotel-frontend --template react`}</code>
                </pre>
              </div>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h4>Navigate and install dependencies</h4>
              <div className={styles.code}>
                <pre>
                  <code>{`cd hotel-frontend
npm install
# or
yarn install
# or  
pnpm install`}</code>
                </pre>
              </div>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h4>Run development server</h4>
              <div className={styles.code}>
                <pre>
                  <code>{`npm run dev
# or
yarn dev
# or
pnpm dev`}</code>
                </pre>
              </div>
              <p>Server starts at <code>http://localhost:5173</code></p>
            </div>
          </div>
        </div>

        <div className={styles.viteStructure}>
          <h4>Vite Project Structure:</h4>
          <div className={styles.folderStructure}>
            <div className={styles.folder}>
              <span className={styles.folderIcon}>📁</span>
              <span className={styles.folderName}>hotel-frontend/</span>
              <div className={styles.children}>
                <div className={styles.folder}>
                  <span className={styles.folderIcon}>📁</span>
                  <span className={styles.folderName}>src/</span>
                  <div className={styles.children}>
                    <div className={styles.file}>
                      <span className={styles.fileIcon}>📄</span>
                      <span>App.jsx</span> - Main component
                    </div>
                    <div className={styles.file}>
                      <span className={styles.fileIcon}>📄</span>
                      <span>main.jsx</span> - Entry point
                    </div>
                    <div className={styles.file}>
                      <span className={styles.fileIcon}>📄</span>
                      <span>App.css</span> - Styles
                    </div>
                  </div>
                </div>
                <div className={styles.file}>
                  <span className={styles.fileIcon}>📄</span>
                  <span>index.html</span> - HTML template
                </div>
                <div className={styles.file}>
                  <span className={styles.fileIcon}>⚙️</span>
                  <span>vite.config.js</span> - Vite configuration
                </div>
                <div className={styles.file}>
                  <span className={styles.fileIcon}>📦</span>
                  <span>package.json</span> - Dependencies
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Example */}
      <section className={styles.card}>
        <h3>5. Complete Backend Example</h3>
        <p>Putting it all together with routing, environment variables, and database</p>

        <div className={styles.code}>
          <pre>
            <code>{`// server.js
import express from 'express';
import dotenv from 'dotenv';
import { router } from './router/router.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', router);

app.listen(port, () => {
  console.log(\`🚀 Server running on port \${port}\`);
});

// router.js
import express from 'express';
import { 
  getUsers, 
  getUserById, 
  searchUsers 
} from '../controller/userController.js';

const router = express.Router();

// Basic route
router.get('/users', getUsers);

// Dynamic route
router.get('/users/:id', getUserById);

// Query string route  
router.get('/search', searchUsers);

export { router };

// userController.js
import db from '../model/db.js';

// Basic route handler
export const getUsers = async (req, res) => {
  try {
    const [users] = await db.query('SELECT * FROM users');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Dynamic route handler
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    
    if (users.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ success: true, data: users[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Query string route handler
export const searchUsers = async (req, res) => {
  try {
    const { name, email } = req.query;
    let query = 'SELECT * FROM users WHERE 1=1';
    const params = [];
    
    if (name) {
      query += ' AND name LIKE ?';
      params.push(\`%\${name}%\`);
    }
    
    if (email) {
      query += ' AND email LIKE ?';
      params.push(\`%\${email}%\`);
    }
    
    const [users] = await db.query(query, params);
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};`}</code>
          </pre>
        </div>
      </section>

      {/* Summary */}
      <section className={styles.summary}>
        <h4>Key Takeaways</h4>
        <ul>
          <li><strong>Basic Routes:</strong> Fixed URL paths for specific actions</li>
          <li><strong>Dynamic Routes:</strong> Use <code>:param</code> for variable URL segments accessed via <code>req.params</code></li>
          <li><strong>Query Strings:</strong> Optional parameters after <code>?</code> accessed via <code>req.query</code></li>
          <li><strong>Environment Variables:</strong> Store sensitive data in <code>.env</code> file using <code>dotenv</code></li>
          <li><strong>Database Connection:</strong> Use connection pools for efficient database operations</li>
          <li><strong>Vite Setup:</strong> Fast React development environment with <code>npm create vite</code></li>
          <li><strong>Security:</strong> Never commit <code>.env</code> files to version control</li>
        </ul>
      </section>
    </div>
  );
}

export default WeekThree;