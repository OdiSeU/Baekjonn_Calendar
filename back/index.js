const express = require('express');
const session = require('express-session');
const router = require('./router');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;

// for link react client app
const clientPath = path.join(__dirname, '../front/build');
app.use(express.static(clientPath));

// for read request.body
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// for use session
app.use(session({
    secret:'!@#ASD123asd',
    resave: false,
    saveUninitialized: true
}))

// for link router
app.use('/', router);

// start server
app.listen(PORT, ()=> {
    console.log(`server on : http://ec2-13-209-21-68.ap-northeast-2.compute.amazonaws.com:${PORT}`);
});