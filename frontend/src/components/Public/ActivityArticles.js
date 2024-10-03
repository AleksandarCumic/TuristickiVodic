import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArticlesByActivity } from '../../api/api';

const ActivityArticles = () => {
    const { activity } = useParams();
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        async function fetchArticles() {
            const data = await getArticlesByActivity(activity);
            setArticles(data);
        }
        fetchArticles();
    }, [activity]);

    return (
        <div>
            <h1>Articles about {activity}</h1>
            <ul>
                {articles.map(article => (
                    <li key={article.id}>
                        <h2><Link to={`/articles/${article.id}`}>{article.title}</Link></h2>
                        <p>{article.text.substring(0, 100)}...</p>
                        <p>{article.destination ? article.destination.name : 'Unknown Destination'}</p>
                        <p>{new Date(article.createdAt).toLocaleDateString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ActivityArticles;
