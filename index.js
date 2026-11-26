const express = require('express');
const { connectToMongoose } = require('./connection');
const { checkForAuthentication,restrictTo } = require('./middlewares/auth');
const path = require('path');

const urlRouter = require('./routers/url');
const staticRouter = require('./routers/staticRouter');
const userRouter = require('./routers/user');   

const URL = require('./models/url');

const app = express();
const port = 8000;
const cookieParser = require('cookie-parser')
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication); // middleware to check for authentication
// Routes
app.use('/url',restrictTo(['normal','admin']), urlRouter); // inline middleware to restrict access to logged-in users only
app.use('/user', userRouter);
app.use('/', staticRouter);

// MongoDB connection
connectToMongoose('mongodb://localhost:27017/short-url')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.log('MongoDB connection error:', err);
    });

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// Test route
app.get('/test', async (req, res) => {
    const allUrls = await URL.find({});

    return res.render('home', {
        urls: allUrls
    });
});

// Redirect short URL
app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;

    const entry = await URL.findOneAndUpdate(
        { shortUrl: shortId },
        {
            $push: {
                visitsHistory: {
                    timestamp: Date.now()
                }
            }
        }
    );

    // If short URL doesn't exist
    if (!entry) {
        return res.status(404).send('Short URL not found');
    }

    return res.redirect(entry.redirectUrl);
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});