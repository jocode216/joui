import React from "react";
import "./atributes.css";

function BasicAttributes() {
  return (
    <div className="attributes-container">
      <div className="attributes-header">
        <div className="attributes-avatar">🔧</div>
        <div className="attributes-title">
          <h1>HTML Attributes & Advanced Features</h1>
          <p>
            Enhance your HTML with attributes, semantics, and modern features
          </p>
        </div>
      </div>

      <div className="attributes-content">
        {/* HTML Attributes Introduction */}
        <section className="content-section">
          <div className="content-card">
            <h2>HTML Attributes</h2>
            <p className="lead-text">
              Attributes provide additional information about HTML elements and
              modify their behavior or appearance.
            </p>

            <div className="attribute-example">
              <h3>Basic Syntax:</h3>
              <div className="code-example">
                <pre>
                  <code>{`<tagname attribute="value">Content</tagname>`}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Global vs Specific Attributes */}
        <section className="content-section">
          <div className="content-card">
            <h2>Global vs Specific Attributes</h2>

            <div className="attributes-comparison">
              <div className="attribute-type">
                <h3>Global Attributes</h3>
                <p>
                  Can be used on <strong>any</strong> HTML element
                </p>
                <div className="attribute-list">
                  <div className="attribute-item">
                    <code>id</code>
                    <span>Unique identifier for an element</span>
                  </div>
                  <div className="attribute-item">
                    <code>class</code>
                    <span>Space-separated list of classes</span>
                  </div>
                  <div className="attribute-item">
                    <code>style</code>
                    <span>Inline CSS styles</span>
                  </div>
                  <div className="attribute-item">
                    <code>title</code>
                    <span>Tooltip text on hover</span>
                  </div>
                  <div className="attribute-item">
                    <code>lang</code>
                    <span>Language of the element</span>
                  </div>
                </div>
              </div>

              <div className="attribute-type">
                <h3> Specific Attributes</h3>
                <p>
                  Only work on <strong>specific</strong> elements
                </p>
                <div className="attribute-list">
                  <div className="attribute-item">
                    <code>href</code>
                    <span>Link destination (a tag)</span>
                  </div>
                  <div className="attribute-item">
                    <code>src</code>
                    <span>Source URL (img, script)</span>
                  </div>
                  <div className="attribute-item">
                    <code>alt</code>
                    <span>Alternative text (img)</span>
                  </div>
                  <div className="attribute-item">
                    <code>type</code>
                    <span>Input type (input)</span>
                  </div>
                  <div className="attribute-item">
                    <code>required</code>
                    <span>Mandatory field (form)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Common Attributes in Action */}
        <section className="content-section">
          <div className="content-card">
            <h2>Common Attributes in Action</h2>

            <div className="code-example">
              <h3>Real-world Examples:</h3>
              <pre>
                <code>{`<!-- ID and Class -->
<div id="header" class="container primary">
  <h1 class="title">Welcome</h1>
</div>

<!-- Data Attributes -->
<button data-user-id="123" data-action="delete">
  Delete User
</button>

<!-- Style and Title -->
<p style="color: red; font-size: 16px;" 
   title="Important message">
  This is important!
</p>

<!-- Lang and Dir -->
<article lang="en" dir="ltr">
  English content here
</article>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Semantic HTML5 Elements */}
        <section className="content-section">
          <div className="content-card">
            <h2>Semantic HTML5 Elements</h2>
            <p>
              Semantic elements clearly describe their meaning to both browser
              and developer.
            </p>

            <div className="semantic-grid">
              <div className="semantic-item">
                <code>&lt;nav&gt;</code>
                <span>Navigation links</span>
              </div>
              <div className="semantic-item">
                <code>&lt;figure&gt;</code>
                <span>Self-contained content</span>
              </div>
              <div className="semantic-item">
                <code>&lt;figcaption&gt;</code>
                <span>Caption for figure</span>
              </div>
              <div className="semantic-item">
                <code>&lt;details&gt;</code>
                <span>Collapsible content</span>
              </div>
              <div className="semantic-item">
                <code>&lt;summary&gt;</code>
                <span>Summary for details</span>
              </div>
              <div className="semantic-item">
                <code>&lt;dialog&gt;</code>
                <span>Dialog box/modal</span>
              </div>
              <div className="semantic-item">
                <code>&lt;canvas&gt;</code>
                <span>Graphics drawing</span>
              </div>
              <div className="semantic-item">
                <code>&lt;progress&gt;</code>
                <span>Progress indicator</span>
              </div>
              <div className="semantic-item">
                <code>&lt;meter&gt;</code>
                <span>Scalar measurement</span>
              </div>
            </div>

            <div className="code-example">
              <h3>Semantic HTML Example:</h3>
              <pre>
                <code>{`<article>
  <header>
    <h1>Article Title</h1>
    <time datetime="2024-01-15">January 15, 2024</time>
  </header>
  
  <figure>
    <img src="image.jpg" alt="Description">
    <figcaption>Image caption</figcaption>
  </figure>
  
  <details>
    <summary>Read more</summary>
    <p>Additional content here...</p>
  </details>
  
  <footer>
    <p>Article footer</p>
  </footer>
</article>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* HTML Forms in Detail */}
        <section className="content-section">
          <div className="content-card">
            <h2>HTML Forms & Input Types</h2>

            <div className="input-types-grid">
              <div className="input-category">
                <h3>Basic Input Types</h3>
                <div className="input-list">
                  <div className="input-item">
                    <code>type="text"</code>
                    <span>Single-line text</span>
                  </div>
                  <div className="input-item">
                    <code>type="email"</code>
                    <span>Email address</span>
                  </div>
                  <div className="input-item">
                    <code>type="password"</code>
                    <span>Password field</span>
                  </div>
                  <div className="input-item">
                    <code>type="tel"</code>
                    <span>Telephone number</span>
                  </div>
                  <div className="input-item">
                    <code>type="url"</code>
                    <span>Website URL</span>
                  </div>
                </div>
              </div>

              <div className="input-category">
                <h3>Advanced Input Types</h3>
                <div className="input-list">
                  <div className="input-item">
                    <code>type="number"</code>
                    <span>Numeric input</span>
                  </div>
                  <div className="input-item">
                    <code>type="date"</code>
                    <span>Date picker</span>
                  </div>
                  <div className="input-item">
                    <code>type="color"</code>
                    <span>Color picker</span>
                  </div>
                  <div className="input-item">
                    <code>type="range"</code>
                    <span>Slider control</span>
                  </div>
                  <div className="input-item">
                    <code>type="file"</code>
                    <span>File upload</span>
                  </div>
                </div>
              </div>

              <div className="input-category">
                <h3>Form Validation</h3>
                <div className="input-list">
                  <div className="input-item">
                    <code>required</code>
                    <span>Mandatory field</span>
                  </div>
                  <div className="input-item">
                    <code>pattern</code>
                    <span>Regex validation</span>
                  </div>
                  <div className="input-item">
                    <code>min/max</code>
                    <span>Value range</span>
                  </div>
                  <div className="input-item">
                    <code>maxlength</code>
                    <span>Character limit</span>
                  </div>
                  <div className="input-item">
                    <code>placeholder</code>
                    <span>Hint text</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="code-example">
              <h3>Complete Form Example:</h3>
              <pre>
                <code>{`<form>
  <fieldset>
    <legend>Personal Information</legend>
    
    <label for="name">Full Name:</label>
    <input type="text" id="name" name="name" 
           required placeholder="Enter your name">
    
    <label for="email">Email:</label>
    <input type="email" id="email" name="email" 
           required placeholder="email@example.com">
    
    <label for="age">Age:</label>
    <input type="number" id="age" name="age" 
           min="18" max="100">
    
    <label for="website">Website:</label>
    <input type="url" id="website" name="website" 
           placeholder="https://example.com">
  </fieldset>
  
  <button type="submit">Submit</button>
</form>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Accessibility Basics */}
        <section className="content-section">
          <div className="content-card">
            <h2>Accessibility (a11y) Basics</h2>

            <div className="accessibility-grid">
              <div className="a11y-item">
                <h3>ARIA Roles & Labels</h3>
                <div className="a11y-list">
                  <div className="a11y-point">
                    <code>role="button"</code>
                    <span>Defines element as button</span>
                  </div>
                  <div className="a11y-point">
                    <code>aria-label</code>
                    <span>Provides accessible name</span>
                  </div>
                  <div className="a11y-point">
                    <code>aria-describedby</code>
                    <span>Links to description</span>
                  </div>
                  <div className="a11y-point">
                    <code>aria-hidden</code>
                    <span>Hides from screen readers</span>
                  </div>
                </div>
              </div>

              <div className="a11y-item">
                <h3>Best Practices</h3>
                <div className="a11y-list">
                  <div className="a11y-point">
                    <strong>Heading Hierarchy</strong>
                    <span>Use h1-h6 in order</span>
                  </div>
                  <div className="a11y-point">
                    <strong>Alt Text</strong>
                    <span>Describe images meaningfully</span>
                  </div>
                  <div className="a11y-point">
                    <strong>Keyboard Navigation</strong>
                    <span>Ensure tab order makes sense</span>
                  </div>
                  <div className="a11y-point">
                    <strong>Color Contrast</strong>
                    <span>Ensure readable text</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="code-example">
              <h3>Accessible HTML Example:</h3>
              <pre>
                <code>{`<!-- Proper heading structure -->
<h1>Main Title</h1>
<h2>Section Title</h2>
<h3>Subsection Title</h3>

<!-- Accessible image -->
<img src="chart.jpg" 
     alt="Sales growth chart showing 25% increase in Q4 2023"
     aria-describedby="chart-desc">

<p id="chart-desc">Bar chart comparing quarterly sales figures</p>

<!-- Accessible button -->
<button aria-label="Close notification dialog">
  ×
</button>

<!-- Keyboard navigation -->
<a href="#main" tabindex="0">Skip to main content</a>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* HTML Entities & Metadata */}
        <section className="content-section">
          <div className="content-card">
            <h2>HTML Entities & Metadata</h2>

            <div className="entities-metadata">
              <div className="entities-section">
                <h3>Common HTML Entities</h3>
                <div className="entities-grid">
                  <div className="entity-item">
                    <code>&amp;lt;</code>
                    <span>&lt; (Less than)</span>
                  </div>
                  <div className="entity-item">
                    <code>&amp;gt;</code>
                    <span>&gt; (Greater than)</span>
                  </div>
                  <div className="entity-item">
                    <code>&amp;amp;</code>
                    <span>&amp; (Ampersand)</span>
                  </div>
                  <div className="entity-item">
                    <code>&amp;copy;</code>
                    <span>© (Copyright)</span>
                  </div>
                  <div className="entity-item">
                    <code>&amp;nbsp;</code>
                    <span> (Non-breaking space)</span>
                  </div>
                  <div className="entity-item">
                    <code>&amp;quot;</code>
                    <span>" (Quotation mark)</span>
                  </div>
                </div>
              </div>

              <div className="metadata-section">
                <h3>Important Meta Tags</h3>
                <div className="code-example">
                  <pre>
                    <code>{`<!-- Character Encoding -->
<meta charset="UTF-8">

<!-- Viewport for Responsive -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- SEO Meta Tags -->
<meta name="description" content="Page description">
<meta name="keywords" content="keyword1, keyword2">
<meta name="author" content="Author Name">

<!-- Social Media (Open Graph) -->
<meta property="og:title" content="Page Title">
<meta property="og:description" content="Page description">
<meta property="og:image" content="image.jpg">

<!-- Theme Color -->
<meta name="theme-color" content="#3498db">

<!-- Robots -->
<meta name="robots" content="index, follow">`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Features */}
        <section className="content-section">
          <div className="content-card">
            <h2>Advanced HTML Features</h2>

            <div className="advanced-features">
              <div className="feature-item">
                <h3>Iframe Attributes</h3>
                <div className="feature-list">
                  <div className="feature-point">
                    <code>sandbox</code>
                    <span>Restricts iframe capabilities</span>
                  </div>
                  <div className="feature-point">
                    <code>allowfullscreen</code>
                    <span>Allows fullscreen mode</span>
                  </div>
                  <div className="feature-point">
                    <code>loading="lazy"</code>
                    <span>Deferred loading</span>
                  </div>
                  <div className="feature-point">
                    <code>referrerpolicy</code>
                    <span>Controls referrer information</span>
                  </div>
                </div>
              </div>

              <div className="feature-item">
                <h3>Performance & Security</h3>
                <div className="feature-list">
                  <div className="feature-point">
                    <code>loading="lazy"</code>
                    <span>Lazy load images/iframes</span>
                  </div>
                  <div className="feature-point">
                    <code>rel="noopener"</code>
                    <span>Security for target="_blank"</span>
                  </div>
                  <div className="feature-point">
                    <code>ping</code>
                    <span>URLs to notify when link clicked</span>
                  </div>
                  <div className="feature-point">
                    <code>decoding="async"</code>
                    <span>Async image decoding</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="code-example">
              <h3>Modern HTML Example:</h3>
              <pre>
                <code>{`<!-- Lazy loading image -->
<img src="large-image.jpg" 
     alt="Description"
     loading="lazy"
     width="800" 
     height="600">

<!-- Secure external link -->
<a href="https://external.com" 
   target="_blank"
   rel="noopener noreferrer">
  External Link
</a>

<!-- Sandboxed iframe -->
<iframe src="https://example.com"
        sandbox="allow-scripts"
        loading="lazy"
        title="Example Content">
</iframe>

<!-- HTML Comments -->
<!-- This is a comment -->
<!--[if IE]>
  Special instructions for IE
<![endif]-->`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Summary */}
        <div className="summary-card">
          <h3>🎯 Key Takeaways</h3>
          <div className="key-points">
            <div className="key-point">
              <strong>Attributes enhance elements</strong> - Provide additional
              functionality and information
            </div>
            <div className="key-point">
              <strong>Semantic HTML improves accessibility</strong> - Better for
              users and SEO
            </div>
            <div className="key-point">
              <strong>Modern features boost performance</strong> - Lazy loading,
              security attributes
            </div>
            <div className="key-point">
              <strong>Accessibility is crucial</strong> - Make your websites
              usable for everyone
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BasicAttributes;
