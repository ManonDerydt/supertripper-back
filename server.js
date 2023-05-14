const express = require('express');
const app = express();
const port = 1995;
const Buffer = require('buffer').Buffer;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}.`);
});

// Middleware pour vérifier l'authentification
const checkAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        res.sendStatus(401);
        return;
    }

    const encodedCredentials = authHeader.slice(6);
    const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
    const [username, password] = decodedCredentials.split(':');

    if (username === 'user' && password === 'password') {
        next();
    } else {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        res.sendStatus(401);
    }
};

// Route protégée
app.get('/route-protegee', checkAuth, (req, res) => {
    res.send('Vous êtes authentifié !');
});