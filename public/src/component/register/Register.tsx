import React, { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import "./register.css";

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Fixed course ID - replace 1 with your actual course ID
  const fixedCourseId = 1;
  // Fixed receipt ID
  const fixedReceiptId = "f6739963";

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.phone
    ) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        receipt: `https://apps.cbe.com.et:100/?id=${fixedReceiptId}`,
        course_id: fixedCourseId, // Using fixed course ID
      };

      const res = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.msg || "Registration failed");
        return;
      }

      if (data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      navigate("/waittoaprove");
    } catch (err) {
      setError("Server error, try again later.");
      console.log(err)
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Register for a Course</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? (
            <>
              <ScaleLoader
                color="#ffffff"
                height={15}
                width={2}
                radius={1}
                margin={1}
              />
              Registering...
            </>
          ) : (
            "Register"
          )}
        </button>
        <p>
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
