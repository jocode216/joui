import React, { useState } from "react";
import "./seo.css";

function Seo() {
  const [copiedCode, setCopiedCode] = useState("");

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const robotsTxtContent = `User-agent: *
Allow: /
Disallow: /private
Disallow: /admin

Sitemap: https://yourwebsite.com/sitemap.xml`;

  const metaTagsContent = `<!-- Primary Meta Tags -->
<title>Your Website - What You Do</title>
<meta name="description" content="Brief description of your website (155-160 characters)">
<meta name="keywords" content="keyword1, keyword2, keyword3">
<meta name="author" content="Your Name">

<!-- Open Graph Tags -->
<meta property="og:title" content="Your Website Title">
<meta property="og:description" content="Your website description">
<meta property="og:image" content="https://yourwebsite.com/your-image.jpg">

<!-- Twitter Card -->
<meta name="twitter:title" content="Your Website Title">
<meta name="twitter:description" content="Your website description">
<meta name="twitter:image" content="https://yourwebsite.com/your-image.jpg">`;

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourwebsite.com/</loc>
    <priority>1.0</priority>
    <changefreq>weekly</changefreq>
  </url>
  <url>
    <loc>https://yourwebsite.com/about</loc>
    <priority>0.8</priority>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>https://yourwebsite.com/contact</loc>
    <priority>0.7</priority>
    <changefreq>monthly</changefreq>
  </url>
</urlset>`;

  const sitemapReference = `Sitemap: https://yourwebsite.com/sitemap.xml`;

  return (
    <main className="seo-container">
      <header className="seo-header">
        <div className="seo-avatar">SEO</div>
        <div className="seo-title">
          <h1>SEO Basics</h1>
          <p>
            Simple guide to make your website visible on Google
          </p>
        </div>
      </header>

      <div className="seo-main">
        {/* Part 1: What is SEO? */}
        <section className="seo-card">
          <h2>What is SEO?</h2>
          <p>
            <strong>SEO = Search Engine Optimization</strong>
          </p>
          <p>It's how you make your website appear in Google search results.</p>

          <h3>Simple Analogy:</h3>
          <p>
            <strong>Without SEO:</strong> Your website is like a shop in a dark
            alley with no sign
            <br />
            <strong>With SEO:</strong> Your website is like a shop on Main
            Street with a big sign
          </p>

          <h3>Why it matters:</h3>
          <ul>
            <li>More people can find your website</li>
            <li>Free traffic from Google</li>
            <li>Builds trust with visitors</li>
            <li>Helps grow your business/audience</li>
          </ul>
        </section>

        {/* Part 2: How Google Finds Your Site */}
        <section className="seo-card">
          <h2>How Google Finds Your Site</h2>
          <p>Google uses "crawlers" (like digital robots) that:</p>
          <ol>
            <li>Scan websites automatically</li>
            <li>Read your content</li>
            <li>Follow links between pages</li>
            <li>Understand what your site is about</li>
          </ol>

          <h3>Your Job is Simple:</h3>
          <p>Make it easy for Google to:</p>
          <ul>
            <li>Find your website (use sitemap)</li>
            <li>Understand your content (use meta tags)</li>
            <li>Know which pages are important (use robots.txt)</li>
          </ul>
        </section>

        {/* Step 1: Semantic Tags */}
        <section className="seo-card">
          <h2>Step 1: Use Proper HTML Structure</h2>
          <p>
            Use semantic tags instead of just <code>div</code>:
          </p>

          <div className="seo-code">
            <pre>{`<!-- Instead of just divs -->
<header>  <!-- For top section -->
<main>    <!-- For main content -->
<section> <!-- For content sections -->
<footer>  <!-- For bottom section -->
<nav>     <!-- For navigation -->
<article> <!-- For blog posts -->`}</pre>
          </div>

          <p>
            <strong>Why:</strong> Helps Google understand your page structure
            better
          </p>
        </section>

        {/* Step 2: Heading Hierarchy */}
        <section className="seo-card">
          <h2>Step 2: Use Correct Headings</h2>
          <p>
            <strong>Simple Rule:</strong> One H1 per page, then H2, then H3
          </p>

          <div className="seo-code">
            <pre>{`<h1>Main Title (Only One!)</h1>

<h2>First Major Section</h2>
<h3>Sub-section</h3>
<h3>Another sub-section</h3>

<h2>Second Major Section</h2>
<h3>More details here</h3>`}</pre>
          </div>

          <p>
            <strong>Why:</strong> Shows Google your content hierarchy
          </p>
        </section>

        {/* Step 3: Meta Tags */}
        <section className="seo-card">
          <h2>Step 3: Add Meta Tags</h2>
          <p>
            <strong>Location:</strong> Add to <code>public/index.html</code>
          </p>
          <p>These are like a "book cover" for your website:</p>

          <div className="seo-code">
            <div style={{ position: "relative" }}>
              <button
                onClick={() => copyToClipboard(metaTagsContent, "meta")}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: copiedCode === "meta" ? "#10b981" : "#dc2626",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                  zIndex: 1,
                }}
              >
                {copiedCode === "meta" ? "✓ Copied!" : "Copy Code"}
              </button>
              <pre>{metaTagsContent}</pre>
            </div>
          </div>

          <p>
            <strong>Important:</strong> Replace with YOUR website information!
          </p>
        </section>

        {/* Step 4: Robots.txt */}
        <section className="seo-card">
          <h2>Step 4: Create robots.txt</h2>
          <p>
            <strong>Location:</strong> Create <code>robots.txt</code> in{" "}
            <code>public/</code> folder
          </p>
          <p>Tells Google which pages to scan and which to ignore:</p>

          <div className="seo-code">
            <div style={{ position: "relative" }}>
              <button
                onClick={() => copyToClipboard(robotsTxtContent, "robots")}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: copiedCode === "robots" ? "#10b981" : "#dc2626",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                  zIndex: 1,
                }}
              >
                {copiedCode === "robots" ? "✓ Copied!" : "Copy Code"}
              </button>
              <pre>{robotsTxtContent}</pre>
            </div>
          </div>

          <p>
            <strong>What it does:</strong> Allows all public pages, blocks
            private/admin areas
          </p>
        </section>

        {/* Step 5: Sitemap */}
        <section className="seo-card">
          <h2>Step 5: Create sitemap.xml</h2>
          <p>
            <strong>Location:</strong> Create <code>sitemap.xml</code> in{" "}
            <code>public/</code> folder
          </p>
          <p>A list of all your important pages:</p>

          <div className="seo-code">
            <div style={{ position: "relative" }}>
              <button
                onClick={() => copyToClipboard(sitemapContent, "sitemap")}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: copiedCode === "sitemap" ? "#10b981" : "#dc2626",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                  zIndex: 1,
                }}
              >
                {copiedCode === "sitemap" ? "✓ Copied!" : "Copy Code"}
              </button>
              <pre>{sitemapContent}</pre>
            </div>
          </div>

          <h3>Don't forget to add to robots.txt:</h3>
          <div className="seo-code">
            <div style={{ position: "relative" }}>
              <button
                onClick={() => copyToClipboard(sitemapReference, "reference")}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background:
                    copiedCode === "reference" ? "#10b981" : "#dc2626",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                  zIndex: 1,
                }}
              >
                {copiedCode === "reference" ? "✓ Copied!" : "Copy Code"}
              </button>
              <pre>{sitemapReference}</pre>
            </div>
          </div>
        </section>

        {/* Step 6: Google Search Console */}
        <section className="seo-card">
          <h2>Step 6: Submit to Google</h2>
          <p>
            <strong>This is FREE and EASY!</strong>
          </p>

          <h3>Go to Google Search Console:</h3>
          <p>
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#dc2626", fontWeight: "bold" }}
            >
              https://search.google.com/search-console
            </a>
          </p>

          <h3>Simple Steps:</h3>
          <ol>
            <li>Sign in with Google account</li>
            <li>Add your website URL</li>
            <li>Choose "HTML tag" verification</li>
            <li>Copy the tag they give you</li>
            <li>Paste it in your index.html</li>
            <li>Click "Verify"</li>
            <li>Submit your sitemap URL</li>
          </ol>

          <p>
            <strong>Wait 1-2 weeks</strong> for Google to index your site
          </p>
        </section>
      </div>

      {/* Quick Tips */}
      <aside className="seo-summary">
        <h3>Quick Tips for Better SEO</h3>
        <ul>
          <li>
            <strong>Image Alt Text:</strong> Always add{" "}
            <code>alt="description"</code>
          </li>
          <li>
            <strong>Internal Links:</strong> Link between your own pages
          </li>
          <li>
            <strong>Page Speed:</strong> Compress images, remove unused code
          </li>
          <li>
            <strong>Good URLs:</strong> Use <code>/about-us</code> not{" "}
            <code>/page2</code>
          </li>
          <li>
            <strong>Quality Content:</strong> Write helpful, original articles
          </li>
          <li>
            <strong>Mobile Friendly:</strong> Your Vite app already is!
          </li>
        </ul>

        <div
          style={{
            marginTop: "2rem",
            padding: "1.5rem",
            background: "#fef2f2",
            borderRadius: "8px",
            border: "2px solid #dc2626",
          }}
        >
          <h4 style={{ margin: "0 0 1rem 0", color: "#dc2626" }}>
            📝 Your Simple Checklist:
          </h4>
          <ol style={{ margin: 0, paddingLeft: "1.5rem", color: "#4b5563" }}>
            <li>Understand what SEO is</li>
            <li>Add semantic tags to HTML</li>
            <li>Fix heading hierarchy (H1 → H2 → H3)</li>
            <li>Add meta tags to index.html</li>
            <li>Create robots.txt file</li>
            <li>Create sitemap.xml file</li>
            <li>Submit to Google Search Console</li>
            <li>Add alt text to images</li>
            <li>Wait 2 weeks and check results!</li>
          </ol>
        </div>
      </aside>
    </main>
  );
}

export default Seo;
