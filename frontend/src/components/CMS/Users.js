import React, { useState, useEffect } from 'react';
import { getUsers, createUser, deleteUser } from '../../api/api';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ firstName: '', lastName: '', email: '', userType: '', password: '', confirmPassword: '' });

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getUsers();
                console.log('Fetched users:', data); // Log fetched users
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }
        fetchData();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (newUser.password === newUser.confirmPassword) {
            try {
                console.log('Creating user:', newUser); // Log user being created
                await createUser(newUser);
                const data = await getUsers();
                setUsers(data);
                setNewUser({ firstName: '', lastName: '', email: '', userType: '', password: '', confirmPassword: '' });
            } catch (error) {
                console.error('Error creating user:', error);
            }
        } else {
            alert("Passwords do not match");
        }

        const data = await getUsers();
        setUsers(data);

        const emailExists = data.some(user => user.email === newUser.email);
        if (emailExists) {
            alert("Email already exists.");
        }

    };

    const handleDelete = async (id) => {
        try {
            console.log('Deleting user with ID:', id); // Log user being deleted
            await deleteUser(id);
            setUsers(users.filter(user => user.id !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div>
            <h1>Users</h1>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>User Type</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.firstName} {user.lastName}</td>
                        <td>{user.email}</td>
                        <td>{user.userType}</td>
                        <td>
                            <button onClick={() => handleDelete(user.id)}>Delete</button>
                            {/* Add action buttons for edit and activate/deactivate if needed */}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div>
                <h2>Create New User</h2>
                <form onSubmit={handleCreate}>
                    <input
                        type="text"
                        value={newUser.firstName}
                        onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                        placeholder="First Name"
                        required
                    />
                    <input
                        type="text"
                        value={newUser.lastName}
                        onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                        placeholder="Last Name"
                        required
                    />
                    <input
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        placeholder="Email"
                        required
                    />
                    <select
                        value={newUser.userType}
                        onChange={(e) => setNewUser({ ...newUser, userType: e.target.value })}
                        required
                    >
                        <option value="">Select User Type</option>
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                    </select>
                    <input
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        placeholder="Password"
                        required
                    />
                    <input
                        type="password"
                        value={newUser.confirmPassword}
                        onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                        placeholder="Confirm Password"
                        required
                    />
                    <button type="submit">Create User</button>
                </form>
            </div>
        </div>
    );
};

export default Users;
