const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

let newsFeed = [];
let settings = { familySurname: 'My family', subscriptions: [] };

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/news', (req, res) => {
    res.json(newsFeed);
});

app.post('/news', upload.array('media'), (req, res) => {
    const post = {
        text: req.body.text,
        family: req.body.family,
        timestamp: new Date(),
        media: req.files.map(file => `/uploads/${file.filename}`)
    };

    newsFeed.push(post);
    res.status(200).send('Post added');
});

app.get('/settings', (req, res) => {
    res.json(settings);
});

app.post('/settings', (req, res) => {
    settings = { ...settings, ...req.body };
    res.status(200).send('Settings updated');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

