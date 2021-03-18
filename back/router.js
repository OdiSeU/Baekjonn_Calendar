const express = require('express');
const router = express();
const Mongodb = require('./mongo');
const BjCrawl = require('./crawl');
const LoginCtrl = require('./loginCtrl');

const DB_PWD = 'dilab', DB_NAME = 'bj_calendar';
const URL = `mongodb+srv://odiseu:${DB_PWD}@odiseu.lk7jw.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
Mongodb.url = URL;

router.get('/', (req, res) => {
    console.log(`access to '${req.url}'`);
    res.send('index.html');
});

router.post('/crawl', (req, res) => {
    console.log(`access to '${req.url}'`);

    BjCrawl.crawl({'problem_id':req.body['problem_id'], 'user_id': req.body['user_id'], 'language_id': req.body['language_id']})
    .then((data) => {
        console.log(data);
        res.json(data);
    });
});

router.get('/sign-up', (req, res) => {
    console.log(`access to '${req.url}'`);
    LoginCtrl.signUp(DB_NAME, 'userdata', {email: 'asdf@gmail.com', password: '1234'})
    .then((data) => {
        console.log(data);
        res.json(data);
    })
});

router.get('/sign-in', (req, res) => {
    console.log(`access to '${req.url}'`);
    LoginCtrl.signIn(DB_NAME, 'userdata', {email: 'asdf@gmail.com', password: '1234'}, req.session)
    .then((data) => {
        console.log(data);
        res.json(data);
    })
});

router.get('/sign-secede', (req, res) => {
    console.log(`access to '${req.url}'`);
    LoginCtrl.signSecede(DB_NAME, 'userdata', {email: 'asdf@gmail.com', password: '1234'}, req.session)
    .then((data) => {
        console.log(data);
        res.json(data);
    })
});

router.get('/sign-check', (req, res) => {
    console.log(`access to '${req.url}'`);
    LoginCtrl.signCheck(req.session)
    .then((data) => {
        console.log(data);
        res.json(data);
    })
});

router.get('/sign-out', (req, res) => {
    console.log(`access to '${req.url}'`);
    LoginCtrl.signOut(req.session)
    .then((data) => {
        console.log(data);
        res.json(data);
    })
});

module.exports = router;