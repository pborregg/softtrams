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
    var dbFileJSON = require('./db.json');

    var dbFile = 'db.json';
    var dbFileMembers = [];
    var dbFileNewMembers = [];
    var dbFileTeams = [];
    var dbFileNewTeams = [];
    var dbFileNewJSON = [];

    const app = express();

    app.use(cors());
    app.use(express.static('assets'));
    app.use(bodyParser.json());
    app.use(bodyParser.raw());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.disable('x-powered-by');
    app.use(xssFilter());
    app.use(nosniff());
    app.set('etag', false);

    app.use(helmet({
        noCache: false
    }));

    app.use(hsts({
        maxAge: 15552000 // 180 days in seconds
    }));

    app.use(express.static(path.join(__dirname, 'dist/softrams-racing'), {
        etag: false
    }));

    app.get('/api/members', (req, res) => {
        request('http://localhost:3000/members', (err, response, body) => {
            if (response.statusCode <= 500) {
                res.send(body);
                dbFileMembers.push(body);
                console.log('DBFILE: ', dbFileJSON);
                console.log('SUCCESS! We got the members ', JSON.parse(dbFileMembers));
            }
        });
    });

    // TODO: Dropdown! DONE!
    app.get('/api/teams', (req, res) => {
        request('http://localhost:3000/teams', (err, response, body) => {
            if (response.statusCode <= 500) {
                res.send(body);
                dbFileTeams.push(body);
                console.log('SUCCESS! We got the TEAMS! ', JSON.parse(dbFileTeams));
            } else {
                console.log('ERROR getting TEAMS: ', err);
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
                                console.log('FD: ', fd);
                                if (err.code === 'EEXIST') {
                                    console.error('DB JSON already exists');
                                    console.log('DB FILE JSON MEMBERS:', dbFileMembers);
                                    console.log('DB FILE JSON TEAMS:', dbFileTeams);

                                    const newMember = req.body;

                                    app.post('/api/addMember', (req, res) => {
                                        const filename = './db.json';
                                        console.log('READY to SAVE NEW MEMBER: ', req.body);
                                        request('http://localhost:3000/addMember', async(err, response, body) => {
                                            const data = await readFileJson(filename);
                                            console.log('READY to WRITE JSON NEW MEMBER: ', req.body);
                                            data['newmemeber'] = req.body; // add to object
                                            await writeFileJSON(filename, JSON.stringify(data, null, 4)); // save data to file.
                                            res.json({ code: 1, message: 'saved to db!', data: {} })

                                        });
                                    });

                                    function readFileJson(filename) {
                                        return new Promise((resolve, reject) => {
                                            fs.readFile(filename, 'utf-8', function(err, data) {
                                                if (err) {
                                                    console.log('READFILE JSON IF ERROR: ', err);
                                                    return resolve({});
                                                }
                                                try {
                                                    console.log('READFILE JSON SUCCESS: ', data);
                                                    return resolve(JSON.parse(data));
                                                } catch (err) {
                                                    console.log('READFILE JSON CATCH ERROR: ', err);
                                                    return resolve({});
                                                }
                                            });
                                        });
                                    }

                                    function writeFileJSON(filename, data) {
                                        return new Promise((resolve, reject) => {
                                            fs.writeFile(filename, data, function(err, data) {
                                                if (err) {
                                                    console.log('WRITEFILE JSON ERROR: ', err);
                                                    return reject(err);
                                                }
                                                console.log('SUCCESS WRITING NEW MEMBER: ', data);
                                                return resolve();
                                            });
                                        });
                                    }

                                    // req.on('data', (newMember) => {

                                    //     var element = JSON.parse(newMember);
                                    //     fs.readFile('db.json', 'r', (err, json) => {
                                    //         var array = JSON.parse(json);
                                    //         array.push(element);
                                    //         fs.writeFile('db.json', JSON.stringify(array), 'w', (err) => {
                                    //             if (err) {
                                    //                 console.log('ERROR writing to JSON file: ', err);
                                    //                 return;
                                    //             }
                                    //             console.log('SUCCESS! A new member was added!');
                                    //         });
                                    //         res.end(`{'msg': 'SUCCESS'}`);
                                    //     });
                                    // });

                                    // fs.writeFileSync('db.json', JSON.stringify(dbFile, null, 4), (err) => {
                                    //     if (err) {
                                    //         console.log('ERROR in saving a member: BODY: ', err);
                                    //     } else {

                                    //         console.log('SUCCESS saving new member!', req.body);
                                    //     }
                                    // });
                                }
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