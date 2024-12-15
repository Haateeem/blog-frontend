import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api/blogs',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getBlogs = () => api.get('/');

export const getBlogById = (id) => api.get(`/${id}`);

export const createBlog = (blogData) => api.post('/', blogData);

export const updateBlog = (id, blogData) => api.put(`/${id}`, blogData);

export const deleteBlog = (id) => api.delete(`/${id}`);
