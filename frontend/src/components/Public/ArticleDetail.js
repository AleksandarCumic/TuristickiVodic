// src/components/ArticleDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getArticle, createComment } from '../../api/api';

const ArticleDetail = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [newComment, setNewComment] = useState({ author: '', text: '' });

    useEffect(() => {
        async function fetchArticle() {
            const data = await getArticle(id);
            setArticle(data);
        }
        fetchArticle();
    }, [id]);

    const handleCommentChange = (e) => {
        const { name, value } = e.target;
        setNewComment({ ...newComment, [name]: value });
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        const currentDate = new Date().toISOString().split('T')[0]; // Dobijanje samo datuma u formatu YYYY-MM-DD

        const comment = {
            ...newComment,
            createdAt: currentDate // Dodajemo trenutno vreme
        };

        try {
            const response = await createComment(id, comment);
            console.log("Response from server:", response);

            const data = await getArticle(id);
            setArticle(data);
            setNewComment({ author: '', text: '' });
        } catch (error) {
            console.error("Error submitting comment:", error);
        }
    };

    if (!article) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{article.title}</h1>
            <p>{article.text}</p>
            <p>Author: {article.author ? `${article.author.firstName} ${article.author.lastName}` : 'Unknown'}</p>
            <p>Created At: {new Date(article.createdAt).toLocaleString()}</p>
            <p>Visits: {article.visits}</p>
            <p>Destination: {article.destination ? article.destination.name : 'Unknown'}</p>
            <h2>Activities</h2>
            <ul>
                {article.activities.map(activity => (
                    <li key={activity.id}>
                        <a href={`/activities/${activity.id}`}>{activity.name}</a>
                    </li>
                ))}
            </ul>
            <h2>Comments</h2>
            <ul>
                {article.comments.map(comment => (
                    <li key={comment.id}>
                        <p>{comment.text}</p>
                        <p>By: {comment.author} on {new Date(comment.createdAt).toLocaleDateString()}</p>
                    </li>
                ))}
            </ul>
            <h2>Add a Comment</h2>
            <form onSubmit={handleCommentSubmit}>
                <input
                    type="text"
                    name="author"
                    value={newComment.author}
                    onChange={handleCommentChange}
                    placeholder="Your name"
                    required
                />
                <textarea
                    name="text"
                    value={newComment.text}
                    onChange={handleCommentChange}
                    placeholder="Your comment"
                    required
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default ArticleDetail;
