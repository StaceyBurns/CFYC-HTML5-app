var express = require('express');
var router = express.Router();
var mysql = require('mysql');


var pool = mysql.createPool({
    connectionLimit: 100, 
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cfyc_app'
});

pool.getConnection(function(err, connection) {
    connection.query('SELECT * from member', function(error, results, fields) {
        console.log(results[1].email);
        connection.release();
        if (error) throw error;
    });
});

router.get('/temp', function(req, res, next) {
    res.render('tempVideo')
});

router.get('/', function(req, res, next) {
    res.render('login')
});

router.get('/login', function(req, res, next) {
    res.render('login')
});

router.get('/main', function(req, res, next) {
    res.render('main')
});
router.get('/0m', function(req, res, next) {
    res.render('0m')
});
router.get('/6m', function(req, res, next) {
    res.render('6m')
});
//router.get('/2y', function(req, res, next){
//res.render('2y')
//});
router.get('/videoPage', function(req, res, next) {
    res.render('videoPage')
});
router.get('/signup', function(req, res, next) {
    res.render('signup')
});

var videoName = '';
var videoText = '';

router.get('/2y', function(req, res, next) {
    pool.getConnection(function(err, connection) {
        connection.query('SELECT * FROM videos', function(err, results, fields) {
            if (err) {
                throw err;
            }

            var allVideos = new Array();

            for (var i = 0; i < results.length; i++) {
                var video = {};
                video.id = results[i].id;
                video.name = results[i].videoName;
                video.text = results[i].videoText;
                videoName = results[i].videoName;
                videoText = results[i].videoText;
                console.log(video);
                allVideos.push(video);
            }
            console.log(allVideos);
            connection.release();

            res.render('2y', {
                videos: allVideos
            });


            router.get('/videoPage/:videoName', function(req, res, next) {
                console.log("Redirecting to video page based on video name clicked on" + req.params.videoName);
                video.name = req.params.videoName;

                pool.getConnection(function(err, connection) {
                    connection.query('SELECT videoText FROM videos WHERE videoName=?', [video.name], function(err, results, fields) {
                        if (err) {
                            throw err;
                        }
                        videoText = results[0].videoText;

                        connection.release();

                       //console.log(video.text);
                        console.log(videoText);

                        res.render('videoPage', {
                            video: video
                        });
                    });
                });
            });
        });
    });
});
console.log(videoName);

var app_member = {};
router.post('/signup', function(req, res, next) {

    app_member.id = req.body.id;
    app_member.email = req.body.newUsername;
    app_member.pword = req.body.newPassword;

pool.getConnection(function(err, connection) {
        connection.query('SELECT email FROM member', function(err, results, fields) {
            if (err) {
                throw err;
            }
           // app_member.id = results.insertId;
            console.log(JSON.stringify(app_member));
            connection.release();
        var registeredEmails = new Array();

        for (var i = 0; i < results.length; i++) {
            var email = {};
            email.email = results[i].email;

            console.log(JSON.stringify(email));

            registeredEmails.push(email);
        }

        for (var i = 0; i <registeredEmails.length; i++) {
            if(app_member.email == registeredEmails[i]) {

                res.redirect('/signup');
            console.log('email already in use');
        }
    } 

    pool.getConnection(function(err, connection) {
        connection.query('INSERT INTO member (email, pword) VALUES(?,?)', [app_member.email, app_member.pword], function(err, results, fields) {
            if (err) {
                throw err;
            }
            app_member.id = results.insertId;
            console.log(JSON.stringify(app_member));
            connection.release();
        
            res.redirect('/login');
        
        });
    
    });
    

});
          
   });
        
    });


router.post('/login', function(req, res, next) {

    app_member.id = req.body.id;
    app_member.email = req.body.username;
    pool.getConnection(function(err, connection) {
        connection.query('SELECT email, pword FROM member WHERE email=?', [app_member.email], function(err, results, fields) {
            if (err) {
                throw err;
            } else if (results.length) {
                console.log('The result is  ', results[0].email);
            } else {
                console.log("Query didn't return any results.");
            }
            app_member.id = results.insertId;

            var givenUsername = req.body.username;
            var givenPassword = req.body.password;
            console.log(JSON.stringify(app_member));
            connection.release();
            if (results.length == 0) {
                res.redirect('/login')
            } else if (givenPassword != results[0].pword) {
                console.log("wrong password")
                res.redirect('/login')
            } else {
                res.redirect('/main')
            }
        });
    });
});

router.get('/videoPage', function(req, res, next) {
    var vid = document.getElementById("video1");
    vid.onended = function() {
        alert("The video has ended");
        console.log('video 1 has ended')
    };
    res.render('videoPage')
    console.log('video 1 has ended')
});


router.post('/videoPage', function(req, res, next) {
    res.send('videoPage')

});

module.exports = router;