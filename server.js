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

    var allMembers = [];

    var dbFile = 'db.json';

// var admin = require("firebase-admin");
// var serviceAccount = require("path/to/serviceAccountKey.json");

// admin.initializeApp({
//    credential: admin.credential.cert(serviceAccount),
//    databaseURL: "https://softrams-f1a91.firebaseio.com"
// });

    const app = express();

    app.use(cors());
    app.use(express.static('assets'));
    app.use(bodyParser.json());
    app.use(bodyParser.raw());
    app.use(bodyParser.urlencoded({extended: true}));
    app.disable('x-powered-by');
    app.use(xssFilter());
    app.use(nosniff());
    app.set('etag', false);
    app.use(helmet({
        noCache: true
    })
            );
    app.use(hsts({
        maxAge: 15552000 // 180 days in seconds
    })
            );

    app.use(express.static(path.join(__dirname, 'dist/softrams-racing'), {
        etag: false
    })
            );

    app.get('/api/members', (req, res) => {
        request('http://localhost:3000/members', (err, response, body) => {
            if (response.statusCode <= 500) {
                res.send(body);
                allMembers.push(body);
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
            } else {
                console.log('ERROR: ', err);
            }
        });
    });

// Submit Form!
    app.post('/api/addMember', (req, res) => {

        var isWriteable = 'is writable';
        var isNotWriteable = 'is not writable';

        console.log('REQ BODY: ', req.body);

        request('http://localhost:3000/addMember', (err, response, body) => {
            if (response.statusCode <= 500) {
                res.send(body);
                // console.log('RESPONSE!: ', response);
                // console.log('All Members BODY!: ', body);
                // console.log('REQ!: ', req);
                // Now can we Write to the file
                fs.access(dbFile, fs.constants.W_OK, (err) => {
                    console.log(`${dbFile} ${err ? isNotWriteable : isWriteable}`);

                    if (!err) {
                        fs.open(dbFile, 'wx', (err, fd) => {
                            if (err) {
                                if (err.code === 'EEXIST') {
                                    console.error('DB JSON already exists');

                                    fs.appendFile(dbFile, JSON.stringify(req.body), 'utf8', (err) => {
                                        if (err) {
                                            console.log('ERROR in saving a member: BODY: ', err);
                                        } else {
                                            console.log('SUCCESS saving new member!', req.body);
                                        }
                                    });

//                                    fs.writeFile(dbFile, JSON.stringify(req.body), (err) => {
//                                        if (err) {
//                                            console.err('ERROR in saving a member: BODY: ', err);
//                                        } else {
//                                            console.log('SUCCESS saving new member!', body);
//                                        }
//                                    });
                                    return;
                                }
                                throw err;
                            }
                        });
                    }
                });

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