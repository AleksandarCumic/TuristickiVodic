import React, { useEffect, useState } from 'react';
import {Link, useParams} from 'react-router-dom';
import { getArticlesByDestination } from '../../api/api';
import { getDestination } from '../../api/api';

const DestinationArticles = () => {
    const { id } = useParams();
    const [articles, setArticles] = useState([]);
    const [destinationName, setDestinationName] = useState('');

    useEffect(() => {
        async function fetchData() {
            // Fetch articles
            const articlesData = await getArticlesByDestination(id);
            setArticles(articlesData);

            // // Fetch destination details
            // const destinationData = await getDestination(id);
            // setDestinationName(destinationData.name);
        }
        fetchData();
    }, [id]);

    return (
        <div>
            <h1>Articles for Destination {destinationName}</h1>
            <ul>
                {articles.map(article => (
                    <li key={article.id}>
                        <h2><Link to={`/articles/${article.id}`}>{article.title}</Link></h2>
                        <p>{article.text.substring(0, 100)}...</p>
                        <p>{article.createdAt}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DestinationArticles;
