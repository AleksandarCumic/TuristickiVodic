import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:4567'; // Adjust this as needed

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Auth API
export const login = async (email, password) => {
    try {
        const response = await api.post('/login', { email, password });
        const token = response.data.token; // Assuming the token is in response.data.token
        localStorage.setItem('token', token); // Store token directly as string

        const decodedToken = jwtDecode(token);
        const role = decodedToken.role; // Assuming role is in the decoded token
        const user = response.data.user; // Assuming user info is in response.data.user

        if (role) {
            localStorage.setItem('role', role);
        }

        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        }

        return { token, role };
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

export const register = async (user) => {
    try {
        const response = await api.post('/users', user);
        return response.data;
    } catch (error) {

        console.error('Error registering user:', error);
        throw error;
    }
};

export const getUsers = async () => {
    try {
        const response = await api.get('/users', { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const deleteUser = async (id) => {
    await api.delete(`/users/${id}`, { headers: getAuthHeaders() });
};

export const createUser = async (user) => {
    try {
        const response = await api.post('/users', user, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

// Articles API
export const getArticles = async () => {
    try {
        const response = await api.get('/articles');
        return response.data.map(article => ({
            ...article,
            createdAt: new Date(article.createdAt).toLocaleDateString(),
            author: article.author ? `${article.author.firstName} ${article.author.lastName}` : 'Unknown',
        }));
    } catch (error) {
        console.error('Error fetching articles:', error);
        throw error;
    }
};

export const getArticle = async (id) => {
    try {
        const response = await api.get(`/articles/${parseInt(id, 10)}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching article:', error);
        throw error;
    }
};

export const updateArticle = async (id, article) => {
    try {
        const response = await api.put(`/articles/${parseInt(id, 10)}`, article, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        console.error('Error updating article:', error);
        throw error;
    }
};

export const deleteArticle = async (id) => {
    try {
        const response = await api.delete(`/articles/${parseInt(id, 10)}`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        console.error('Error deleting article:', error);
        throw error;
    }
};

export const getMostReadArticles = async () => {
    try {
        const response = await api.get('/articles/most-read');
        return response.data.map(article => ({
            ...article,
            createdAt: new Date(article.createdAt).toLocaleDateString(),
            author: article.author ? `${article.author.firstName} ${article.author.lastName}` : 'Unknown',
            destination: article.destination ? `${article.destination.name} ${article.destination.description}` : 'Unknown'
        }));
    } catch (error) {
        console.error('Error fetching most read articles:', error);
        throw error;
    }
};

export const getArticlesByActivity = async (activity) => {
    try {
        const response = await api.get(`/articles/activity/${activity}`);
        return response.data.map(article => ({
            ...article,
            createdAt: new Date(article.createdAt).toLocaleDateString(),
            author: article.author ? `${article.author.firstName} ${article.author.lastName}` : 'Unknown',
        }));
    } catch (error) {
        console.error('Error fetching articles by activity:', error);
        throw error;
    }
};


export async function getDestinationById(destinationId) {
    const response = await fetch(`/destinations/${destinationId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch destination');
    }
    return response.json();
}

export const getArticlesByDestination = async (destinationId) => {
    try {
        const response = await api.get(`/destinations/${destinationId}/articles`);
        return response.data.map(article => ({
            ...article,
            createdAt: new Date(article.createdAt).toLocaleDateString(),
            author: article.author ? `${article.author.firstName} ${article.author.lastName}` : 'Unknown',
        }));
    } catch (error) {
        console.error('Error fetching articles by destination:', error);
        throw error;
    }
};

// Destinations API
export const getDestinations = async () => {
    try {
        const response = await api.get('/destinations');
        return response.data;
    } catch (error) {
        console.error('Error fetching destinations:', error);
        throw error;
    }
};

export const createDestination = async (destination) => {
    try {
        const response = await api.post('/destinations', destination, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        console.error('Error creating destination:', error);
        throw error;
    }
};

export const getDestination = async (id) => {
    // try {
    //     const response = await api.get(`/destinations/${id}`);
    //     return response.data;
    // } catch (error) {
    //     console.error('Error fetching destination:', error);
    //     throw error;
    // }
};

export const updateDestination = async (id, destination) => {
    try {
        const response = await api.put(`/destinations/${id}`, destination, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        console.error('Error updating destination:', error);
        throw error;
    }
};

export const deleteDestination = async (id) => {
    try {
        const response = await api.delete(`/destinations/${id}`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        console.error('Error deleting destination:', error);
        throw error;
    }
};

export const createArticle = async (article) => {
    try {
        const response = await api.post('/articles', article, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        console.error('Error creating article:', error);
        throw error;
    }
};

export const createComment = async (articleId, comment) => {
    try {
        const response = await api.post(`/articles/${articleId}/comments`, comment);
        return response.data;
    } catch (error) {
        console.error('Error creating comment:', error);
        throw error;
    }
};



export const updateComment = async (id, comment) => {
    try {
        const token = localStorage.getItem('token');
        const response = await api.put(`/comments/${id}`, comment, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating comment:', error);
        throw error;
    }
};

export const deleteComment = async (id) => {
    try {
        const token = localStorage.getItem('token');
        const response = await api.delete(`/comments/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting comment:', error);
        throw error;
    }
};
