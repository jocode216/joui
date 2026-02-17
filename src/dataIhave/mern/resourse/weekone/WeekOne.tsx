import React, { useState, useEffect } from "react";
import styles from "./WeekOne.module.css";

// Type definitions (kept for internal logic, but examples below are vanilla JS)
interface Quote {
  id: number;
  quote: string;
  author: string;
}

interface QuoteSummary {
  id: number;
  summary: string;
}

interface ApiResponse {
  quotes: Quote[];
  total: number;
  skip: number;
  limit: number;
}

function WeekOne(): JSX.Element {
  const [quotes, setQuotes] = useState<QuoteSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchQuotes = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch("https://dummyjson.com/quotes");
      const data: ApiResponse = await response.json();

      const featuredQuotes: QuoteSummary[] = data.quotes
        .slice(0, 3)
        .map(({ id, quote, author }) => ({
          id,
          summary: `"${quote.substring(0, 50)}..." - ${author}`,
        }));

      setQuotes(featuredQuotes);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <header className={styles.header}>
        <div className={styles.avatar}>JS</div>
        <div className={styles.title}>
          <h1>JavaScript Fundamentals</h1>
          <p>
            Essential concepts before starting the Hotel Management System
            project
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Scoping */}
        <section className={styles.card}>
          <h3>1. Variable Scoping (let, const, var)</h3>
          <p>
            <strong>Scope defines where variables can be accessed:</strong>
            <br />• <strong>Global scope:</strong> Accessible everywhere in your
            code
            <br />• <strong>Block scope (let, const):</strong> Only accessible
            within the block {} where declared
            <br />• <strong>Function scope (var):</strong> Only accessible
            within the function where declared
          </p>
          <div className={styles.code}>
            <pre>
              <code>{`// Global scope
const hotelName = "Grand Plaza";

function bookRoom() {
  
if (true) {
  // Function scope
  var guestName = "John";

  // Block scope
    let roomNumber = 101;
    console.log(roomNumber); // Works
  }
  
  // console.log(roomNumber); // Error
  console.log(guestName); // Works
}`}</code>
            </pre>
          </div>
        </section>

        {/* Hoisting */}
        <section className={styles.card}>
          <h3>2. Hoisting</h3>
          <p>
            <strong>
              Hoisting means accessing variables/functions before declaration.
            </strong>
            <br />
            • Function declarations: Fully hoisted
            <br />
            • var variables: Hoisted but value is undefined
            <br />• let/const variables: Not hoisted
          </p>
          <div className={styles.code}>
            <pre>
              <code>{`// Function hoisting
checkIn(); // Works
function checkIn() {
  console.log("Room checked in!");
}

// var hoisting
console.log(guest); // undefined
var guest = "Abebe";

// let/const hoisting
// console.log(room); // ReferenceError
let room = 201;`}</code>
            </pre>
          </div>
        </section>

        {/* let vs const */}
        <section className={styles.card}>
          <h3>3. let vs const - The Difference</h3>
          <p>
            <strong>
              const cannot be reassigned, but can be modified if it's an object
              or array.
            </strong>
          </p>
          <div className={styles.code}>
            <pre>
              <code>{`// let - can reassign
let roomStatus = "available";
roomStatus = "occupied"; // Allowed

// const - cannot reassign
const hotelName = "Grand Plaza";
// hotelName = "New Hotel"; // Error

// But const objects/arrays can be modified
const guest = { name: "John", room: 101 };
guest.name = "Jane"; // Allowed

const rooms = [101, 102, 103];
rooms.push(104); // Allowed`}</code>
            </pre>
          </div>
        </section>

        {/* Template Literals */}
        <section className={styles.card}>
          <h3>4. Template Literals</h3>
          <p>
            Use backticks (`) for cleaner string creation with variables and
            multi-line strings.
          </p>
          <div className={styles.code}>
            <pre>
              <code>{`const guestName = "Alice";
const roomNumber = 305;
const nights = 3;

// Template literal
const message = \`Hello \${guestName}, your room \${roomNumber} is ready for \${nights} nights.\`;

// Multi-line string
const receipt = \`
  === HOTEL RECEIPT ===
  Guest: \${guestName}
  Room: \${roomNumber}
  Total: $\${120 * nights}
\`;`}</code>
            </pre>
          </div>
        </section>

        {/* Default Parameters */}
        <section className={styles.card}>
          <h3>5. Default Parameters</h3>
          <p>
            Set default values for function parameters if no value is provided.
          </p>
          <div className={styles.code}>
            <pre>
              <code>{`// Calculate tax with default rate
function calculateTax(amount, taxRate = 0.1) {
  return amount * taxRate;
}

// Hotel billing function
function createBill(roomPrice, nights = 1, serviceCharge = 15) {
  return \`Total: $\${roomPrice * nights + serviceCharge}\`;
}

console.log(calculateTax(100)); // 10
console.log(createBill(150)); // Total: $165`}</code>
            </pre>
          </div>
        </section>

        {/* Arrow Functions */}
        <section className={styles.card}>
          <h3>6. Arrow Functions</h3>
          <p>
            Shorter syntax for functions. Perfect for simple operations and
            callbacks.
          </p>
          <div className={styles.code}>
            <pre>
              <code>{`// Arrow function
const add = (a, b) => a + b;

// Multiple lines
const calculateTotal = (price, nights) => {
  const tax = price * nights * 0.1;
  return price * nights + tax;
};

// Array methods
const roomNumbers = [101, 102, 103];
const availableRooms = roomNumbers.filter(room => room !== 103);`}</code>
            </pre>
          </div>
        </section>

        {/* Ternary Operator */}
        <section className={styles.card}>
          <h3>7. Ternary Operator</h3>
          <p>Shortcut for simple if-else conditions.</p>
          <div className={styles.code}>
            <pre>
              <code>{`const age = 22;

// Ternary operator
const canDrive = age >= 18 ? "You can drive" : "You can't drive";

// Hotel examples
const isAvailable = true;
const isVIP = true;
const isMember = false;

const roomStatus = isAvailable ? "Available" : "Occupied";
const discount = isVIP ? 0.2 : isMember ? 0.1 : 0;

console.log(canDrive); // "You can drive"`}</code>
            </pre>
          </div>
        </section>

        {/* Destructuring */}
        <section className={styles.card}>
          <h3>8. Destructuring</h3>
          <p>
            Extract values from arrays or properties from objects into separate
            variables.
          </p>
          <div className={styles.code}>
            <pre>
              <code>{`// Array Destructuring
const roomTypes = ["Single", "Double", "Suite"];
const [firstType] = roomTypes;

// Object Destructuring
const guest = { name: "John", age: 30 };
const { name, age } = guest;

// Function parameter destructuring
function bookRoom({ roomId, guestName, nights = 1 }) {
  return \`Booking \${roomId} for \${guestName}\`;
}`}</code>
            </pre>
          </div>
        </section>

        {/* Async/Await */}
        <section className={styles.card}>
          <h3>9. Async/Await - Modern API Calls</h3>
          <p>
            Write asynchronous code that looks synchronous. Perfect for API
            calls.
          </p>
          <div className={styles.code}>
            <pre>
              <code>{`// Real API call with JavaScript
const fetchQuotes = async () => {
  try {
    const response = await fetch('https://dummyjson.com/quotes');
    const data = await response.json();
    
    // Destructuring
    const { quotes, total } = data;
    const [firstQuote] = quotes;
    
    console.log(\`Fetched \${total} quotes\`);
    return quotes.slice(0, 5);
  } catch (error) {
    console.error('Failed to fetch quotes:', error);
    return [];
  }
};`}</code>
            </pre>
          </div>

          {/* Live Quotes Display */}
          <div className={styles.quotes}>
            <h4>Live Quotes from API:</h4>
            {loading ? (
              <p className={styles.loading}>Loading quotes...</p>
            ) : (
              <ul className={styles.quotesList}>
                {quotes.map((quote) => (
                  <li key={quote.id} className={styles.quoteItem}>
                    {quote.summary}
                  </li>
                ))}
              </ul>
            )}
            <button
              className={styles.refreshButton}
              onClick={fetchQuotes}
              disabled={loading}
              type="button"
            >
              {loading ? "Loading..." : "Refresh Quotes"}
            </button>
          </div>
        </section>
      </main>

      {/* Summary Section */}
      <footer className={styles.summary}>
        <h4>Key Takeaways</h4>
        <ul>
          <li>
            <strong>Scope:</strong> Where variables live - global, function, or
            block
          </li>
          <li>
            <strong>Hoisting:</strong> Functions fully hoisted, var partially,
            let/const not hoisted
          </li>
          <li>
            <strong>const vs let:</strong> Use const unless you need to reassign
          </li>
          <li>
            <strong>Template Literals:</strong> Use backticks for cleaner
            strings with variables
          </li>
          <li>
            <strong>Arrow Functions:</strong> Shorter syntax, great for simple
            functions
          </li>
          <li>
            <strong>Ternary Operator:</strong> Simple if-else in one line
          </li>
          <li>
            <strong>Destructuring:</strong> Extract values from objects/arrays
            easily
          </li>
          <li>
            <strong>Async/Await:</strong> Modern way to handle API calls and
            promises
          </li>
        </ul>
      </footer>
    </div>
  );
}

export default WeekOne;
