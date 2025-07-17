import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const posts = [];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const likes = {}; // key: title, value: number of likes



// Home route
app.get('/', (req, res) => {
    res.render("home", { posts: posts, likes: likes });
});

// Compose route (GET)
app.get('/compose', (req, res) => {
    res.render('compose');
});

// Compose route (POST)
app.post('/compose', (req, res) => {
    const post = {
        title: req.body.postTitle,
        content: req.body.postBody
    };
    posts.push(post);
    res.redirect('/');
});

app.post("/like", (req, res) => {
    const title = req.body.title;
    likes[title] = (likes[title] || 0) + 1;
    res.redirect("/");
});


// View individual post
app.get('/posts/:title', (req, res) => {
    const requestedTitle = req.params.title.toLowerCase();
    const post = posts.find(p => p.title.toLowerCase() === requestedTitle);

    if (post) {
        res.render('post', { title: post.title, content: post.content });
    } else {
        res.send("Post not found");
    }
});

// Delete post
app.post('/delete', (req, res) => {
    const titleToDelete = req.body.title;
    const index = posts.findIndex(p => p.title === titleToDelete);
    if (index !== -1) {
        posts.splice(index, 1);
    }
    res.redirect('/');
});

// Start server
app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
