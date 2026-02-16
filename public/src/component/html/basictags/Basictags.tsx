import React from "react";
import "./basictags.css";

function Basictags() {
  return (
    <div className="basictags-container">
      <div className="basictags-header">
        <div className="basictags-avatar">🏷️</div>
        <div className="basictags-title">
          <h1>HTML Basic Tags</h1>
          <p>Essential HTML tags every developer should know</p>
        </div>
      </div>

      <div className="basictags-content">
        {/* Introduction */}
        <div className="content-card">
          <h2>HTML Tags are Divided Into Two Main Categories</h2>
          <div className="categories-overview">
            <div className="category-block">
              <h3>Block Level Elements</h3>
              <p>Start on a new line and take full width</p>
            </div>
            <div className="category-inline">
              <h3>Inline Elements</h3>
              <p>Stay in the same line, take only necessary space</p>
            </div>
          </div>
        </div>

        {/* Block Level Elements */}
        <section className="tags-section">
          <div className="section-header">
            <h2>📦 Block Level Elements</h2>
            <p>Elements that start on a new line and take full width</p>
          </div>

          <div className="tags-grid">
            {/* Headings */}
            <div className="tag-category">
              <h3>Headings</h3>
              <div className="tag-list">
                <div className="tag-item">
                  <code>&lt;h1&gt;</code>
                  <span>Main heading (largest)</span>
                </div>
                <div className="tag-item">
                  <code>&lt;h2&gt;</code>
                  <span>Section heading</span>
                </div>
                <div className="tag-item">
                  <code>&lt;h3&gt;</code>
                  <span>Sub-section heading</span>
                </div>
                <div className="tag-item">
                  <code>&lt;h4&gt;</code>
                  <span>Small heading</span>
                </div>
                <div className="tag-item">
                  <code>&lt;h5&gt;</code>
                  <span>Minor heading</span>
                </div>
                <div className="tag-item">
                  <code>&lt;h6&gt;</code>
                  <span>Smallest heading</span>
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="tag-category">
              <h3>Text & Content</h3>
              <div className="tag-list">
                <div className="tag-item">
                  <code>&lt;p&gt;</code>
                  <span>Paragraph text</span>
                </div>
                <div className="tag-item">
                  <code>&lt;div&gt;</code>
                  <span>Division/container</span>
                </div>
                <div className="tag-item">
                  <code>&lt;section&gt;</code>
                  <span>Content section</span>
                </div>
                <div className="tag-item">
                  <code>&lt;article&gt;</code>
                  <span>Independent content</span>
                </div>
                <div className="tag-item">
                  <code>&lt;header&gt;</code>
                  <span>Page header</span>
                </div>
                <div className="tag-item">
                  <code>&lt;footer&gt;</code>
                  <span>Page footer</span>
                </div>
                <div className="tag-item">
                  <code>&lt;main&gt;</code>
                  <span>Main content area</span>
                </div>
                <div className="tag-item">
                  <code>&lt;aside&gt;</code>
                  <span>Sidebar content</span>
                </div>
              </div>
            </div>

            {/* Text Formatting */}
            <div className="tag-category">
              <h3>Text Formatting</h3>
              <div className="tag-list">
                <div className="tag-item">
                  <code>&lt;strong&gt;</code>
                  <span>Important text (bold)</span>
                </div>
                <div className="tag-item">
                  <code>&lt;em&gt;</code>
                  <span>Emphasized text (italic)</span>
                </div>
                <div className="tag-item">
                  <code>&lt;mark&gt;</code>
                  <span>Highlighted text</span>
                </div>
                <div className="tag-item">
                  <code>&lt;del&gt;</code>
                  <span>Deleted text</span>
                </div>
                <div className="tag-item">
                  <code>&lt;ins&gt;</code>
                  <span>Inserted text</span>
                </div>
                <div className="tag-item">
                  <code>&lt;code&gt;</code>
                  <span>Inline code</span>
                </div>
                <div className="tag-item">
                  <code>&lt;pre&gt;</code>
                  <span>Preformatted text</span>
                </div>
                <div className="tag-item">
                  <code>&lt;blockquote&gt;</code>
                  <span>Block quotation</span>
                </div>
              </div>
            </div>

            {/* Lists */}
            <div className="tag-category">
              <h3>Lists</h3>
              <div className="tag-list">
                <div className="tag-item">
                  <code>&lt;ul&gt;</code>
                  <span>Unordered list</span>
                </div>
                <div className="tag-item">
                  <code>&lt;ol&gt;</code>
                  <span>Ordered list</span>
                </div>
                <div className="tag-item">
                  <code>&lt;li&gt;</code>
                  <span>List item</span>
                </div>
                <div className="tag-item">
                  <code>&lt;dl&gt;</code>
                  <span>Description list</span>
                </div>
                <div className="tag-item">
                  <code>&lt;dt&gt;</code>
                  <span>Description term</span>
                </div>
                <div className="tag-item">
                  <code>&lt;dd&gt;</code>
                  <span>Description details</span>
                </div>
              </div>
            </div>

            {/* Forms */}
            <div className="tag-category">
              <h3>Forms</h3>
              <div className="tag-list">
                <div className="tag-item">
                  <code>&lt;form&gt;</code>
                  <span>Form container</span>
                </div>
                <div className="tag-item">
                  <code>&lt;input&gt;</code>
                  <span>Input field</span>
                </div>
                <div className="tag-item">
                  <code>&lt;textarea&gt;</code>
                  <span>Multi-line text input</span>
                </div>
                <div className="tag-item">
                  <code>&lt;select&gt;</code>
                  <span>Dropdown list</span>
                </div>
                <div className="tag-item">
                  <code>&lt;option&gt;</code>
                  <span>Dropdown option</span>
                </div>
                <div className="tag-item">
                  <code>&lt;button&gt;</code>
                  <span>Clickable button</span>
                </div>
                <div className="tag-item">
                  <code>&lt;label&gt;</code>
                  <span>Input label</span>
                </div>
              </div>
            </div>

            {/* Tables */}
            <div className="tag-category">
              <h3>Tables</h3>
              <div className="tag-list">
                <div className="tag-item">
                  <code>&lt;table&gt;</code>
                  <span>Table container</span>
                </div>
                <div className="tag-item">
                  <code>&lt;tr&gt;</code>
                  <span>Table row</span>
                </div>
                <div className="tag-item">
                  <code>&lt;td&gt;</code>
                  <span>Table data cell</span>
                </div>
                <div className="tag-item">
                  <code>&lt;th&gt;</code>
                  <span>Table header cell</span>
                </div>
                <div className="tag-item">
                  <code>&lt;thead&gt;</code>
                  <span>Table header section</span>
                </div>
                <div className="tag-item">
                  <code>&lt;tbody&gt;</code>
                  <span>Table body section</span>
                </div>
                <div className="tag-item">
                  <code>&lt;tfoot&gt;</code>
                  <span>Table footer section</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Inline Elements */}
        <section className="tags-section">
          <div className="section-header">
            <h2>🔗 Inline Elements</h2>
            <p>
              Elements that stay in the same line and take only necessary space
            </p>
          </div>

          <div className="tags-grid">
            {/* Links & Media */}
            <div className="tag-category">
              <h3>Links & Media</h3>
              <div className="tag-list">
                <div className="tag-item">
                  <code>&lt;a&gt;</code>
                  <span>Hyperlink/anchor</span>
                </div>
                <div className="tag-item">
                  <code>&lt;img&gt;</code>
                  <span>Image</span>
                </div>
                <div className="tag-item">
                  <code>&lt;video&gt;</code>
                  <span>Video player</span>
                </div>
                <div className="tag-item">
                  <code>&lt;audio&gt;</code>
                  <span>Audio player</span>
                </div>
                <div className="tag-item">
                  <code>&lt;iframe&gt;</code>
                  <span>Inline frame</span>
                </div>
              </div>
            </div>

            {/* Text Formatting */}
            <div className="tag-category">
              <h3>Text Formatting</h3>
              <div className="tag-list">
                <div className="tag-item">
                  <code>&lt;span&gt;</code>
                  <span>Inline container</span>
                </div>
                <div className="tag-item">
                  <code>&lt;b&gt;</code>
                  <span>Bold text</span>
                </div>
                <div className="tag-item">
                  <code>&lt;i&gt;</code>
                  <span>Italic text</span>
                </div>
                <div className="tag-item">
                  <code>&lt;u&gt;</code>
                  <span>Underlined text</span>
                </div>
                <div className="tag-item">
                  <code>&lt;small&gt;</code>
                  <span>Smaller text</span>
                </div>
                <div className="tag-item">
                  <code>&lt;sup&gt;</code>
                  <span>Superscript</span>
                </div>
                <div className="tag-item">
                  <code>&lt;sub&gt;</code>
                  <span>Subscript</span>
                </div>
                <div className="tag-item">
                  <code>&lt;br&gt;</code>
                  <span>Line break</span>
                </div>
                <div className="tag-item">
                  <code>&lt;hr&gt;</code>
                  <span>Horizontal rule</span>
                </div>
              </div>
            </div>

            {/* Forms Inline */}
            <div className="tag-category">
              <h3>Form Elements</h3>
              <div className="tag-list">
                <div className="tag-item">
                  <code>&lt;input&gt;</code>
                  <span>Input field</span>
                </div>
                <div className="tag-item">
                  <code>&lt;select&gt;</code>
                  <span>Dropdown</span>
                </div>
                <div className="tag-item">
                  <code>&lt;button&gt;</code>
                  <span>Button</span>
                </div>
                <div className="tag-item">
                  <code>&lt;label&gt;</code>
                  <span>Input label</span>
                </div>
                <div className="tag-item">
                  <code>&lt;textarea&gt;</code>
                  <span>Text area</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Examples */}
        <section className="examples-section">
          <div className="content-card">
            <h2>📝 Usage Examples</h2>

            <div className="example-grid">
              <div className="example-item">
                <h3>Block Level Example</h3>
                <div className="code-example">
                  <pre>
                    <code>{`<div>
  <h1>Main Title</h1>
  <p>This is a paragraph that 
  takes the full width.</p>
  <ul>
    <li>List item 1</li>
    <li>List item 2</li>
  </ul>
</div>`}</code>
                  </pre>
                </div>
              </div>

              <div className="example-item">
                <h3>Inline Level Example</h3>
                <div className="code-example">
                  <pre>
                    <code>{`<p>
  This is <strong>bold text</strong> and 
  this is <em>italic text</em>. 
  Click <a href="#">this link</a> to 
  see an <img src="image.jpg">.
</p>`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Summary */}
        <div className="summary-card">
          <h3>🎯 Key Takeaways</h3>
          <div className="key-points">
            <div className="key-point">
              <strong>Block Elements:</strong> Start new line, take full width
              (div, p, h1-h6, ul, form)
            </div>
            <div className="key-point">
              <strong>Inline Elements:</strong> Stay in same line, take needed
              space (span, a, img, strong)
            </div>
            <div className="key-point">
              <strong>Remember:</strong> Some elements like input, button,
              textarea can be styled as either block or inline
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Basictags;
