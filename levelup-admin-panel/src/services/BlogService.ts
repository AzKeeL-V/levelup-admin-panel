import api from './api';
import { BlogItem } from '../types/BlogItem';

const BlogService = {
    getAllBlogs: async (): Promise<BlogItem[]> => {
        const response = await api.get('/blogs');
        return response.data;
    },

    getBlogById: async (id: string): Promise<BlogItem> => {
        const response = await api.get(`/blogs/${id}`);
        return response.data;
    },

    createBlog: async (blog: BlogItem): Promise<BlogItem> => {
        const response = await api.post('/blogs', blog);
        return response.data;
    },

    updateBlog: async (id: string, blog: BlogItem): Promise<BlogItem> => {
        const response = await api.put(`/blogs/${id}`, blog);
        return response.data;
    },

    deleteBlog: async (id: string): Promise<void> => {
        await api.delete(`/blogs/${id}`);
    },
};

export default BlogService;
