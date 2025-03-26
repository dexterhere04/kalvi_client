import { useState } from "react";
import "./App.css";
import Login from "./components/Login";
import AdminPage from "./pages/AdminPage";
import FacultyPage from "./pages/FacultyPage";
import StudentPage from "./pages/StudentPage";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function App() {
    const [role, setRole] = useState(localStorage.getItem("role") || null);

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setRole(null);
    };

    return (
        <Router>
            <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
                {role ? (
                    <div className="flex flex-col">
                        <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-blue-700">
                                {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
                            </h1>
                            <button 
                                onClick={handleLogout} 
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                            >
                                Logout
                            </button>
                        </header>

                        <main className="flex-grow p-6">
                            <Routes>
                                {role === "admin" && <Route path="/" element={<AdminPage />} />}
                                {role === "faculty" && <Route path="/" element={<FacultyPage />} />}
                                {role === "student" && <Route path="/" element={<StudentPage />} />}
                                <Route path="*" element={<Navigate to="/" />} />
                            </Routes>
                        </main>
                    </div>
                ) : (
                    <Login onLogin={setRole} />
                )}
            </div>
        </Router>
    );
}

export default App;