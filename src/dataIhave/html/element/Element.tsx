import React from "react";
import "./element.css";

function Element() {
  return (
    <div className="element-container">
      <div className="element-header">
        <div className="element-avatar">📄</div>
        <div className="element-title">
          <h1>HTML Elements, Tags & Content</h1>
          <p>Understanding the building blocks of web pages</p>
        </div>
      </div>

      <div className="element-content">
        {/* What is Element Section */}
        <section className="content-section">
          <div className="content-card">
            <h2>What is an HTML Element?</h2>
            <p className="lead-text">
              An HTML Element is everything from the start tag to the end tag,
              including everything in between.
            </p>

            <div className="element-visual">
              <div className="element-breakdown">
                <div className="tag-part opening-tag">
                  <span>&lt;p&gt;</span>
                  <span className="tag-label">Start Tag</span>
                </div>
                <div className="content-part">
                  <span>This is paragraph content</span>
                  <span className="content-label">Content</span>
                </div>
                <div className="tag-part closing-tag">
                  <span>&lt;/p&gt;</span>
                  <span className="tag-label">End Tag</span>
                </div>
              </div>
            </div>

            <p>Every HTML element consists of two main parts:</p>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">🏷️</div>
                <h4>Tags</h4>
                <p>
                  Tells the browser how the element should be displayed and
                  structured
                </p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📝</div>
                <h4>Content</h4>
                <p>
                  The actual text, images, or media that gets displayed to users
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What is Tag Section */}
        <section className="content-section">
          <div className="content-card">
            <h2>What are HTML Tags?</h2>
            <p>
              HTML Tags are the labels that define how content should be
              structured and displayed. They are the keywords surrounded by
              angle brackets <code>&lt; &gt;</code>.
            </p>

            <div className="tag-examples">
              <h3>Common HTML Tags:</h3>
              <div className="tags-grid">
                <div className="tag-example">
                  <code>&lt;h1&gt;...&lt;/h1&gt;</code>
                  <span>Heading Level 1</span>
                </div>
                <div className="tag-example">
                  <code>&lt;p&gt;...&lt;/p&gt;</code>
                  <span>Paragraph</span>
                </div>
                <div className="tag-example">
                  <code>&lt;a&gt;...&lt;/a&gt;</code>
                  <span>Anchor/Link</span>
                </div>
                <div className="tag-example">
                  <code>&lt;img&gt;</code>
                  <span>Image (empty tag)</span>
                </div>
                <div className="tag-example">
                  <code>&lt;div&gt;...&lt;/div&gt;</code>
                  <span>Division/Container</span>
                </div>
                <div className="tag-example">
                  <code>&lt;span&gt;...&lt;/span&gt;</code>
                  <span>Inline container</span>
                </div>
              </div>
            </div>

            <div className="tag-types">
              <h3>Types of Tags:</h3>
              <div className="types-grid">
                <div className="type-item">
                  <h4>Container Tags</h4>
                  <p>Have both opening and closing tags</p>
                  <code>&lt;tag&gt;content&lt;/tag&gt;</code>
                </div>
                <div className="type-item">
                  <h4>Empty Tags</h4>
                  <p>Self-closing tags with no content</p>
                  <code>&lt;tag&gt;</code> or <code>&lt;tag /&gt;</code>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What is Content Section */}
        <section className="content-section">
          <div className="content-card">
            <h2>What is Content?</h2>
            <p>
              Content is the actual information that users see and interact with
              on your web page. It's what goes between the opening and closing
              tags.
            </p>

            <div className="content-examples">
              <h3>Types of Content:</h3>
              <div className="examples-grid">
                <div className="example-item">
                  <h4>Text Content</h4>
                  <p>Headings, paragraphs, lists, links</p>
                  <div className="code-snippet">
                    <code>{`<h1>Welcome!</h1>
<p>This is text content.</p>`}</code>
                  </div>
                </div>
                <div className="example-item">
                  <h4>Media Content</h4>
                  <p>Images, videos, audio files</p>
                  <div className="code-snippet">
                    <code>{`<img src="photo.jpg" alt="Description">
<video controls>...</video>`}</code>
                  </div>
                </div>
                <div className="example-item">
                  <h4>Interactive Content</h4>
                  <p>Buttons, forms, input fields</p>
                  <div className="code-snippet">
                    <code>{`<button>Click Me</button>
<input type="text">`}</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Setup Section */}
        <section className="content-section">
          <div className="content-card">
            <h2>Development Setup</h2>

            <div className="setup-grid">
              <div className="setup-item">
                <div className="setup-icon">💻</div>
                <div className="setup-content">
                  <h3>Code Editor</h3>
                  <p>
                    While you can start with basic text editors, professional
                    developers use specialized code editors that provide
                    powerful features:
                  </p>
                  <ul>
                    <li>
                      <strong>Syntax highlighting</strong> - Colors different
                      parts of your code
                    </li>
                    <li>
                      <strong>Auto-completion</strong> - Suggests code as you
                      type
                    </li>
                    <li>
                      <strong>Error detection</strong> - Highlights mistakes
                      before running
                    </li>
                    <li>
                      <strong>Extensions</strong> - Add extra functionality
                    </li>
                  </ul>
                  <div className="recommendation">
                    <strong>Jocode recommends:</strong> Visual Studio Code (VS
                    Code)
                    <p>
                      It's free, powerful, and has excellent HTML/CSS support!
                    </p>
                  </div>
                </div>
              </div>

              <div className="setup-item">
                <div className="setup-icon">🌐</div>
                <div className="setup-content">
                  <h3>Web Browser</h3>
                  <p>
                    A web browser is software that reads your HTML documents and
                    displays them as visual web pages.
                  </p>
                  <div className="browsers-list">
                    <h4>Popular Browsers:</h4>
                    <div className="browsers-grid">
                      <div className="browser-item">
                        <span>🦊</span>
                        <span>Firefox</span>
                      </div>
                      <div className="browser-item">
                        <span>🔵</span>
                        <span>Chrome</span>
                      </div>
                      <div className="browser-item">
                        <span>🌀</span>
                        <span>Edge</span>
                      </div>
                      <div className="browser-item">
                        <span>🦁</span>
                        <span>Safari</span>
                      </div>
                    </div>
                  </div>
                  <div className="browser-tip">
                    <strong>Tip:</strong> Test your websites in multiple
                    browsers to ensure they work everywhere!
                  </div>
                </div>
              </div>
            </div>

            <div className="workflow-guide">
              <h3>Your Development Workflow:</h3>
              <div className="workflow-steps">
                <div className="workflow-step">
                  <div className="step-number">1</div>
                  <p>Write HTML code in VS Code</p>
                </div>
                <div className="workflow-step">
                  <div className="step-number">2</div>
                  <p>Save file with .html extension</p>
                </div>
                <div className="workflow-step">
                  <div className="step-number">3</div>
                  <p>Open in browser to see results</p>
                </div>
                <div className="workflow-step">
                  <div className="step-number">4</div>
                  <p>Refresh browser after changes</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="element-footer">
          <h3>Ready to Build?</h3>
          <p>
            Now that you understand elements, tags, and content, you're ready to
            start creating your own web pages. Remember: every website is built
            using these fundamental building blocks!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Element;
