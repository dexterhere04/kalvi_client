import { useState, useEffect } from "react";
import axios from "axios";

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [role, setRole] = useState("student");
    const [formData, setFormData] = useState({
        fullname: "",
        dob: "",
        username: "",
        password: "",
        qualification: "",
        semester: "",
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    // Fetch user list from the backend
    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:5000/admin/users", {
                headers: { "X-API-KEY": localStorage.getItem("token") },
            });

            const formattedUsers = response.data.users.map(userArray => ({
                id: userArray[0],
                fullname: userArray[1],
                username: userArray[2],
                role: userArray[3],
                dob: userArray[4]
            }));

            setUsers(formattedUsers || []);
        } catch (error) {
            console.error("Error fetching users:", error.response?.data || error.message);
            setUsers([]);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleChange = (selectedRole) => {
        setRole(selectedRole);
        setFormData({
            fullname: "",
            dob: "",
            username: "",
            password: "",
            qualification: "",
            semester: "",
        });
    };

    const generatePassword = () => {
        const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        let newPassword = "";
        for (let i = 0; i < 12; i++) {
            newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        setFormData({ ...formData, password: newPassword });
    };

    // Add new user to the database
    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const userData = {
                fullname: formData.fullname.trim(),
                dob: formData.dob,
                username: formData.username.trim(),
                password: formData.password.trim(),
                qualification: role === "faculty" ? formData.qualification.trim() : "student",
                semester: role === "student" ? formData.semester.trim() : "teacher",
                role,
            };

            await axios.post("http://127.0.0.1:5000/add/user/", userData, {
                headers: { "X-API-KEY": localStorage.getItem("token") },
            });

            fetchUsers();
            setFormData({
                fullname: "",
                dob: "",
                username: "",
                password: "",
                qualification: "",
                semester: "",
            });
        } catch (error) {
            console.error("Error adding user:", error.response?.data || error.message);
        }
    };

    // Delete user from the database
    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await axios.post("http://127.0.0.1:5000/delete/user/", { user_id: selectedUser }, {
                headers: { "X-API-KEY": localStorage.getItem("token") },
            });

            fetchUsers();
            setSelectedUser("");
        } catch (error) {
            console.error("Error deleting user:", error.response?.data || error.message);
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
                        {users.map((user, index) => (
                            <li key={user.id || user.username || index} className="flex justify-between items-center p-4 hover:bg-blue-50">
                                <div>
                                    <p className="font-medium text-gray-800">{user.fullname}</p>
                                    <p className="text-sm text-gray-500">@{user.username}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500 p-4">No users available.</p>
                )}
            </div>

            {/* Add User Section */}
            <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg border border-gray-200 mb-8">
                <div className="bg-blue-50 p-4 border-b border-gray-200">
                    <h3 className="text-2xl font-semibold text-blue-800">Add New User</h3>
                </div>
                <form onSubmit={handleAddUser} className="p-6 space-y-4">
                    {/* Role Selection */}
                    <div className="flex justify-center space-x-4 mb-4">
                        <label className="inline-flex items-center">
                            <input type="radio" name="role" value="student" checked={role === "student"} onChange={() => handleRoleChange("student")} className="form-radio h-5 w-5 text-blue-600" />
                            <span className="ml-2">Student</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input type="radio" name="role" value="faculty" checked={role === "faculty"} onChange={() => handleRoleChange("faculty")} className="form-radio h-5 w-5 text-blue-600" />
                            <span className="ml-2">Faculty</span>
                        </label>
                    </div>

                    {/* User Input Fields */}
                    <input type="text" name="fullname" placeholder="Full Name" required value={formData.fullname} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" />
                    <input type="date" name="dob" required value={formData.dob} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" />
                    {role === "faculty" && <input type="text" name="qualification" placeholder="Qualification" required value={formData.qualification} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" />}
                    {role === "student" && <input type="text" name="semester" placeholder="Semester" required value={formData.semester} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" />}
                    <input type="text" name="username" placeholder="Username" required value={formData.username} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" />

                    {/* Password Input */}
                    <div className="flex space-x-2">
                        <input type="password" name="password" placeholder="Password" required value={formData.password} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" />
                        <button type="button" onClick={generatePassword} className="px-4 py-3 bg-gray-300 text-gray-700 rounded-md">🔄</button>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md">Add {role}</button>
                </form>
            </div>

            {/* Delete User Section */}
            <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg border border-gray-200">
                <div className="bg-red-50 p-4 border-b border-gray-200">
                    <h3 className="text-2xl font-semibold text-red-800">Delete User</h3>
                </div>
                <div className="p-6">
                    <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md">
                        <option value="">Select user to delete</option>
                        {users.map(user => <option key={user.id} value={user.id}>{user.fullname} (@{user.username})</option>)}
                    </select>
                    <button onClick={handleDeleteUser} className="w-full mt-4 bg-red-600 text-white py-3 rounded-md hover:bg-red-700">Delete User</button>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
