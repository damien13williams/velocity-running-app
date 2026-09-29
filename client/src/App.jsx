import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("Loading users...");

  useEffect(() => {
    fetch("http://localhost:5008/api/users")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        return response.json();
      })
      .then((data) => {
        setUsers(data);
        setMessage("Backend connected successfully");
      })
      .catch((error) => {
        console.error(error);
        setMessage("Could not connect to backend");
      });
  }, []);

  return (
    <div className="app">
      <h1>Velocity</h1>

      <p>Running Team Management Platform</p>

      <h2>Backend Connection</h2>

      <p>{message}</p>

      <h2>Users</h2>

      {users.map((user) => (
        <div key={user.id} className="user-card">
          <h3>
            {user.firstName} {user.lastName}
          </h3>

          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </div>
      ))}
    </div>
  );
}

export default App;