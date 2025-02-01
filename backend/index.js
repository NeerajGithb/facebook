const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDb = require('./config/db');
require('dotenv').config();

const authRoute = require('./routes/authRoute');
const postRoute = require('./routes/postRoute');
const userRoute = require('./routes/userRoute');
const passport = require('./controllers/googleController');

const app = express();

app.use(express.json());
app.use(cookieParser());

// ✅ Fix CORS to allow credentials (cookies, authorization headers)
app.use(cors({
    origin: "https://facebook-n.vercel.app",
    credentials: true, 
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
}));

connectDb();
app.use(passport.initialize());

// API routes
app.use('/auth', authRoute);
app.use('/users', postRoute);
app.use('/users', userRoute);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
