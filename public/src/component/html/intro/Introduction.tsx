import "./intro.css";

function Introduction() {
  return (
    <>
      <div className="html-intro">
        <div className="intro-header">
          <div className="intro-avatar">HTML</div>
          <div className="intro-title">
            <h1>Introduction to HTML</h1>
            <p>Learn the foundation of web development</p>
          </div>
        </div>

        <div className="intro-content">

          <div className="content-grid">
            <div className="content-card">
              <h3>What is HTML?</h3>
              <p>
                HTML (HyperText Markup Language) is the standard markup language
                for creating web pages. It describes the structure of a web page
                and consists of a series of elements.
              </p>
            </div>

            <div className="content-card">
              <h3>Why Learn HTML?</h3>
              <p>
                HTML is the backbone of every website. It's essential for web
                development, content management, and understanding how the web
                works.
              </p>
            </div>

            <div className="content-card">
              <h3>Basic Structure</h3>
              <p>
                Every HTML document has a basic structure with &lt;html&gt;,
                &lt;head&gt;, and &lt;body&gt; tags that form the foundation of
                web pages.
              </p>
            </div>

            <div className="content-card">
              <h3>Getting Started</h3>
              <p>
                You only need a text editor and a web browser to start writing
                HTML. No special tools or software required!
              </p>
            </div>
          </div>

          <div className="code-example">
            <h3>Basic HTML Example</h3>
            <pre>
              <code>{`<!DOCTYPE html>
<html>
<head>
    <title>My First Page</title>
</head>
<body>
    <h1>Hello World!</h1>
    <p>This is my first HTML page.</p>
</body>
</html>`}</code>
            </pre>
          </div>

          {/* Create Your First Web Page Section */}
          <div className="creation-guide">
            <div className="content-card">
              <h3>Create Your First Web Page</h3>
              <ol className="steps-list">
                <li>
                  <strong>Open any built-in text editor</strong> like Notepad
                  (Windows), TextEdit (Mac), or any code editor
                </li>
                <li>
                  <strong>Write the basic HTML structure</strong> shown in the
                  example above
                </li>
                <li>
                  <strong>Save it with .html extension</strong> (e.g.,
                  "myfirstpage.html") and choose UTF-8 encoding
                </li>
                <li>
                  <strong>Double-click the saved file</strong> to open it
                </li>
                <li>
                  <strong>Boom!</strong> Your default browser will open and
                  display your first web page
                </li>
              </ol>
            </div>
          </div>

          {/* HTML Structure Details */}
          <div className="structure-details">
            <div className="content-card">
              <h3>HTML Basic Structure Explained</h3>
              <div className="structure-breakdown">
                <div className="structure-item">
                  <code>&lt;!DOCTYPE html&gt;</code>
                  <p>Declares the HTML version (HTML5)</p>
                </div>
                <div className="structure-item">
                  <code>&lt;html&gt;</code>
                  <p>The root element that represents the entire document</p>
                </div>
                <div className="structure-item">
                  <code>&lt;head&gt;</code>
                  <p>Contains meta information about the document</p>
                  <ul className="nested-list">
                    <li>
                      <code>&lt;title&gt;</code> - Visible on browser tabs
                    </li>
                    <li>
                      <code>&lt;meta&gt;</code> - Provides additional info about
                      your website
                    </li>
                  </ul>
                </div>
                <div className="structure-item">
                  <code>&lt;body&gt;</code>
                  <p>Contains all the visible content of your web page</p>
                </div>
              </div>
            </div>
          </div>

          {/* Real-World Head Example */}
          <div className="code-example real-example">
            <h3>Real-World Head Section Example</h3>
            <pre>
              <code>{`<head>
    <!-- Character Encoding -->
    <meta charset="UTF-8">
    
    <!-- Responsive Viewport -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Language -->
    <meta name="language" content="am,en">

    <!-- Primary SEO Meta Tags -->
    <title>Jocode - Learn Programming & Tech Skills in Amharic | Joseph Teka</title>
    <meta name="description" content="Jocode helps you learn programming and tech skills in Amharic!">
    <meta name="author" content="Joseph Teka">
    <meta name="keywords" content="Jocode, Learn Programming, Tech Skills, Amharic">

    <!-- CSS Styles -->
    <style>
        /* Your CSS code goes here */
    </style>
</head>`}</code>
            </pre>
            <div className="code-explanation">
              <h4>What each meta tag does:</h4>
              <ul>
                <li>
                  <strong>charset="UTF-8"</strong> - Supports all languages and
                  special characters
                </li>
                <li>
                  <strong>viewport</strong> - Makes website responsive on mobile
                  devices
                </li>
                <li>
                  <strong>title</strong> - Appears in browser tabs and search
                  results
                </li>
                <li>
                  <strong>description</strong> - Shown in search engine results
                </li>
                <li>
                  <strong>keywords</strong> - Helps search engines understand
                  your content
                </li>
              </ul>
            </div>
          </div>

          {/* Resources Section */}
          <div className="section-container optional-section">
            <h3 className="section-title">Additional Resources</h3>

            <div className="docs-grid">
              <div className="content-card">
                <h3>MDN Web Docs - HTML</h3>
                <p>Complete HTML reference and documentation by Mozilla</p>
                <a
                  href="https://developer.mozilla.org/en-US/docs/Web/HTML"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    marginTop: "15px",
                    backgroundColor: "red",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                  }}
                >
                  Open Docs
                </a>
              </div>

              <div className="content-card">
                <h3>W3Schools HTML Tutorial</h3>
                <p>Interactive HTML tutorials with examples and exercises</p>
                <a
                  href="https://www.w3schools.com/html/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    marginTop: "15px",
                    backgroundColor: "red",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                  }}
                >
                  Read w3schools
                </a>
              </div>

              <div className="content-card">
                <h3>HTML Cheat Sheet</h3>
                <p>Quick reference guide for HTML tags and attributes</p>
                <a
                  href="https://htmlcheatsheet.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    marginTop: "15px",
                    backgroundColor: "red",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                  }}
                >
                  HTML Cheatsheet
                </a>
              </div>
            </div>
          </div>

          <div className="intro-footer">
            <h4>Ready to Start Coding?</h4>
            <p>
              Follow the steps above to create your first HTML page. Remember:
              practice is key to mastering HTML! Start simple and gradually add
              more elements as you learn.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Introduction;
