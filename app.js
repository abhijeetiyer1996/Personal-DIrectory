const express = require('express');
const app = express();
const database = require('./config/db');
const registerRoute = require('./routes/register');
const loginRoute = require('./routes/auth');
const fileRoute = require('./routes/file');

const PORT = process.env.PORT || 5000;

database();
app.use(express.json({extended: false}));
app.use(express.static('uploads'))
app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/uploads', fileRoute);

app.listen(PORT,()=>{
    console.log('server up and running')
})

