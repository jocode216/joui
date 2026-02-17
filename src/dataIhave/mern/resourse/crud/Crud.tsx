import React from "react";
import styles from "./crud.module.css";

function Crud() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.avatar}>🏨</div>
        <div className={styles.title}>
          <h1>CRUD Operations in Hotel Management System</h1>
          <p>
            Complete guide to Create, Read, Update, Delete operations with
            Express.js and MySQL
          </p>
        </div>
      </header>

      {/* CRUD Overview */}
      <section className={styles.card}>
        <h3>What is CRUD?</h3>
        <p>
          <strong>CRUD</strong> stands for the four basic operations we can
          perform on data:
        </p>
        <div className={styles.crudGrid}>
          <div className={styles.crudItem}>
            <div className={styles.crudIcon}>📝</div>
            <h4>CREATE</h4>
            <p>Add new records to the database</p>
            <code>POST /api/register</code>
          </div>
          <div className={styles.crudItem}>
            <div className={styles.crudIcon}>👀</div>
            <h4>READ</h4>
            <p>Retrieve data from the database</p>
            <code>GET /api/users</code>
          </div>
          <div className={styles.crudItem}>
            <div className={styles.crudIcon}>✏️</div>
            <h4>UPDATE</h4>
            <p>Modify existing records</p>
            <code>PUT /api/users/:id</code>
          </div>
          <div className={styles.crudItem}>
            <div className={styles.crudIcon}>🗑️</div>
            <h4>DELETE</h4>
            <p>Remove records from database</p>
            <code>DELETE /api/users/:id</code>
          </div>
        </div>
      </section>

      {/* CREATE Operation */}
      <section className={styles.card}>
        <h3>1. CREATE - User Registration</h3>
        <p>
          <strong>Endpoint:</strong> <code>POST /api/register</code>
        </p>
        <p>
          <strong>Purpose:</strong> Create new user accounts in the hotel system
        </p>

        <div className={styles.code}>
          <pre>
            <code>{`// REGISTER USER - CREATE Operation
const register = async (req, res) => {
  try {
    // Extract data from request body
    const { name, email, password, phone, image } = req.body;

    // VALIDATION: Check if all required fields are provided
    if (!name || !email || !password || !phone || !image) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // CHECK DUPLICATE: Verify if email already exists in database
    const [existing] = await db.query(\`SELECT * FROM users WHERE email = ?\`, [email]);
    if (existing.length > 0) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    // SECURITY: Hash password before storing (never store plain text!)
    const hashedPassword = await bcrypt.hash(password, 10);

    // DATABASE INSERT: Create new user record
    const insertQuery = \`
      INSERT INTO users (name, email, password, phone, image)
      VALUES (?, ?, ?, ?, ?)
    \`;
    const [result] = await db.query(insertQuery, [
      name, email, hashedPassword, phone, image
    ]);

    // AUTHENTICATION: Generate JWT token for immediate login
    const token = jwt.sign(
      { id: result.insertId, email, name }, 
      JWT_SECRET, 
      { expiresIn: "7d" }
    );

    // RESPONSE: Send success response with user data and token
    res.status(201).json({
      msg: "User registered successfully",
      token,
      user: { id: result.insertId, name, email, phone, image },
    });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};`}</code>
          </pre>
        </div>

        <div className={styles.flow}>
          <h4>Registration Flow:</h4>
          <div className={styles.flowSteps}>
            <div className={styles.flowStep}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <strong>Client sends POST request</strong>
                <code>{`POST /api/register`}</code>
                <div className={styles.requestBody}>
                  <code>{`{
  "name": "John Doe",
  "email": "john@hotel.com",
  "password": "secure123",
  "phone": "123-456-7890",
  "image": "profile.jpg"
}`}</code>
                </div>
              </div>
            </div>
            <div className={styles.flowArrow}>↓</div>
            <div className={styles.flowStep}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <strong>Server validates input</strong>
                <p>Check required fields and email uniqueness</p>
              </div>
            </div>
            <div className={styles.flowArrow}>↓</div>
            <div className={styles.flowStep}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <strong>Hash password and create user</strong>
                <p>Store secure hashed password in database</p>
              </div>
            </div>
            <div className={styles.flowArrow}>↓</div>
            <div className={styles.flowStep}>
              <div className={styles.stepNumber}>4</div>
              <div className={styles.stepContent}>
                <strong>Generate JWT token</strong>
                <p>Create authentication token for the new user</p>
              </div>
            </div>
            <div className={styles.flowArrow}>↓</div>
            <div className={styles.flowStep}>
              <div className={styles.stepNumber}>5</div>
              <div className={styles.stepContent}>
                <strong>Send response</strong>
                <div className={styles.responseBody}>
                  <code>{`{
  "msg": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@hotel.com",
    "phone": "123-456-7890",
    "image": "profile.jpg"
  }
}`}</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* READ Operations */}
      <section className={styles.card}>
        <h3>2. READ - Retrieve User Data</h3>
        <p>
          <strong>Two types of READ operations:</strong> Get all users and get
          single user
        </p>

        <div className={styles.readOperations}>
          <div className={styles.readOperation}>
            <h4>GET All Users</h4>
            <p>
              <strong>Endpoint:</strong> <code>GET /api/users</code>
            </p>
            <div className={styles.code}>
              <pre>
                <code>{`// GET all users - READ Operation (Multiple)
const getusers = async (req, res) => {
  try {
    // SIMPLE QUERY: Select all users from database
    const query = \`SELECT * FROM users\`;
    
    // EXECUTE QUERY: [users] destructures the rows from result
    const [users] = await db.query(query);
    
    // RESPONSE: Send all users data (excluding passwords)
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error getting users:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};`}</code>
              </pre>
            </div>
          </div>

          <div className={styles.readOperation}>
            <h4>GET Single User</h4>
            <p>
              <strong>Endpoint:</strong> <code>GET /api/users/:id</code>
            </p>
            <div className={styles.code}>
              <pre>
                <code>{`// GET single user by ID - READ Operation (Single)
const getsingleUser = async (req, res) => {
  // EXTRACT PARAM: Get user ID from URL parameters
  const { id } = req.params;
  
  try {
    // PARAMETERIZED QUERY: Safe query with user input
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    
    // NOT FOUND CHECK: Handle case where user doesn't exist
    if (!rows[0]) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // RESPONSE: Send single user data
    res.status(200).json({ user: rows[0] });
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};`}</code>
              </pre>
            </div>
          </div>
        </div>

        <div className={styles.endpointExamples}>
          <h4>READ Endpoint Examples:</h4>
          <div className={styles.endpoint}>
            <code>GET http://localhost:3000/api/users</code>
            <span>→ Returns all users in the system</span>
          </div>
          <div className={styles.endpoint}>
            <code>GET http://localhost:3000/api/users/5</code>
            <span>→ Returns only user with ID 5</span>
          </div>
        </div>
      </section>

      {/* UPDATE Operation */}
      <section className={styles.card}>
        <h3>3. UPDATE - Modify User Information</h3>
        <p>
          <strong>Endpoint:</strong> <code>PUT /api/users/:id</code>
        </p>
        <p>
          <strong>Purpose:</strong> Update existing user profile information
        </p>

        <div className={styles.code}>
          <pre>
            <code>{`// EDIT user - UPDATE Operation
const edituser = async (req, res) => {
  // EXTRACT DATA: Get ID from params and data from body
  const { id } = req.params;
  const { name, email, phone, image } = req.body;

  try {
    // UPDATE QUERY: Modify specific user record
    const updateQuery = \`
      UPDATE users
      SET name = ?, email = ?, phone = ?, image = ?
      WHERE id = ?
    \`;
    
    // EXECUTE UPDATE: Pass all values as parameters
    const [result] = await db.query(updateQuery, [
      name, email, phone, image, id
    ]);

    // CHECK AFFECTED ROWS: Verify if user was found and updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    // SUCCESS RESPONSE: Confirm update was successful
    res.status(200).json({ msg: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};`}</code>
          </pre>
        </div>

        <div className={styles.requestExample}>
          <h4>UPDATE Request Example:</h4>
          <div className={styles.code}>
            <pre>
              <code>{`// Request to: PUT http://localhost:3000/api/users/5
{
  "name": "John Smith",      // Updated name
  "email": "johnsmith@hotel.com", // Updated email
  "phone": "987-654-3210",   // Updated phone
  "image": "new-profile.jpg" // Updated profile image
}

// Response:
{
  "msg": "User updated successfully"
}`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* DELETE Operation */}
      <section className={styles.card}>
        <h3>4. DELETE - Remove User Accounts</h3>
        <p>
          <strong>Endpoint:</strong> <code>DELETE /api/users/:id</code>
        </p>
        <p>
          <strong>Purpose:</strong> Permanently remove user accounts from the
          system
        </p>

        <div className={styles.code}>
          <pre>
            <code>{`// DELETE user - DELETE Operation
const deleteuser = async (req, res) => {
  // EXTRACT PARAM: Get user ID to delete
  const { id } = req.params;

  try {
    // DELETE QUERY: Remove user from database
    const deleteQuery = \`DELETE FROM users WHERE id = ?\`;
    
    // EXECUTE DELETE: Pass ID as parameter
    const [result] = await db.query(deleteQuery, [id]);

    // CHECK AFFECTED ROWS: Verify if user was found and deleted
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    // SUCCESS RESPONSE: Confirm deletion
    res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};`}</code>
          </pre>
        </div>

        <div className={styles.importantNote}>
          <strong>⚠️ Important Security Consideration:</strong>
          <p>
            In a real hotel management system, you might want to implement soft
            deletion (mark users as inactive) instead of permanent deletion to
            maintain data integrity and history.
          </p>
        </div>
      </section>

      {/* Complete Router Setup */}
      <section className={styles.card}>
        <h3>5. Complete Router Configuration</h3>
        <p>How all CRUD endpoints are organized in the router file:</p>

        <div className={styles.code}>
          <pre>
            <code>{`// router.js - Complete CRUD routes setup
import express from 'express';
import { register, login } from '../controller/user/auth.js';
import { 
  getusers, 
  getsingleUser, 
  edituser, 
  deleteuser 
} from '../controller/user/users.js';

const router = express.Router();

// AUTH ROUTES
router.post('/register', register);  // CREATE user
router.post('/login', login);        // AUTHENTICATE user

// USER CRUD ROUTES
router.get('/users', getusers);              // READ all users
router.get('/users/:id', getsingleUser);     // READ single user
router.put('/users/:id', edituser);          // UPDATE user
router.delete('/users/:id', deleteuser);     // DELETE user

export { router };`}</code>
          </pre>
        </div>

        <div className={styles.apiSummary}>
          <h4>Complete API Endpoints Summary:</h4>
          <div className={styles.apiEndpoints}>
            <div className={styles.endpointRow}>
              <span className={styles.method}>POST</span>
              <code>/api/register</code>
              <span>Create new user account</span>
            </div>
            <div className={styles.endpointRow}>
              <span className={styles.method}>POST</span>
              <code>/api/login</code>
              <span>Authenticate user</span>
            </div>
            <div className={styles.endpointRow}>
              <span className={styles.method}>GET</span>
              <code>/api/users</code>
              <span>Get all users</span>
            </div>
            <div className={styles.endpointRow}>
              <span className={styles.method}>GET</span>
              <code>/api/users/:id</code>
              <span>Get specific user</span>
            </div>
            <div className={styles.endpointRow}>
              <span className={styles.method}>PUT</span>
              <code>/api/users/:id</code>
              <span>Update user information</span>
            </div>
            <div className={styles.endpointRow}>
              <span className={styles.method}>DELETE</span>
              <code>/api/users/:id</code>
              <span>Delete user account</span>
            </div>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className={styles.card}>
        <h3>6. CRUD Best Practices</h3>

        <div className={styles.bestPractices}>
          <div className={styles.practice}>
            <h4>✅ Input Validation</h4>
            <p>Always validate request data before processing:</p>
            <div className={styles.code}>
              <pre>
                <code>{`// Check required fields
if (!name || !email || !password) {
  return res.status(400).json({ msg: "All fields are required" });
}

// Validate email format
if (!isValidEmail(email)) {
  return res.status(400).json({ msg: "Invalid email format" });
}`}</code>
              </pre>
            </div>
          </div>

          <div className={styles.practice}>
            <h4>✅ Error Handling</h4>
            <p>Use try-catch blocks and proper error responses:</p>
            <div className={styles.code}>
              <pre>
                <code>{`try {
  // Database operations
  const [result] = await db.query(query, params);
} catch (error) {
  console.error("Operation failed:", error.message);
  res.status(500).json({ error: "Server error" });
}`}</code>
              </pre>
            </div>
          </div>

          <div className={styles.practice}>
            <h4>✅ Security</h4>
            <p>Always hash passwords and use parameterized queries:</p>
            <div className={styles.code}>
              <pre>
                <code>{`// ❌ UNSAFE - SQL injection vulnerability
const query = \`SELECT * FROM users WHERE email = '\${email}'\`;

// ✅ SAFE - Parameterized query
const query = \`SELECT * FROM users WHERE email = ?\`;
const [result] = await db.query(query, [email]);`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className={styles.summary}>
        <h4>Key Takeaways</h4>
        <ul>
          <li>
            <strong>CREATE (POST):</strong> Use for adding new records - always
            validate input and hash passwords
          </li>
          <li>
            <strong>READ (GET):</strong> Use for retrieving data - support both
            single and multiple records
          </li>
          <li>
            <strong>UPDATE (PUT):</strong> Use for modifying existing records -
            check if record exists first
          </li>
          <li>
            <strong>DELETE (DELETE):</strong> Use for removing records -
            consider soft deletion for important data
          </li>
          <li>
            <strong>Security:</strong> Always use parameterized queries to
            prevent SQL injection
          </li>
          <li>
            <strong>Validation:</strong> Validate all inputs and handle errors
            gracefully
          </li>
          <li>
            <strong>HTTP Status Codes:</strong> Use appropriate status codes
            (200, 201, 400, 404, 500)
          </li>
        </ul>
      </section>
    </div>
  );
}

export default Crud;
