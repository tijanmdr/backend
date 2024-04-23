const express = require('express');
const db = require('./src/config/db.config.js');
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const authMiddleware = require('./src/config/auth');
const {router} = require('./src/config/routes');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// // Set Pug as the templating engine
// app.set('view engine', 'ejs');
// app.set('views', './views');

// Route to render a Pug template with data (replace with your logic)
app.get('/', async (req, res) => {
    res.render('index');
});

app.use('/', router);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
