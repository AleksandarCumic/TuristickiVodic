import React, { useEffect, useState } from 'react';
import { getArticles, deleteArticle } from '../../api/api';
import { Link } from 'react-router-dom';

const Articles = () => {
    const [articles, setArticles] = useState([]);
    const isLoggedIn = !!localStorage.getItem('token');
    const role = localStorage.getItem('role');

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const articles = await getArticles();
                setArticles(articles);
            } catch (error) {
                console.error('Error fetching articles:', error);
            }
        };

        fetchArticles();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteArticle(id);
            setArticles(articles.filter(article => article.id !== id));
        } catch (error) {
            console.error('Error deleting article:', error);
        }
    };

    return (
        <div className="articles">
            <h2>Articles</h2>
            <table>
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Date</th>
                    {isLoggedIn && (role === 'admin' || role === 'editor') && <th>Actions</th>}
                </tr>
                </thead>
                <tbody>
                {articles.map(article => (
                    <tr key={article.id}>
                        <td><Link to={`/articles/${article.id}`}>{article.title}</Link></td>
                        <td>{article.author || 'Unknown'}</td>
                        <td>{article.createdAt || 'Unknown'}</td>
                        {isLoggedIn && (role === 'admin' || role === 'editor') && (
                            <td>
                                <button onClick={() => handleDelete(article.id)}>Delete</button>
                                <Link to={`/articles/edit/${article.id}`}>Edit</Link>
                            </td>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
            <br/>
            <br/>
            <h2>Create New Article</h2>
            {isLoggedIn && (role === 'admin' || role === 'editor') && (
                <Link to="/articles/create">Create New Article</Link>
            )}
            <br/>
            <br/>
        </div>
    );
};

export default Articles;
