const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Set views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../../views/pages'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../css')));

// Route for login page
app.get('/', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Process login here
    if (username === "user" && password === "password") {
        res.send("Login sukses");
    } else {
        res.send("Login gagal");
    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
