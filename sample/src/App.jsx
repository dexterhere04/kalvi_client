import { useState } from "react";
import "./App.css";
import Login from "./components/Login";

function App() {
    const [role, setRole] = useState(localStorage.getItem("role") || null);

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setRole(null);
    };

    return (
        <div>
            {role ? (
                <>
                    <h1>Welcome, {role}!</h1>
                    <button onClick={handleLogout}>Logout</button> {/* ✅ Added Logout Button */}
                </>
            ) : (
                <Login onLogin={setRole} />
            )}
        </div>
    );
}

export default App;
