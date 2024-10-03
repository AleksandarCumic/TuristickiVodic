import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getArticles } from '../../api/api';

const Home = () => {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        async function fetchArticles() {
            const data = await getArticles();
            const sortedArticles = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setArticles(sortedArticles.slice(0, 10));
        }
        fetchArticles();
    }, []);

    return (
        <div>
            <h1>Home</h1>
            <ul>
                {articles.map(article => (
                    <li key={article.id}>
                        <h2><Link to={`/articles/${article.id}`}>{article.title}</Link></h2>
                        <p>{article.text.substring(0, 100)}...</p>
                        <p>{article.destination ? article.destination.name : 'Unknown Destination'}</p>
                        <p>{article.createdAt}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Home;
