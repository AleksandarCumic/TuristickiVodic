import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDestinations, deleteDestination } from '../../api/api';

const Destinations = () => {
    const [destinations, setDestinations] = useState([]);
    const isLoggedIn = !!localStorage.getItem('token');
    const role = localStorage.getItem('role');

    useEffect(() => {
        const fetchDestinations = async () => {
            const result = await getDestinations();
            setDestinations(result);
        };
        fetchDestinations();
    }, []);

    const handleDelete = async (id) => {
        await deleteDestination(id);
        setDestinations(destinations.filter(destination => destination.id !== id));
    };

    return (
        <div>
            <h1>Destinations</h1>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    {isLoggedIn && (role === 'admin' || role === 'editor') && <th>Actions</th>}
                </tr>
                </thead>
                <tbody>
                {destinations.map(destination => (
                    <tr key={destination.id}>
                        <td>
                            <Link to={`/destinations/${destination.id}`}>{destination.name}</Link>
                        </td>
                        <td>{destination.description}</td>
                        {isLoggedIn && (role === 'admin' || role === 'editor') && (
                            <td>
                                <button onClick={() => handleDelete(destination.id)}>Delete</button>
                                <Link to={`/destinations/edit/${destination.id}`}>Edit</Link>
                            </td>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
            {isLoggedIn && (role === 'admin' || role === 'editor') && (
                <Link to="/destinations/create">Add Destination</Link>
            )}
        </div>
    );
};

export default Destinations;
