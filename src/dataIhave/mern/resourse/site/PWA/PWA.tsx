import React, { useState, useEffect } from "react";
import "./pwa.css";

// Define types for the install prompt
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function PWA() {
  const [copiedCode, setCopiedCode] = useState("");
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  // Listen for install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setInstallPrompt(promptEvent);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  // Handle installation
  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const result = await installPrompt.userChoice;
    if (result.outcome === "accepted") {
      setShowInstallButton(false);
      setInstallPrompt(null);
    }
  };

  // Copy to clipboard function
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(""), 2000);
  };
  const manifestContent = `{
  "name": "Hotel Booking App",
  "short_name": "HotelApp",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}`;

  const htmlTagsContent = `<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#000000" />`;

  const reactCodeContent = `// Add this to your main component (like App.js)

function YourComponent() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    // This listens for when user can install the app
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
  };

  return (
    <div>
      {/* Show install button when ready */}
      {showInstallButton && (
        <button onClick={handleInstall}>
          📱 Install App
        </button>
      )}
    </div>
  );
}`;

  const serviceWorkerContent = `// This file (sw.js) makes your app work offline
// Put it in your "public" folder

const CACHE_NAME = 'hotel-app-v1';
// List pages to work offline
const urlsToCache = ['/', '/index.html', '/manifest.json'];

// When installing, save these pages
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// When loading a page, check cache first
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});`;

  const registerSWContent = `<script>
  // Add this at end of body in index.html
  
  // Check if browser supports service workers
  if ('serviceWorker' in navigator) {
    // Wait for page to load
    window.addEventListener('load', () => {
      // Register the service worker
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('Service Worker Registered'))
        .catch((error) => console.log('Error:', error));
    });
  }
</script>`;

  return (
    <div className="pwa-container">
      <div className="pwa-header">
        <div className="pwa-avatar">PWA</div>
        <div className="pwa-title">
          <h1>Make Your Website an App</h1>
          <p>Turn your website into a mobile app in 4 simple steps</p>
        </div>
      </div>

      <div className="pwa-main">
        {/* What is PWA Card */}
        <div className="pwa-card">
          <h3>🤔 What is a PWA?</h3>
          <p>
            <strong>PWA = Website that works like an app</strong>
          </p>
          <p style={{ fontSize: "0.95rem", color: "#666" }}>
            It's a website that users can{" "}
            <strong>install on their phone's home screen</strong>
            and use like a regular app - but you build it once as a website!
          </p>

          <div
            style={{
              background: "#f0f9ff",
              padding: "1rem",
              borderRadius: "8px",
              marginTop: "1rem",
            }}
          >
            <h4 style={{ marginTop: 0 }}>🎯 Why Bother?</h4>
            <ul style={{ marginBottom: 0 }}>
              <li>
                <strong>📱 No App Stores:</strong> Users install directly from
                browser
              </li>
              <li>
                <strong>⚡ Super Fast:</strong> Loads instantly
              </li>
              <li>
                <strong>📶 Works Offline:</strong> Like WhatsApp without
                internet
              </li>
              <li>
                <strong>🔄 Auto Updates:</strong> Users always get latest
                version
              </li>
            </ul>
          </div>
        </div>

        {/* Step 1: Manifest */}
        <div className="pwa-card">
          <h3>Step 1: Create manifest.json</h3>
          <p>
            This file tells phones how your app should look. Create it at:{" "}
            <br />
            <code>public/manifest.json</code>
          </p>

          <div className="pwa-code">
            <div style={{ position: "relative" }}>
              <button
                onClick={() => copyToClipboard(manifestContent, "manifest")}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: copiedCode === "manifest" ? "#10b981" : "#dc2626",
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
                {copiedCode === "manifest" ? "✓ Copied!" : "Copy Code"}
              </button>
              <pre>{manifestContent}</pre>
            </div>
          </div>

          <p style={{ fontSize: "0.9rem", color: "#666" }}>
            <strong>💡 What this does:</strong> Creates app icon, name, and
            colors for phone home screen
          </p>
        </div>

        {/* Step 2: HTML Setup */}
        <div className="pwa-card">
          <h3>Step 2: Add to HTML</h3>
          <p>
            Open <code>public/index.html</code> and add this inside the{" "}
            <code>&lt;head&gt;</code> section:
          </p>

          <div className="pwa-code">
            <div style={{ position: "relative" }}>
              <button
                onClick={() => copyToClipboard(htmlTagsContent, "html")}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: copiedCode === "html" ? "#10b981" : "#dc2626",
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
                {copiedCode === "html" ? "✓ Copied!" : "Copy Code"}
              </button>
              <pre>{htmlTagsContent}</pre>
            </div>
          </div>

          <p style={{ fontSize: "0.9rem", color: "#666" }}>
            <strong>📍 Location:</strong> Put it after{" "}
            <code>&lt;title&gt;</code> tag
          </p>
        </div>

        {/* Step 3: React Install Button */}
        <div className="pwa-card">
          <h3>Step 3: Add Install Button</h3>
          <p>Add this code to your main React component (like App.js):</p>

          <div className="pwa-code">
            <div style={{ position: "relative" }}>
              <button
                onClick={() => copyToClipboard(reactCodeContent, "react")}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: copiedCode === "react" ? "#10b981" : "#dc2626",
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
                {copiedCode === "react" ? "✓ Copied!" : "Copy Code"}
              </button>
              <pre>{reactCodeContent}</pre>
            </div>
          </div>

          {/* Live Install Button */}
          <div style={{ marginTop: "1.5rem" }}>
            <p>
              <strong>Try It Now:</strong> If you're on Chrome/Edge, you'll see
              this button:
            </p>
            {showInstallButton && (
              <button
                onClick={handleInstall}
                className="install-button"
                style={{
                  background: "#dc2626",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  marginTop: "10px",
                  width: "100%",
                }}
              >
                📱 Install This Page as App
              </button>
            )}
            {!showInstallButton && (
              <p
                style={{
                  background: "#f3f4f6",
                  padding: "1rem",
                  borderRadius: "6px",
                  fontSize: "0.9rem",
                }}
              >
                <strong>Note:</strong> Install button shows on Chrome/Edge when
                PWA is ready.
                <br />
                On phone, look for "Add to Home Screen" in browser menu (⋮).
              </p>
            )}
          </div>
        </div>

        {/* Step 4: Service Worker */}
        <div className="pwa-card">
          <h3>Step 4: Make It Work Offline</h3>
          <p>
            Create <code>public/sw.js</code> (service worker file):
          </p>

          <div className="pwa-code">
            <div style={{ position: "relative" }}>
              <button
                onClick={() => copyToClipboard(serviceWorkerContent, "sw")}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: copiedCode === "sw" ? "#10b981" : "#dc2626",
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
                {copiedCode === "sw" ? "✓ Copied!" : "Copy Code"}
              </button>
              <pre>{serviceWorkerContent}</pre>
            </div>
          </div>

          <p style={{ marginTop: "1.5rem" }}>
            <strong>Then activate it in index.html:</strong> Add this at the end
            of <code>&lt;body&gt;</code>
          </p>
          <div className="pwa-code">
            <div style={{ position: "relative" }}>
              <button
                onClick={() => copyToClipboard(registerSWContent, "register")}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: copiedCode === "register" ? "#10b981" : "#dc2626",
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
                {copiedCode === "register" ? "✓ Copied!" : "Copy Code"}
              </button>
              <pre>{registerSWContent}</pre>
            </div>
          </div>

          <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "1rem" }}>
            <strong>🎯 Service Worker = Magic that makes offline work</strong>
            <br />
            It saves pages so users can see them without internet
          </p>
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="pwa-summary">
        <h4>📋 Simple Checklist (Do in Order)</h4>
        <ul>
          <li>
            ✅ <strong>manifest.json</strong> - Create in public folder
          </li>
          <li>
            ✅ <strong>HTML tags</strong> - Add to index.html head section
          </li>
          <li>
            ✅ <strong>Install button</strong> - Add code to your React app
          </li>
          <li>
            ✅ <strong>sw.js</strong> - Create in public folder
          </li>
          <li>
            ✅ <strong>Register SW</strong> - Add script to index.html
          </li>
          <li>
            ✅ <strong>Test</strong> - Open in Chrome, click "Install"
          </li>
        </ul>

        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            background: "#f0f9ff",
            borderRadius: "8px",
            borderLeft: "4px solid #0ea5e9",
          }}
        >
          <h5 style={{ margin: "0 0 0.5rem 0", color: "#0369a1" }}>
            🚀 Quick Tips:
          </h5>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "#0c4a6e" }}>
            • Works on Chrome, Edge, Safari
            <br />
            • On iPhone: Use "Share → Add to Home Screen"
            <br />
            • Needs HTTPS (secure connection)
            <br />• Test after each step
          </p>
        </div>

        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            background: "#f0fdf4",
            borderRadius: "8px",
            borderLeft: "4px solid #10b981",
          }}
        >
          <h5 style={{ margin: "0 0 0.5rem 0", color: "#065f46" }}>
            🎉 You're Done!
          </h5>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "#064e3b" }}>
            After completing these 4 steps, users can install your website as an
            app! They'll get an app icon on their phone that opens your website
            in app mode.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PWA;
