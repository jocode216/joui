import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./register.css";

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    image: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/getuser/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "User not found");
        setUser(data.user || {});
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`http://localhost:3000/api/edituser/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update user");

      navigate("/"); // redirect after success
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading user...</p>;

  return (
    <div className="register-container">
      <h2>Edit User</h2>
      {error && <p className="error">{error}</p>}

      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={user.name || ""}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="email"
          name="email"
          value={user.email || ""}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="text"
          name="phone"
          value={user.phone || ""}
          onChange={handleChange}
          placeholder="Phone"
          required
        />
        <input
          type="text"
          name="image"
          value={user.image || ""}
          onChange={handleChange}
          placeholder="Image URL"
        />



        <button type="submit">Update User</button>
      </form>
    </div>
  );
}

export default EditUser;  