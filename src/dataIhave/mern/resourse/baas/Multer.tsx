import React from "react";
import "./baas.css";

function MulterDocs() {
  return (
    <div className="bascontainer">
      <header className="basheader">
        <div className="basavatar">MU</div>
        <div className="bastitle">
          <h1>Multer File Uploads</h1>
          <p>Node.js middleware for handling file uploads from HTML forms</p>
        </div>
      </header>

      <main className="basmain">
        {/* What is Multer */}
        <section className="bascard">
          <h3>What is Multer?</h3>
          <p>
            Multer is a Node.js middleware that handles multipart/form-data,
            which is primarily used for uploading files.
          </p>
          <p>
            When an HTML form submits files, it sends data in
            "multipart/form-data" format which regular Express middleware (like
            express.json()) cannot parse. Multer specifically handles this
            format.
          </p>
        </section>

        {/* Problem it Solves */}
        <section className="bascard">
          <h3>Problem Multer Solves</h3>
          <p>Without Multer, parsing file uploads requires:</p>
          <div className="bascode">
            <pre>{`// Manual parsing needed:
1. Parse multipart boundaries
2. Extract file data from request stream
3. Handle encoding and decoding
4. Save files to disk
5. Handle errors and edge cases

// This would be 100+ lines of complex code`}</pre>
          </div>
          <p>
            With Multer, it's just a middleware function that does all this
            automatically.
          </p>
        </section>

        {/* Why Not Store Files Directly in Database */}
        <section className="bascard">
          <h3>Why Not Store Files in Database?</h3>
          <p>
            <strong>
              Servers are designed for text/number storage, not media files.
            </strong>
          </p>
          <p>Storing files in database causes:</p>
          <ul>
            <li>Database size grows exponentially</li>
            <li>Slow backups and queries</li>
            <li>Hosting companies ban servers storing media files</li>
            <li>No CDN for fast delivery worldwide</li>
          </ul>
        </section>

        {/* Our Approach: Store Locally */}
        <section className="bascard">
          <h3>Our Approach: Local Storage (Development Only)</h3>
          <p>For learning purposes, we'll:</p>
          <ol>
            <li>Store files locally in "uploads/" folder</li>
            <li>Save only the file path in database</li>
            <li>Serve files as static content</li>
            <li>Display using stored path</li>
          </ol>
          <p>
            <strong>Note:</strong> This approach works for local development but
            fails in production.
          </p>
        </section>

        {/* Step 1: Install */}
        <section className="bascard">
          <h3>Step 1: Install Multer</h3>
          <div className="bascode">
            <pre>npm install multer</pre>
          </div>
        </section>

        {/* Step 2: Import */}
        <section className="bascard">
          <h3>Step 2: Import Required Modules</h3>
          <div className="bascode">
            <pre>{`const multer = require("multer");
const path = require("path");`}</pre>
          </div>
        </section>

        {/* Step 3: Configure Storage */}
        <section className="bascard">
          <h3>Step 3: Configure Storage</h3>
          <div className="bascode">
            <pre>{`const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + 
      Math.round(Math.random() * 1e9) + 
      path.extname(file.originalname);
    cb(null, uniqueName);
  }
});`}</pre>
          </div>
          <p>
            <strong>destination:</strong> Where to save files (folder must
            exist)
          </p>
          <p>
            <strong>filename:</strong> Creates unique filename to prevent
            overwriting
          </p>
        </section>

        {/* Step 4: Initialize */}
        <section className="bascard">
          <h3>Step 4: Initialize Multer</h3>
          <div className="bascode">
            <pre>{`const upload = multer({ storage });`}</pre>
          </div>
        </section>

        {/* Step 5: Serve Static Files */}
        <section className="bascard">
          <h3>Step 5: Serve Files Statically</h3>
          <div className="bascode">
            <pre>{`app.use("/uploads", express.static("uploads"));`}</pre>
          </div>
          <p>
            This makes files in "uploads" folder accessible at
            http://localhost:3000/uploads/filename.jpg
          </p>
        </section>

        {/* Step 6: Create Upload Route */}
        <section className="bascard">
          <h3>Step 6: Create Upload Route</h3>
          <div className="bascode">
            <pre>{`app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.json({ error: "No file uploaded" });
  }

  const imagePath = \`/uploads/\${req.file.filename}\`;
  
  db.query(
    "INSERT INTO images (image_path) VALUES (?)",
    [imagePath]
  );

  res.json({ 
    message: "File uploaded", 
    path: imagePath 
  });
});`}</pre>
          </div>
          <p>
            <strong>upload.single("image"):</strong> "image" matches the name
            attribute in your HTML form file input
          </p>
        </section>

        {/* Step 7: Display Image */}
        <section className="bascard">
          <h3>Step 7: Display Uploaded Image</h3>
          <div className="bascode">
            <pre>{`<img src="http://localhost:3000/uploads/filename.jpg" />`}</pre>
          </div>
        </section>

        {/* Production Warning */}
        <section className="bascard">
          <h3>Important: Production Limitation</h3>
          <p>
            <strong>
              This local storage approach fails in production because:
            </strong>
          </p>
          <ul>
            <li>Server restart deletes all uploaded files</li>
            <li>Multiple servers cannot share files</li>
            <li>No backup system for user files</li>
            <li>Hosting companies ban media file storage on web servers</li>
            <li>No CDN for fast global delivery</li>
          </ul>
          <p>
            <strong>Production solution:</strong> Cloud storage services (AWS
            S3, Firebase Storage, Supabase Storage)
          </p>
        </section>
      </main>

      <footer className="bassummary">
        <h4>Multer Summary</h4>
        <ul>
          <li>
            <strong>Multer</strong> parses multipart/form-data for file uploads
          </li>
          <li>
            Configure <strong>diskStorage</strong> with destination and filename
          </li>
          <li>
            Initialize with <strong>multer({`{ storage }`})</strong>
          </li>
          <li>
            Use <strong>upload.single()</strong> or{" "}
            <strong>upload.array()</strong> in routes
          </li>
          <li>
            Access uploaded file in <strong>req.file</strong>
          </li>
          <li>
            Store only <strong>file path</strong> in database, not the actual
            file
          </li>
          <li>
            Serve files with <strong>express.static()</strong>
          </li>
          <li>
            <strong>Local storage works for development only</strong>
          </li>
        </ul>
      </footer>
    </div>
  );
}

export default MulterDocs;
