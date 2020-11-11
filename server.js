const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
    const path = require('path');
    const request = require('request');
    const fs = require("fs");

    var hsts = require('hsts');
    var xssFilter = require('x-xss-protection');
    var nosniff = require('dont-sniff-mimetype');
    var member = {
        fname: '',
        lname: '',
        title: '',
        team: '',
        status: ''
    };



// var admin = require("firebase-admin");

// var serviceAccount = require("softrams-f1a91-firebase-adminsdk-o8n8i-aa15fb48b3.json");

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://softrams-f1a91.firebaseio.com"
// });

const app = express();

app.use(cors());
app.use(express.static('assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.disable('x-powered-by');
app.use(xssFilter());
app.use(nosniff());
    app.set('etag', false);
    app.use(
    helmet({
        noCache: true
    })
);
app.use(
    hsts({
        maxAge: 15552000 // 180 days in seconds
    })
);

app.use(
    express.static(path.join(__dirname, 'dist/softrams-racing'), {
        etag: false
    })
);

app.get('/api/members', (req, res) => {
    request('http://localhost:3000/members', (err, response, body) => {
        if (response.statusCode <= 500) {
                res.send(body);
                console.log('Res Body for members... ', body);
        }
    });
});

// TODO: Dropdown! DONE!
    app.get('/api/teams', (req, res) => {
    request('http://localhost:3000/teams', (err, response, body) => {
        if (response.statusCode <= 500) {
            res.send(body);
                console.log('SUCCESS', response);
                member.push(body);
                fs.writeFile('db.json', JSON.stringify(member), err => {
                    if (err) {
                        console.err('ERROR in saving a member');
                    } else {
                        console.log('SUCCESS!');
                    }
                });

        } else {
            console.log('ERROR: ', err);
        }
    });
});

// Submit Form!
    app.post('/api/addMember', (req, res) => {
        req.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000', 'always');
    request('http://localhost:3000/members', (err, response, body) => {
        if (response.statusCode <= 500) {
            res.send(body);
            console.log('SUCCESS! WE CREATED A NEW MEMBER!', response);
        } else {
            console.log('ERROR! DAMN! We blew it!', err);
        }
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/softrams-racing/index.html'));
});

app.listen('8000', () => {
    console.log('Vrrroooom Vrrroooom! Server starting!');
});