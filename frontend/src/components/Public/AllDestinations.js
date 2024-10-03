// src/components/AllDestinations.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDestinations } from '../../api/api';

const AllDestinations = () => {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>All Destinations</h1>
            <ul>
                {destinations.map(destination => (
                    <li key={destination.id}>
                        <h2><Link to={`/destinations/${destination.id}/articles`}>{destination.name}</Link></h2>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AllDestinations;
