const express = require('express');
const router = require('./router.js');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', router);

const PORT = process.env.PORT || 8080;

const startServer = async () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting the server:', error);
    }
};

startServer();