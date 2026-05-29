const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
const linkedinRoutes = require('./routes/linkedinRoutes');
const postRoutes = require('./routes/postRoutes');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('API Running...');
});
app.use('/api/linkedin', linkedinRoutes);
app.use('/api/posts', postRoutes);

module.exports = app;