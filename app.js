const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// APP CONFIG
mongoose.connect('mongodb://localhost:27017/blog_app', { useNewUrlParser: true });
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

// MONGOOSE/MODEL CONFIG
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

const Blog = mongoose.model("Blog", blogSchema);

/* Blog.create({
    title: "Test blog",
    image: "https://images.unsplash.com/photo-1539707404945-ff13f6a9565a?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=4fe989dbb4f2c8939e18b8b7605025a7&auto=format&fit=crop&w=1055&q=80",
    body: "Hello, this is a blog post"    
}); */

// ROUTES
app.get('/', (req, res) => {
    res.redirect('/blogs');
});
app.get('/blogs', (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err) {
            console.log(err);
        } else {
            res.render('index', {blogs: blogs});
        }
    });
});

app.listen(3000, () => {
    console.log('app started');
});