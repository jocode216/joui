import React, { useEffect, useState } from "react";
import ApprovedBlog from "../blog/ApprovedBlog";
import Details from "../../Enrollement/details/Details";

import { ScaleLoader } from "react-spinners";
const Aauthenthicatiions: React.FC = () => {
  const [isApproved, setIsApproved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    let currentUser: any = {};
    
    if (userStr && userStr !== "undefined") {
      try {
        currentUser = JSON.parse(userStr);
      } catch (e) {
        console.error("Failed to parse user data", e);
        localStorage.removeItem("user");
      }
    }

    if (currentUser?.role === "approved") setIsApproved(true);
    else setIsApproved(false);
    setLoading(false);
  }, []);

  if (loading) return <p style={{ textAlign: "center", padding: "50px" }}>
          <ScaleLoader
            color="red"
            height={40}
            width={6}
            radius={2}
            margin={4}
          /></p>;

  return <div>{isApproved ? <ApprovedBlog /> : <Details />}</div>;
};

export default Aauthenthicatiions;
