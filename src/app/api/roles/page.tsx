import { useEffect, useState } from "react";

export default function Dashboard() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    setRole(userRole);
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {role === "admin" && <p>Welcome, Admin! You have full access.</p>}
      {role === "user" && <p>Welcome, User! Limited access.</p>}
      {!role && <p>Loading...</p>}
    </div>
  );
}
