import React, { useState, useEffect } from 'react';
import { getDestination, updateDestination } from '../../api/api';
import { useParams, useNavigate } from 'react-router-dom';

const EditDestination = () => {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getDestination(id);
                setName(data.name);
                setDescription(data.description);
            } catch (error) {
                console.error('Error fetching destination:', error);
            }
        }
        fetchData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateDestination(id, { name, description });
            navigate('/destinations');
        } catch (error) {
            console.error('Error updating destination:', error);
        }
    };

    return (
        <div>
            <h1>Edit Destination</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    required
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    required
                />
                <button type="submit">Update</button>
            </form>
        </div>
    );
};

export default EditDestination;
