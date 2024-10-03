// src/components/EditArticle.js

import React, { useState, useEffect } from 'react';
import { updateArticle, getArticle, getDestinations } from '../../api/api';
import { useNavigate, useParams } from 'react-router-dom';

const EditArticle = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [destinationId, setDestinationId] = useState('');
    const [activities, setActivities] = useState('');
    const [destinations, setDestinations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const article = await getArticle(id);
                setTitle(article.title);
                setText(article.text);
                setDestinationId(article.destination_id);
                setActivities(article.activities.map(activity => activity.name).join(', '));

                const fetchedDestinations = await getDestinations();
                setDestinations(fetchedDestinations);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedArticle = {
                title,
                text,
                destination_id: destinationId,
                activities: activities.split(',').map(activity => ({ name: activity.trim() })),
                createdAt: new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date()) // Formatiranje datuma u "MMM d, yyyy"
            };
            await updateArticle(id, updatedArticle);
            navigate('/articles');
        } catch (error) {
            console.error('Error updating article:', error);
        }
    };

    return (
        <div className="edit-article">
            <h2>Edit Article</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Text</label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Destination</label>
                    <select
                        value={destinationId}
                        onChange={(e) => setDestinationId(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select destination</option>
                        {destinations.map(destination => (
                            <option key={destination.id} value={destination.id}>
                                {destination.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Activities (comma separated)</label>
                    <input
                        type="text"
                        value={activities}
                        onChange={(e) => setActivities(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Update</button>
            </form>
        </div>
    );
};

export default EditArticle;
