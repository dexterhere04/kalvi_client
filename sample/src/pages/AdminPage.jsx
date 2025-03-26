import { useState, useEffect } from "react";
import axios from "axios";

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [role, setRole] = useState("student");
    const [formData, setFormData] = useState({
        name: "",
        dob: "",
        user_name: "",
        password: "",
        qualification: "" // Only for teachers
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("/admin/users", {
                headers: { "X-API-KEY": "your_admin_api_key" }
            });
            setUsers(response.data.users || []);
        } catch (error) {
            console.error("Error fetching users", error);
            setUsers([]);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleChange = (selectedRole) => {
        setRole(selectedRole);
        // Reset form data when switching roles
        setFormData({
            name: "",
            dob: "",
            user_name: "",
            password: "",
            qualification: ""
        });
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            // Prepare data with role
            const userData = {
                ...formData,
                role: role
            };

            await axios.post("/add/user/", userData, {
                headers: { "X-API-KEY": "your_admin_api_key" }
            });
            fetchUsers();
            // Reset form after successful submission
            setFormData({
                name: "",
                dob: "",
                user_name: "",
                password: "",
                qualification: ""
            });
        } catch (error) {
            console.error("Error adding user", error);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await axios.post("/delete/user/", { user_id: userId }, {
                headers: { "X-API-KEY": "your_admin_api_key" }
            });
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user", error);
        }
    };

    return (
        <div className="min-h-screen bg-white text-gray-800 flex flex-col items-center py-10 px-4">
            <h2 className="text-4xl font-extrabold mb-8 text-center text-blue-700">Admin Dashboard</h2>
            
            {/* User List Section */}
            <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg border border-gray-200 mb-8">
                <div className="bg-blue-50 p-4 border-b border-gray-200">
                    <h3 className="text-2xl font-semibold text-blue-800">User List</h3>
                </div>
                {users.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {users.map((user) => (
                            <li 
                                key={user.id} 
                                className="flex justify-between items-center p-4 hover:bg-blue-50 transition-colors duration-200"
                            >
                                <div>
                                    <p className="font-medium text-gray-800">{user.name}</p>
                                    <p className="text-sm text-gray-500">@{user.user_name}</p>
                                </div>
                                <button 
                                    onClick={() => handleDeleteUser(user.id)} 
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500 p-4">No users available.</p>
                )}
            </div>
            
            {/* Add New User Section */}
            <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg border border-gray-200">
                <div className="bg-blue-50 p-4 border-b border-gray-200">
                    <h3 className="text-2xl font-semibold text-blue-800">Add New User</h3>
                </div>
                <form onSubmit={handleAddUser} className="p-6 space-y-4">
                    {/* Role Selection */}
                    <div className="flex justify-center space-x-4 mb-4">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="role"
                                value="student"
                                checked={role === "student"}
                                onChange={() => handleRoleChange("student")}
                                className="form-radio h-5 w-5 text-blue-600"
                            />
                            <span className="ml-2">Student</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="role"
                                value="faculty"
                                checked={role === "faculty"}
                                onChange={() => handleRoleChange("faculty")}
                                className="form-radio h-5 w-5 text-blue-600"
                            />
                            <span className="ml-2">Faculty</span>
                        </label>
                    </div>

                    {/* Name */}
                    <input 
                        type="text" 
                        name="name" 
                        placeholder="Name" 
                        required 
                        value={formData.name}
                        onChange={handleChange} 
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                    />

                    {/* Date of Birth */}
                    <input 
                        type="date" 
                        name="dob" 
                        required 
                        value={formData.dob}
                        onChange={handleChange} 
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                    />

                    {/* Qualification (Only for Faculty) */}
                    {role === "faculty" && (
                        <input 
                            type="text" 
                            name="qualification" 
                            placeholder="Qualification" 
                            required
                            value={formData.qualification}
                            onChange={handleChange} 
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                        />
                    )}

                    {/* Username */}
                    <input 
                        type="text" 
                        name="user_name" 
                        placeholder="Username" 
                        required 
                        value={formData.user_name}
                        onChange={handleChange} 
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                    />

                    {/* Password */}
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Password" 
                        required 
                        value={formData.password}
                        onChange={handleChange} 
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                    />

                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors duration-300 font-semibold"
                    >
                        Add {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminPage;