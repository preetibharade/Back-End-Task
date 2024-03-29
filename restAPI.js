const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/blog', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

const BlogPostSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: String
});

const BlogPost = mongoose.model('BlogPost', BlogPostSchema);

app.post('/api/posts', async (req, res) => {
    try {
        const { title, content, author } = req.body;

        if (!title || !content || !author) {
            return res.status(400).json({ message: 'Title, content, and author are required' });
        }

        const newPost = new BlogPost({ title, content, author });
        await newPost.save();

        res.status(201).json(newPost);
    } catch (err) {
        console.error('Error creating blog post:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
