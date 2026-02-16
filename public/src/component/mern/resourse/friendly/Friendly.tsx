import React, { useState, useEffect } from "react";
import "./friendly.css";

interface Quote {
  id: number;
  quote: string;
  author: string;
}

function Friendly() {
  const [activeTab, setActiveTab] = useState("js-basics");
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://dummyjson.com/quotes");
      const data = await response.json();
      setQuotes(data.quotes.slice(0, 5));
    } catch (error) {
      console.error("Failed to fetch quotes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const tabs = [
    { id: "js-basics", label: "JavaScript Basics" },
    { id: "project-setup", label: "Project Setup" },
    { id: "express-concepts", label: "Express Concepts" },
    { id: "authentication", label: "Authentication" },
    { id: "crud-operations", label: "CRUD Operations" },
    { id: "async-example", label: "Async/Await Example" },
  ];

  return (
    <div className="friendly-container">
      <div className="friendly-header">
        <div className="friendly-icon">💭</div>
        <div className="friendly-message">
          <h1>Let's Reflect on What We've Learned! 🌟</h1>
          <p className="encouragement">
            These questions are here to help you check your understanding - not
            to confuse or worry you! Think of this as explaining concepts to
            yourself or a friend.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tabs-container">
        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* JavaScript Basics Tab */}
        {activeTab === "js-basics" && (
          <section className="question-category">
            <h2>📘 JavaScript Fundamentals</h2>
            <ul className="question-list">
              <li>
                <strong>
                  1. What is the difference between let, const, and var?
                </strong>
                <p className="question-hint">
                  Think about scope, reassignment, and hoisting
                </p>
              </li>
              <li>
                <strong>2. Explain hoisting in JavaScript with examples</strong>
                <p className="question-hint">
                  How do functions and variables behave differently?
                </p>
              </li>
              <li>
                <strong>
                  3. What are arrow functions and how do they differ from
                  regular functions?
                </strong>
                <p className="question-hint">
                  Consider 'this' binding, syntax, and usage
                </p>
              </li>
              <li>
                <strong>
                  4. Explain destructuring in JavaScript with examples
                </strong>
                <p className="question-hint">
                  How do you extract values from objects and arrays?
                </p>
              </li>
              <li>
                <strong>
                  5. What are template literals and their advantages?
                </strong>
                <p className="question-hint">
                  Compare with traditional string concatenation
                </p>
              </li>
            </ul>
          </section>
        )}

        {/* Project Setup Tab */}
        {activeTab === "project-setup" && (
          <section className="question-category">
            <h2>🛠️ Project Setup & Fundamentals</h2>
            <ul className="question-list">
              <li>
                <strong>
                  1. What's the difference between npm init and npm init -y?
                </strong>
                <p className="question-hint">
                  Think about user interaction and default values
                </p>
              </li>
              <li>
                <strong>
                  2. What is package.json and what is its purpose?
                </strong>
                <p className="question-hint">
                  Consider dependencies, scripts, and project metadata
                </p>
              </li>
              <li>
                <strong>
                  3. How do you customize package.json for your main files?
                </strong>
                <p className="question-hint">
                  What fields define entry points and module types?
                </p>
              </li>
              <li>
                <strong>4. What do these scripts do?</strong>
                <div className="code-block">
                  <pre>{`"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}`}</pre>
                </div>
                <p className="question-hint">
                  When would you use each command?
                </p>
              </li>
              <li>
                <strong>
                  5. What's the difference between CommonJS and ES6 modules?
                </strong>
                <p className="question-hint">
                  Compare require/module.exports vs import/export
                </p>
              </li>
              <li>
                <strong>6. Why do we use nodemon in development?</strong>
                <p className="question-hint">
                  What problem does it solve during development?
                </p>
              </li>
            </ul>
          </section>
        )}

        {/* Express Concepts Tab */}
        {activeTab === "express-concepts" && (
          <section className="question-category">
            <h2>🚀 Express.js & Server Concepts</h2>
            <ul className="question-list">
              <li>
                <strong>7. What is Express.js and why do we need it?</strong>
                <p className="question-hint">
                  What value does it add over plain Node.js?
                </p>
              </li>
              <li>
                <strong>8. What is a port and what is it used for?</strong>
                <p className="question-hint">
                  How do ports help organize network communication?
                </p>
              </li>
              <li>
                <strong>9. What is a base URL in web development?</strong>
                <p className="question-hint">
                  How does it relate to routes and endpoints?
                </p>
              </li>
              <li>
                <strong>10. What is a root level element in Express?</strong>
                <p className="question-hint">
                  What happens at the application's entry point?
                </p>
              </li>
              <li>
                <strong>
                  11. What is express.json() and why do we use it?
                </strong>
                <p className="question-hint">
                  What type of data does it help process?
                </p>
              </li>
              <li>
                <strong>
                  12. Why do we create multiple folders in our project and
                  what's the purpose of each?
                </strong>
                <p className="question-hint">
                  Think about organization, controllers, routes, models
                </p>
              </li>
              <li>
                <strong>13. What are endpoints and routes in Express?</strong>
                <p className="question-hint">
                  How do they handle client requests?
                </p>
              </li>
              <li>
                <strong>14. What types of routes have we used so far?</strong>
                <p className="question-hint">
                  Consider different HTTP methods and their purposes
                </p>
              </li>
              <li>
                <strong>
                  15. What HTTP methods have we used and why did we use them?
                </strong>
                <p className="question-hint">
                  GET, POST, etc. - when to use each?
                </p>
              </li>
              <li>
                <strong>
                  16. What are the basic route components we always include?
                </strong>
                <p className="question-hint">
                  What makes a complete and proper route?
                </p>
              </li>
              <li>
                <strong>
                  17. Why do we need tools like Postman or Thunder Client?
                </strong>
                <p className="question-hint">
                  How do they help in API development?
                </p>
              </li>
            </ul>
          </section>
        )}

        {/* Authentication Tab */}
        {activeTab === "authentication" && (
          <section className="question-category">
            <h2>🔐 Authentication & Security</h2>
            <ul className="question-list">
              <li>
                <strong>
                  18. Why should we hash passwords before storing them?
                </strong>
                <p className="question-hint">
                  What security risks does plain text password storage create?
                </p>
              </li>
              <li>
                <strong>19. How does bcrypt work to secure passwords?</strong>
                <p className="question-hint">
                  Explain salting, hashing, and work factors
                </p>
              </li>
              <li>
                <strong>
                  20. What are JWT tokens and what is their structure?
                </strong>
                <p className="question-hint">
                  Describe the three parts of a JWT token
                </p>
              </li>
              <li>
                <strong>21. How do you create and verify JWT tokens?</strong>
                <p className="question-hint">
                  What methods and secrets are involved?
                </p>
              </li>
              <li>
                <strong>22. What is CORS and why is it needed?</strong>
                <p className="question-hint">
                  Why do browsers block cross-origin requests by default?
                </p>
              </li>
              <li>
                <strong>
                  23. How do you enable CORS in an Express application?
                </strong>
                <p className="question-hint">
                  What middleware and configuration are required?
                </p>
              </li>
              <li>
                <strong>
                  24. What security best practices should you follow for
                  authentication?
                </strong>
                <p className="question-hint">
                  Consider password handling, token security, and CORS
                </p>
              </li>
              <li>
                <strong>
                  25. How does the complete authentication flow work from
                  registration to protected routes?
                </strong>
                <p className="question-hint">
                  Trace the journey from user signup to accessing protected data
                </p>
              </li>
            </ul>
          </section>
        )}

        {/* CRUD Operations Tab */}
        {activeTab === "crud-operations" && (
          <section className="question-category">
            <h2>🏨 CRUD Operations</h2>
            <ul className="question-list">
              <li>
                <strong>
                  26. What does CRUD stand for and what are the corresponding
                  HTTP methods?
                </strong>
                <p className="question-hint">
                  Map each CRUD operation to its HTTP method
                </p>
              </li>
              <li>
                <strong>
                  27. What is the purpose of input validation in CRUD
                  operations?
                </strong>
                <p className="question-hint">
                  Why should you validate data before processing?
                </p>
              </li>
              <li>
                <strong>
                  28. How do you handle errors properly in CRUD operations?
                </strong>
                <p className="question-hint">
                  What error handling patterns should you use?
                </p>
              </li>
              <li>
                <strong>
                  29. What are parameterized queries and why are they important?
                </strong>
                <p className="question-hint">
                  How do they prevent SQL injection attacks?
                </p>
              </li>
              <li>
                <strong>
                  30. How do you check if a record was successfully updated or
                  deleted?
                </strong>
                <p className="question-hint">
                  What database result properties do you examine?
                </p>
              </li>
              <li>
                <strong>
                  31. What's the difference between soft deletion and hard
                  deletion?
                </strong>
                <p className="question-hint">
                  When would you use each approach?
                </p>
              </li>
              <li>
                <strong>
                  32. How do you organize CRUD routes in an Express router?
                </strong>
                <p className="question-hint">
                  What's the typical structure for user management routes?
                </p>
              </li>
              <li>
                <strong>
                  33. What HTTP status codes should you use for different CRUD
                  operations?
                </strong>
                <p className="question-hint">
                  When to use 200, 201, 400, 404, 500, etc.?
                </p>
              </li>
            </ul>
          </section>
        )}

        {/* Async/Await Example Tab */}
        {activeTab === "async-example" && (
          <section className="question-category">
            <h2>⏳ Async/Await & API Calls</h2>
            <div className="async-section">
              <h3>Live API Example</h3>
              <p className="question-hint">
                This demonstrates fetching data from an external API using
                async/await:
              </p>

              <div className="quote-section">
                <h4>Quotes from API:</h4>
                {loading ? (
                  <p className="loading">Loading quotes...</p>
                ) : (
                  <>
                    {quotes.map((quote) => (
                      <div key={quote.id} className="quote-item">
                        <blockquote>"{quote.quote}"</blockquote>
                        <cite>- {quote.author}</cite>
                      </div>
                    ))}
                    <button onClick={fetchQuotes} className="refresh-btn">
                      Refresh Quotes
                    </button>
                  </>
                )}
              </div>

              <div className="explanation">
                <h4>What's happening here?</h4>
                <ul>
                  <li>
                    We use <code>async/await</code> to handle the API call
                  </li>
                  <li>
                    <code>fetch()</code> makes the HTTP request to the quotes
                    API
                  </li>
                  <li>
                    We parse the response with <code>.json()</code>
                  </li>
                  <li>
                    Error handling with <code>try/catch</code>
                  </li>
                  <li>
                    State management with <code>useState</code> and{" "}
                    <code>useEffect</code>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        )}
      </div>

      <div className="friendly-footer">
        <p>
          💡 <strong>Remember:</strong> Take your time with each question. The
          goal is understanding, not speed!
        </p>
      </div>
    </div>
  );
}

export default Friendly;
