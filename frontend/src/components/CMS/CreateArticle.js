// src/components/CreateArticle.js

import React, { useState, useEffect } from 'react';
import { createArticle, getDestinations } from '../../api/api';
import { useNavigate } from 'react-router-dom';

const CreateArticle = () => {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [destinationId, setDestinationId] = useState('');
    const [activities, setActivities] = useState('');
    const [destinations, setDestinations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            const fetchedDestinations = await getDestinations();
            setDestinations(fetchedDestinations);
        }
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const currentDate = new Date().toISOString().split('T')[0]; // Dobijanje samo datuma u formatu YYYY-MM-DD

        const article = {
            title,
            text,
            destination_id: parseInt(destinationId, 10),
            activities: activities.split(',').map(activity => ({ name: activity.trim() })),
            createdAt: currentDate // Dodajemo trenutno vreme
        };
        try {
            const createdArticle = await createArticle(article);
            console.log('Article created:', createdArticle);
            navigate('/articles');
        } catch (error) {
            console.error('Error creating article:', error);
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                required
            />
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Text"
                required
            />
            <select
                value={destinationId}
                onChange={(e) => setDestinationId(e.target.value)}
                required
            >
                <option value="">Select Destination</option>
                {destinations.map((destination) => (
                    <option key={destination.id} value={destination.id}>
                        {destination.name}
                    </option>
                ))}
            </select>
            <input
                type="text"
                value={activities}
                onChange={(e) => setActivities(e.target.value)}
                placeholder="Activities (comma separated)"
                required
            />
            <button type="submit">Create Article</button>
        </form>
    );
};

export default CreateArticle;
