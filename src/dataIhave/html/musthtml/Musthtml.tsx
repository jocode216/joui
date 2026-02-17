import React from "react";
import "./musthtml.css";

function Musthtml() {
  return (
    <div className="musthtml-container">
      <div className="musthtml-header">
        <div className="musthtml-avatar">💼</div>
        <div className="musthtml-title">
          <h1>Must-Know HTML for Real Projects</h1>
          <p>
            Essential HTML knowledge that separates beginners from professionals
          </p>
        </div>
      </div>

      <div className="musthtml-content">
        {/* Class vs ID */}
        <section className="content-section">
          <div className="content-card">
            <h2>1. Class vs ID - When to Use Which</h2>

            <div className="comparison-grid">
              <div className="comparison-item">
                <h3>🔖 Class</h3>
                <ul>
                  <li>
                    <strong>Multiple elements</strong> can share same class
                  </li>
                  <li>
                    Used for <strong>styling</strong> and{" "}
                    <strong>grouping</strong>
                  </li>
                  <li>
                    Can have <strong>multiple classes</strong> on one element
                  </li>
                  <li>
                    CSS selector: <code>.</code> (dot)
                  </li>
                </ul>
              </div>

              <div className="comparison-item">
                <h3>🆔 ID</h3>
                <ul>
                  <li>
                    <strong>Unique</strong> per page
                  </li>
                  <li>
                    Used for <strong>JavaScript</strong> and{" "}
                    <strong>anchors</strong>
                  </li>
                  <li>Single ID per element</li>
                  <li>
                    CSS selector: <code>#</code> (hash)
                  </li>
                </ul>
              </div>
            </div>

            <div className="code-example">
              <h3>Naming Conventions (BEM Methodology):</h3>
              <pre>
                <code>{`<!-- Block Element Modifier -->
<div class="card">
  <div class="card__header">
    <h2 class="card__title card__title--large">Title</h2>
  </div>
  <div class="card__body">
    <p class="card__text">Content</p>
    <button class="card__button card__button--primary">Click</button>
  </div>
</div>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Multiple Classes */}
        <section className="content-section">
          <div className="content-card">
            <h2>2. Multiple Classes on One Element</h2>

            <div className="code-example">
              <pre>
                <code>{`<!-- Utility Classes + Component Classes -->
<button class="btn btn-primary btn-lg active" 
        data-state="loading">
  Submit
</button>

<!-- Responsive Design -->
<div class="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  <div class="card shadow hover:shadow-lg transition">
    Content
  </div>
</div>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* HTML Attributes Every Dev Uses */}
        <section className="content-section">
          <div className="content-card">
            <h2>3. HTML Attributes Every Developer Uses</h2>

            <div className="attributes-grid">
              <div className="attribute-group">
                <h3>🔗 Link Attributes</h3>
                <div className="attribute-list">
                  <div className="attribute-item">
                    <code>target="_blank" rel="noopener noreferrer"</code>
                    <span>Security for external links</span>
                  </div>
                  <div className="attribute-item">
                    <code>download</code>
                    <span>Force file download</span>
                  </div>
                  <div className="attribute-item">
                    <code>href="tel:+1234567890"</code>
                    <span>Phone number links</span>
                  </div>
                  <div className="attribute-item">
                    <code>href="mailto:email@example.com"</code>
                    <span>Email links</span>
                  </div>
                </div>
              </div>

              <div className="attribute-group">
                <h3>📝 Form Attributes</h3>
                <div className="attribute-list">
                  <div className="attribute-item">
                    <code>disabled</code>
                    <span>Disable buttons/inputs</span>
                  </div>
                  <div className="attribute-item">
                    <code>autocomplete="email"</code>
                    <span>Browser autofill hints</span>
                  </div>
                  <div className="attribute-item">
                    <code>readonly</code>
                    <span>Read-only inputs</span>
                  </div>
                  <div className="attribute-item">
                    <code>placeholder</code>
                    <span>Input hint text</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="code-example">
              <h3>Real-World Examples:</h3>
              <pre>
                <code>{`<!-- Secure External Link -->
<a href="https://external.com" 
   target="_blank" 
   rel="noopener noreferrer">
  Visit External Site
</a>

<!-- Contact Links -->
<a href="tel:+1234567890">Call Us</a>
<a href="mailto:hello@company.com">Email Us</a>
<a href="sms:+1234567890">Text Us</a>

<!-- Download Link -->
<a href="/files/document.pdf" download>
  Download PDF
</a>

<!-- Form with Autocomplete -->
<form>
  <input type="email" autocomplete="email" placeholder="your@email.com">
  <input type="tel" autocomplete="tel" placeholder="Phone number">
  <button type="submit" disabled>Submit</button>
</form>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Button Types */}
        <section className="content-section">
          <div className="content-card">
            <h2>4. Proper Button Types</h2>

            <div className="button-types">
              <div className="button-type">
                <h3>📤 type="submit"</h3>
                <p>Submits the form (default in forms)</p>
                <code>{`<button type="submit">Save</button>`}</code>
              </div>

              <div className="button-type">
                <h3>🔄 type="button"</h3>
                <p>Regular button with custom JavaScript</p>
                <code>{`<button type="button" onclick="handleClick()">Click</button>`}</code>
              </div>

              <div className="button-type">
                <h3>🗑️ type="reset"</h3>
                <p>Resets form to initial values</p>
                <code>{`<button type="reset">Clear Form</button>`}</code>
              </div>
            </div>

            <div className="code-example">
              <h3>Form with Proper Button Types:</h3>
              <pre>
                <code>{`<form>
  <input type="text" name="username" placeholder="Username">
  <input type="email" name="email" placeholder="Email">
  
  <div class="form-actions">
    <button type="submit">Save Changes</button>
    <button type="reset">Reset Form</button>
    <button type="button" onclick="showHelp()">Help</button>
  </div>
</form>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Semantic Structure */}
        <section className="content-section">
          <div className="content-card">
            <h2>5. Real Project HTML Structure</h2>

            <div className="code-example">
              <h3>Professional Layout:</h3>
              <pre>
                <code>{`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Professional Website</title>
</head>
<body>
    <!-- Skip to content for accessibility -->
    <a href="#main" class="skip-link">Skip to main content</a>
    
    <header role="banner">
        <nav aria-label="Main navigation">
            <a href="/" aria-current="page">Home</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
        </nav>
    </header>
    
    <main id="main" role="main">
        <article>
            <header>
                <h1>Article Title</h1>
                <time datetime="2024-01-15">January 15, 2024</time>
            </header>
            
            <section aria-labelledby="section1">
                <h2 id="section1">First Section</h2>
                <p>Content here...</p>
            </section>
            
            <aside aria-label="Related information">
                <h3>Related Links</h3>
                <nav aria-label="Related navigation">
                    <a href="/related">Related Article</a>
                </nav>
            </aside>
        </article>
    </main>
    
    <footer role="contentinfo">
        <p>&copy; 2024 Company Name</p>
    </footer>
</body>
</html>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Common Mistakes */}
        <section className="content-section">
          <div className="content-card">
            <h2>6. Common Beginner Mistakes</h2>

            <div className="mistakes-grid">
              <div className="mistake-item bad">
                <h4>❌ Don't Do This</h4>
                <code>{`<img src="photo.jpg">`}</code>
                <p>Missing alt attribute</p>
              </div>

              <div className="mistake-item good">
                <h4>✅ Do This Instead</h4>
                <code>{`<img src="photo.jpg" alt="Person smiling outdoors" width="800" height="600">`}</code>
                <p>Descriptive alt text + dimensions</p>
              </div>

              <div className="mistake-item bad">
                <h4>❌ Don't Do This</h4>
                <code>{`<html>`}</code>
                <p>Missing language attribute</p>
              </div>

              <div className="mistake-item good">
                <h4>✅ Do This Instead</h4>
                <code>{`<html lang="en">`}</code>
                <p>Proper language declaration</p>
              </div>

              <div className="mistake-item bad">
                <h4>❌ Don't Do This</h4>
                <code>{`<div onclick="handleClick()">Button</div>`}</code>
                <p>Using div as button</p>
              </div>

              <div className="mistake-item good">
                <h4>✅ Do This Instead</h4>
                <code>{`<button type="button" onclick="handleClick()">Button</button>`}</code>
                <p>Semantic button element</p>
              </div>

              <div className="mistake-item bad">
                <h4>❌ Don't Do This</h4>
                <code>{`<b>Important</b>`}</code>
                <p>Using b for importance</p>
              </div>

              <div className="mistake-item good">
                <h4>✅ Do This Instead</h4>
                <code>{`<strong>Important</strong>`}</code>
                <p>Semantic strong element</p>
              </div>
            </div>
          </div>
        </section>

        {/* Summary */}
        <div className="summary-card">
          <h3>🎯 Professional HTML Checklist</h3>
          <div className="checklist">
            <div className="checklist-item">✓ Use semantic HTML5 elements</div>
            <div className="checklist-item">
              ✓ Include proper accessibility attributes
            </div>
            <div className="checklist-item">
              ✓ Add meaningful alt text to images
            </div>
            <div className="checklist-item">
              ✓ Use correct button types in forms
            </div>
            <div className="checklist-item">
              ✓ Implement lazy loading for performance
            </div>
            <div className="checklist-item">
              ✓ Include essential meta tags for SEO
            </div>
            <div className="checklist-item">
              ✓ Use data attributes for JavaScript
            </div>
            <div className="checklist-item">
              ✓ Follow BEM naming conventions
            </div>
            <div className="checklist-item">
              ✓ Add skip links for accessibility
            </div>
            <div className="checklist-item">✓ Validate your HTML</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Musthtml;
