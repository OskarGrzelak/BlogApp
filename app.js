const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

// APP CONFIG
mongoose.connect('mongodb://localhost:27017/blog_app', { useNewUrlParser: true });
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

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
//INDEX ROUTE
app.get('/blogs', (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err) {
            console.log(err);
        } else {
            res.render('index', {blogs: blogs});
        }
    });
});
// NEW ROUTE
app.get('/blogs/new', (req, res) => {
    res.render('new');
});
// CREATE ROUTE
app.post('/blogs', (req, res) => {
    // create blog
    Blog.create(req.body.blog, (err, newBlog) => {
        if (err) {
            console.log(err);
            res.render('new');
        } else {
            //redirect to the index
            res.redirect('/blogs');
        }
    });
});
// SHOW ROUTE
app.get('/blogs/:id', (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            res.redirect('/blogs');
        } else {
            res.render('show', {blog: foundBlog});
        };
    });
});
// EDIT ROUTE
app.get('/blogs/:id/edit', (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            res.redirect('/blogs');
        } else {
            res.render('edit', {blog: foundBlog});
        };
    });
});
// UPDATE ROUTE
app.put('/blogs/:id', (req, res) => {
    Blog.findOneAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        if (err) {
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs/' + req.params.id);
        };
    });
});
// DESTROY ROUTE
app.delete('/blogs/:id', (req, res) => {
    Blog.findByIdAndRemove(req.params.id, (err, deletedBlog) => {
        if (err) {
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs');
        };
    });
});
app.listen(3000, () => {
    console.log('app started');
});