import React, { useState } from 'react';
import { createDestination } from '../../api/api';
import { useNavigate } from 'react-router-dom';

const CreateDestination = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createDestination({ name, description });
            navigate('/destinations');
        } catch (error) {
            console.error('Error creating destination:', error);
        }
    };

    return (
        <div>
            <h1>Create Destination</h1>
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
                <button type="submit">Create</button>
            </form>
        </div>
    );
};

export default CreateDestination;
