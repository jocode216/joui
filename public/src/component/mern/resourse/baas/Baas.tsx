import React, { useState, useEffect } from "react";
import "./baas.css";

// Type definitions
interface BaaSFeature {
  id: number;
  title: string;
  description: string;
  code: string;
}

interface SupabaseExample {
  id: number;
  title: string;
  code: string;
  explanation: string;
}

function Baas() {
  const [loading, setLoading] = useState<boolean>(false);
  const [examples, setExamples] = useState<SupabaseExample[]>([
    {
      id: 1,
      title: "Authentication Setup",
      code: `// Initialize Supabase client\nimport { createClient } from '@supabase/supabase-js';\n\nconst supabaseUrl = process.env.SUPABASE_URL;\nconst supabaseKey = process.env.SUPABASE_ANON_KEY;\n\nconst supabase = createClient(supabaseUrl, supabaseKey);\n\n// User Sign Up\nasync function signUp(email, password) {\n  const { user, error } = await supabase.auth.signUp({\n    email,\n    password,\n  });\n  return { user, error };\n}\n\n// User Login\nasync function signIn(email, password) {\n  const { user, error } = await supabase.auth.signIn({\n    email,\n    password,\n  });\n  return { user, error };\n}`,
      explanation:
        "Setting up authentication with email/password. Supabase handles JWT tokens, sessions, and user management automatically.",
    },
    {
      id: 2,
      title: "Database Operations (CRUD)",
      code: `// Create a new record\nasync function createGuest(guestData) {\n  const { data, error } = await supabase\n    .from('guests')\n    .insert([guestData])\n    .select();\n  return { data, error };\n}\n\n// Read records\nasync function getGuests() {\n  const { data, error } = await supabase\n    .from('guests')\n    .select('*')\n    .eq('status', 'active');\n  return { data, error };\n}\n\n// Update a record\nasync function updateGuest(id, updates) {\n  const { data, error } = await supabase\n    .from('guests')\n    .update(updates)\n    .eq('id', id);\n  return { data, error };\n}\n\n// Delete a record\nasync function deleteGuest(id) {\n  const { data, error } = await supabase\n    .from('guests')\n    .delete()\n    .eq('id', id);\n  return { data, error };\n}`,
      explanation:
        "Full CRUD operations with PostgreSQL. Supabase provides auto-generated APIs from your database schema.",
    },
  ]);

  const [baasFeatures, setBaasFeatures] = useState<BaaSFeature[]>([
    {
      id: 1,
      title: "Traditional vs BaaS - Authentication",
      description:
        "Traditional: Build your own auth system with JWT, sessions, password hashing. BaaS: Pre-built auth with multiple providers.",
      code: `// TRADITIONAL - Node.js + Express + JWT\nconst jwt = require('jsonwebtoken');\nconst bcrypt = require('bcrypt');\n\napp.post('/login', async (req, res) => {\n  // 1. Find user in database\n  // 2. Compare passwords with bcrypt\n  // 3. Generate JWT token\n  // 4. Set cookies or send token\n  // 5. Handle refresh tokens\n});\n\n// BaaS - Supabase (one line)\nconst { user, error } = await supabase.auth.signIn({\n  email,\n  password\n});`,
    },
    {
      id: 2,
      title: "Traditional vs BaaS - Database API",
      description:
        "Traditional: Build REST/GraphQL endpoints manually. BaaS: Auto-generated APIs with real-time subscriptions.",
      code: `// TRADITIONAL - Express Routes\napp.get('/api/guests', authMiddleware, async (req, res) => {\n  try {\n    const guests = await db.query('SELECT * FROM guests');\n    res.json(guests);\n  } catch (error) {\n    res.status(500).json({ error });\n  }\n});\n\n// BaaS - Supabase\nconst { data: guests, error } = await supabase\n  .from('guests')\n  .select('*');\n\n// REAL-TIME (BaaS Bonus)\nconst subscription = supabase\n  .from('guests')\n  .on('INSERT', payload => {\n    console.log('New guest:', payload.new);\n  })\n  .subscribe();`,
    },
    {
      id: 3,
      title: "Traditional vs BaaS - File Storage",
      description:
        "Traditional: Set up AWS S3, handle uploads, CDN, permissions. BaaS: Built-in storage with automatic CDN and permissions.",
      code: `// TRADITIONAL - AWS S3 Setup\nconst AWS = require('aws-sdk');\nconst s3 = new AWS.S3();\n\nasync function uploadToS3(file) {\n  const params = {\n    Bucket: 'my-bucket',\n    Key: file.name,\n    Body: file.data,\n    ACL: 'public-read'\n  };\n  return s3.upload(params).promise();\n}\n\n// BaaS - Supabase Storage\nasync function uploadToSupabase(file) {\n  const { data, error } = await supabase.storage\n    .from('room-photos')\n    .upload(file.name, file);\n  return { data, error };\n}\n\n// Get public URL automatically\nconst { publicURL } = supabase.storage\n  .from('room-photos')\n  .getPublicUrl('photo.jpg');`,
    },
    {
      id: 4,
      title: "Why Firebase? Why Supabase?",
      description:
        "Firebase (Google) started the BaaS revolution. Supabase is the open-source alternative with PostgreSQL power.",
      code: `// FIREBASE (Google) - Document Database\nimport { getFirestore, doc, setDoc } from 'firebase/firestore';\n\nconst db = getFirestore();\nawait setDoc(doc(db, 'guests', 'guest123'), {\n  name: 'John Doe',\n  email: 'john@example.com'\n});\n\n// SUPABASE (PostgreSQL) - Relational Database\nconst { data, error } = await supabase\n  .from('guests')\n  .insert([{\n    name: 'John Doe',\n    email: 'john@example.com'\n  }]);\n\n// Supabase gives you:\n// 1. Full PostgreSQL (SQL power)\n// 2. Real-time subscriptions\n// 3. Row Level Security (RLS)\n// 4. Auto-generated APIs\n// 5. Open Source`,
    },
    {
      id: 5,
      title: "PostgreSQL API - Row Level Security",
      description:
        "Database-level security policies that control who can access what data. Supabase automatically enforces these.",
      code: `-- In PostgreSQL (Supabase)\n-- Create a policy for guests table\nCREATE POLICY "Users can view own profile"\nON guests\nFOR SELECT\nUSING (auth.uid() = user_id);\n\n-- Create a policy for insert\nCREATE POLICY "Users can insert own data"\nON guests\nFOR INSERT\nWITH CHECK (auth.uid() = user_id);\n\n-- In your React app\n// This query automatically respects RLS\nconst { data: myProfile, error } = await supabase\n  .from('guests')\n  .select('*')\n  .eq('user_id', userId);\n\n// No need for manual permission checks!\n// Database handles security at the row level.`,
    },
    {
      id: 6,
      title: "JWT Tokens & Session Management",
      description:
        "Supabase handles token generation, refresh, and validation automatically with secure http-only cookies.",
      code: `// Supabase Auth Flow:\n// 1. User signs in\nconst { session, error } = await supabase.auth.signIn({\n  email: 'user@example.com',\n  password: 'password'\n});\n\n// 2. Supabase creates JWT token\n// Token contains: {\n//   "sub": "user-id",\n//   "email": "user@example.com",\n//   "role": "authenticated",\n//   "exp": 1234567890\n// }\n\n// 3. Token is stored in http-only cookie\n// 4. All future requests automatically include token\n\n// 5. Access current user\nconst { data: { user } } = await supabase.auth.getUser();\n\n// 6. Listen to auth state changes\nsupabase.auth.onAuthStateChange((event, session) => {\n  console.log(event, session);\n  // 'SIGNED_IN', 'SIGNED_OUT', 'TOKEN_REFRESHED'\n});`,
    },
    {
      id: 7,
      title: "Real-time Subscriptions",
      description:
        "Listen to database changes in real-time. Perfect for chat, notifications, live updates.",
      code: `// Subscribe to guest table inserts\nconst subscription = supabase\n  .channel('guests-channel')\n  .on(\n    'postgres_changes',\n    {\n      event: 'INSERT',\n      schema: 'public',\n      table: 'guests'\n    },\n    (payload) => {\n      console.log('New guest added:', payload.new);\n      // Update UI in real-time\n    }\n  )\n  .subscribe();\n\n// Subscribe to updates\nconst updateSubscription = supabase\n  .channel('updates-channel')\n  .on(\n    'postgres_changes',\n    {\n      event: 'UPDATE',\n      schema: 'public',\n      table: 'bookings'\n    },\n    (payload) => {\n      console.log('Booking updated:', payload.new);\n    }\n  )\n  .subscribe();\n\n// Cleanup\nreturn () => {\n  subscription.unsubscribe();\n  updateSubscription.unsubscribe();\n};`,
    },
    {
      id: 8,
      title: "Storage & File Management",
      description:
        "Upload, download, and manage files with built-in CDN, image transformations, and access control.",
      code: `// Upload a file\nconst file = event.target.files[0];\nconst { data, error } = await supabase.storage\n  .from('hotel-photos')  // Bucket name\n  .upload(\`room-\${Date.now()}\`, file);\n\n// Get public URL\nconst { publicURL } = supabase.storage\n  .from('hotel-photos')\n  .getPublicUrl('room-123.jpg');\n\n// List files in bucket\nconst { data: files, error } = await supabase.storage\n  .from('hotel-photos')\n  .list('rooms', {\n    limit: 100,\n    offset: 0,\n    sortBy: { column: 'name', order: 'asc' }\n  });\n\n// Download a file\nconst { data, error } = await supabase.storage\n  .from('hotel-photos')\n  .download('room-123.jpg');\n\n// Image transformations (resize, crop, format)\n// Append query parameters to URL\nconst optimizedURL = publicURL + '?width=300&height=200&quality=80';`,
    },
    {
      id: 9,
      title: "Edge Functions & Serverless",
      description:
        "Run serverless functions at the edge for custom business logic, APIs, and webhooks.",
      code: `// Supabase Edge Functions (TypeScript/JavaScript)\n// File: supabase/functions/process-booking/index.ts\n\nimport { serve } from 'https://deno.land/std@0.168.0/http/server.ts';\n\nconst corsHeaders = {\n  'Access-Control-Allow-Origin': '*',\n  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',\n};\n\nserve(async (req) => {\n  // Handle CORS\n  if (req.method === 'OPTIONS') {\n    return new Response('ok', { headers: corsHeaders });\n  }\n\n  try {\n    const { bookingId, amount, guestEmail } = await req.json();\n\n    // 1. Process payment (Stripe, etc.)\n    // 2. Send confirmation email\n    // 3. Update database\n    // 4. Return response\n\n    return new Response(\n      JSON.stringify({ \n        success: true, \n        message: 'Booking processed' \n      }),\n      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }\n    );\n  } catch (error) {\n    return new Response(\n      JSON.stringify({ error: error.message }),\n      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }\n    );\n  }\n});\n\n// Call from frontend\nconst { data, error } = await supabase.functions\n  .invoke('process-booking', {\n    body: { bookingId: '123', amount: 200, guestEmail: 'guest@example.com' }\n  });`,
    },
  ]);

  const fetchExamples = async (): Promise<void> => {
    setLoading(true);
    try {
      // Simulating API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // In a real app, you would fetch from Supabase here
      const newExample: SupabaseExample = {
        id: examples.length + 1,
        title: "Advanced Query with Joins",
        code: `// Complex hotel query with joins\nconst { data: bookings, error } = await supabase\n  .from('bookings')\n  .select(\`
    id,\n    check_in,\n    check_out,\n    total_amount,\n    guests!inner (\n      name,\n      email,\n      phone\n    ),\n    rooms!inner (\n      number,\n      type,\n      price_per_night\n    )\n  \`)\n  .gte('check_in', '2024-01-01')\n  .lte('check_out', '2024-01-31')\n  .order('check_in', { ascending: true })\n  .limit(10);\n\n// Returns:\n// {\n//   id: 1,\n//   check_in: '2024-01-15',\n//   check_out: '2024-01-20',\n//   total_amount: 750,\n//   guests: { name: 'John Doe', email: 'john@example.com', phone: '...' },\n//   rooms: { number: 101, type: 'Deluxe', price_per_night: 150 }\n// }`,
        explanation:
          "Complex queries with automatic joins between tables. Supabase converts PostgreSQL relationships into nested objects.",
      };

      setExamples((prev) => [newExample, ...prev.slice(0, 1)]);
    } catch (error) {
      console.error("Error fetching examples:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial data loading simulation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bascontainer">
      {/* Header Section */}
      <header className="basheader">
        <div className="basavatar">BS</div>
        <div className="bastitle">
          <h1>Backend as a Service (BaaS)</h1>
          <p>
            Learn how Supabase replaces traditional backend development with
            instant APIs, auth, and storage
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="basmain">
        {/* What is BaaS? */}
        <section className="bascard">
          <h3>1. What is Backend as a Service?</h3>
          <p>
            <strong>
              BaaS is cloud computing service that provides developers with
              ready-to-use backend infrastructure.
            </strong>
            <br />• <strong>Traditional:</strong> Build everything yourself -
            servers, databases, APIs, auth
            <br />• <strong>BaaS:</strong> Use pre-built, scalable services and
            focus on frontend
            <br />• <strong>Example:</strong> Firebase (Google), Supabase, AWS
            Amplify
          </p>
        </section>

        {/* Why BaaS Exists */}
        <section className="bascard">
          <h3>2. Why BaaS? The Developer Experience</h3>
          <p>
            <strong>
              Traditional backend development is complex and time-consuming.
            </strong>
            <br />• <strong>Setup Time:</strong> Weeks for infrastructure vs
            hours with BaaS
            <br />• <strong>Maintenance:</strong> 24/7 server monitoring vs
            automatic scaling
            <br />• <strong>Security:</strong> Your responsibility vs
            expert-managed
            <br />• <strong>Cost:</strong> Fixed server costs vs pay-per-use
          </p>
        </section>

        {/* Traditional vs BaaS */}
        <section className="bascard">
          <h3>3. Traditional vs BaaS - Authentication</h3>
          <p>
            <strong>
              Traditional auth requires 1000+ lines of code. BaaS auth is one
              function call.
            </strong>
          </p>
        </section>

        {/* Firebase vs Supabase */}
        <section className="bascard">
          <h3>4. Firebase vs Supabase - The Evolution</h3>
          <p>
            <strong>
              Firebase started BaaS. Supabase improved it with open-source and
              PostgreSQL.
            </strong>
            <br />• <strong>Firebase (2011):</strong> Google's BaaS, NoSQL
            (Firestore), popular for mobile apps
            <br />• <strong>Supabase (2020):</strong> Open-source Firebase
            alternative, PostgreSQL, SQL power
            <br />• <strong>Why switch?</strong> SQL NoSQL for most apps,
            open-source, better pricing
          </p>
        </section>

        {/* PostgreSQL API */}
        <section className="bascard">
          <h3>5. PostgreSQL + Auto-generated APIs</h3>
          <p>
            <strong>Define your database schema → Get instant REST APIs</strong>
            <br />• <strong>Tables become endpoints</strong> automatically
            <br />• <strong>Foreign keys become nested queries</strong>
            <br />• <strong>Row Level Security</strong> handles permissions
            <br />• <strong>Real-time</strong> subscriptions out of the box
          </p>
        </section>

        {/* Row Level Security */}
        <section className="bascard">
          <h3>6. Row Level Security (RLS)</h3>
          <p>
            <strong>
              Database-level security policies. Your data is secure even if API
              keys leak.
            </strong>
            <br />• <strong>Policies define</strong> who can read/write each row
            <br />• <strong>Enforced in PostgreSQL</strong>, not application
            code
            <br />• <strong>Prevents data leaks</strong> at database level
          </p>
        </section>

        {/* JWT Tokens */}
        <section className="bascard">
          <h3>7. JWT Tokens & Session Management</h3>
          <p>
            <strong>
              Supabase handles tokens automatically. No manual JWT management
              needed.
            </strong>
            <br />• <strong>Auto-generated JWT</strong> on login
            <br />• <strong>Auto-refreshed</strong> before expiry
            <br />• <strong>Http-only cookies</strong> for security
            <br />• <strong>Session state</strong> managed automatically
          </p>
        </section>

        {/* Storage */}
        <section className="bascard">
          <h3>8. File Storage (Like AWS S3)</h3>
          <p>
            <strong>
              Upload, manage, and serve files with built-in CDN and image
              optimizations.
            </strong>
            <br />• <strong>Buckets</strong> for organization
            <br />• <strong>CDN</strong> for fast delivery worldwide
            <br />• <strong>Image transformations</strong> (resize, crop,
            format)
            <br />• <strong>Access control</strong> with RLS policies
          </p>
        </section>

        {/* Real-time */}
        <section className="bascard">
          <h3>9. Real-time Subscriptions</h3>
          <p>
            <strong>
              Listen to database changes in real-time. Perfect for chat,
              notifications, live dashboards.
            </strong>
            <br />• <strong>WebSocket connections</strong> to PostgreSQL
            <br />• <strong>Filter by events:</strong> INSERT, UPDATE, DELETE
            <br />• <strong>Filter by data:</strong> Specific rows or conditions
            <br />• <strong>Automatic reconnection</strong> and error handling
          </p>

          {/* Live Supabase Examples */}
          <div className="basquotes">
            <h4>Live Supabase Examples:</h4>
            {loading ? (
              <p className="basloading">Loading examples...</p>
            ) : (
              <ul className="basquotesList">
                {examples.map((example) => (
                  <li key={example.id} className="basquoteItem">
                    <strong>{example.title}:</strong> {example.explanation}
                  </li>
                ))}
              </ul>
            )}
            <button
              className="basrefreshButton"
              onClick={fetchExamples}
              disabled={loading}
              type="button"
            >
              {loading ? "Loading..." : "Load More Examples"}
            </button>
          </div>
        </section>
      </main>

      {/* Summary Section */}
      <footer className="bassummary">
        <h4>Key Takeaways - Why Use Supabase (BaaS)</h4>
        <ul>
          <li>
            <strong>Speed:</strong> Go from idea to production in days, not
            weeks
          </li>
          <li>
            <strong>PostgreSQL:</strong> Full SQL power with auto-generated REST
            APIs
          </li>
          <li>
            <strong>Authentication:</strong> Built-in auth with multiple
            providers (email, social)
          </li>
          <li>
            <strong>Real-time:</strong> Live database subscriptions out of the
            box
          </li>
          <li>
            <strong>Storage:</strong> File uploads with CDN and image
            transformations
          </li>
          <li>
            <strong>Security:</strong> Row Level Security at database level
          </li>
          <li>
            <strong>Serverless:</strong> Edge functions for custom business
            logic
          </li>
          <li>
            <strong>Open Source:</strong> No vendor lock-in, self-host option
            available
          </li>
          <li>
            <strong>Cost Effective:</strong> Free tier, then pay only for what
            you use
          </li>
          <li>
            <strong>Focus:</strong> Spend time on your app, not infrastructure
          </li>
        </ul>
      </footer>
    </div>
  );
}

export default Baas;
