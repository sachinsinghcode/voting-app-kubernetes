const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from the frontend
    methods: ['GET', 'POST'], // Allow only GET and POST requests
    credentials: true // Allow cookies and credentials (if needed)
}));

app.use(express.json());

// In-memory storage for votes
let votes = {
    dogs: 0,
    cats: 0
};

// Route to get current votes
app.get('/votes', (req, res) => {
    res.json(votes);
});

// Route to vote for dogs
app.post('/vote/dogs', (req, res) => {
    votes.dogs += 1;
    res.json(votes);
});

// Route to vote for cats
app.post('/vote/cats', (req, res) => {
    votes.cats += 1;
    res.json(votes);
});

// Start the server
app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
});