// src/components/ManageDestinations.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDestinations, createDestination, updateDestination, deleteDestination } from '../../api/api';

const ManageDestinations = () => {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newDestination, setNewDestination] = useState({ name: '', description: '' });
    const [editDestination, setEditDestination] = useState(null);

    useEffect(() => {
        async function fetchDestinations() {
            try {
                const data = await getDestinations();
                setDestinations(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchDestinations();
    }, []);

    const handleAddDestination = async () => {
        if (destinations.some(dest => dest.name === newDestination.name)) {
            setError('Destination with this name already exists.');
            return;
        }
        try {
            const addedDestination = await createDestination(newDestination);
            setDestinations([...destinations, addedDestination]);
            setNewDestination({ name: '', description: '' });
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpdateDestination = async (id, updatedDestination) => {
        if (destinations.some(dest => dest.name === updatedDestination.name && dest.id !== id)) {
            setError('Destination with this name already exists.');
            return;
        }
        try {
            const updatedDest = await updateDestination(id, updatedDestination);
            setDestinations(destinations.map(dest => (dest.id === id ? updatedDest : dest)));
            setEditDestination(null);
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteDestination = async (id) => {
        try {
            await deleteDestination(id);
            setDestinations(destinations.filter(dest => dest.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Manage Destinations</h1>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {destinations.map(destination => (
                    <tr key={destination.id}>
                        <td>
                            <Link to={`/destination/${destination.id}`}>{destination.name}</Link>
                        </td>
                        <td>{destination.description}</td>
                        <td>
                            <button onClick={() => setEditDestination(destination)}>Edit</button>
                            <button onClick={() => handleDeleteDestination(destination.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <h2>{editDestination ? 'Edit Destination' : 'Add New Destination'}</h2>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    if (editDestination) {
                        handleUpdateDestination(editDestination.id, newDestination);
                    } else {
                        handleAddDestination();
                    }
                }}
            >
                <input
                    type="text"
                    value={newDestination.name}
                    onChange={e => setNewDestination({ ...newDestination, name: e.target.value })}
                    placeholder="Name"
                    required
                />
                <input
                    type="text"
                    value={newDestination.description}
                    onChange={e => setNewDestination({ ...newDestination, description: e.target.value })}
                    placeholder="Description"
                    required
                />
                <button type="submit">{editDestination ? 'Update' : 'Add'}</button>
            </form>
        </div>
    );
};

export default ManageDestinations;
