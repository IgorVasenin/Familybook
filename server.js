const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

// Endpoint to get news
app.get('/news', (req, res) => {
    fs.readFile('news.json', (err, data) => {
        if (err) {
            res.status(500).send('Error reading news file');
        } else {
            res.send(data);
        }
    });
});

// Endpoint to post news
app.post('/news', (req, res) => {
    const newNews = req.body;

    fs.readFile('news.json', (err, data) => {
        if (err) {
            res.status(500).send('Error reading news file');
        } else {
            const newsFeed = JSON.parse(data);
            newsFeed.push(newNews);

            fs.writeFile('news.json', JSON.stringify(newsFeed), err => {
                if (err) {
                    res.status(500).send('Error writing news file');
                } else {
                    res.send('News added');
                }
            });
        }
    });
});

// Endpoint to delete news by family
app.delete('/news/:family', (req, res) => {
    const familyToDelete = req.params.family;

    fs.readFile('news.json', (err, data) => {
        if (err) {
            res.status(500).send('Error reading news file');
        } else {
            let newsFeed = JSON.parse(data);
            newsFeed = newsFeed.filter(news => news.family !== familyToDelete);

            fs.writeFile('news.json', JSON.stringify(newsFeed), err => {
                if (err) {
                    res.status(500).send('Error writing news file');
                } else {
                    res.send('Family news deleted');
                }
            });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
