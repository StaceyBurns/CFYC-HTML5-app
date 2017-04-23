var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var member = {};

var pool = mysql.createPool({
    connectionLimit: 100, 
    host: 'us-cdbr-azure-southcentral-f.cloudapp.net',
    user: 'b7a51036c7e393',
    password: '7192af0f',
    database: 'acsm_80c11940ed70e0a'
});
/*pool.getConnection(function(err, connection) {
    connection.query('SELECT * from member', function(error, results, fields) {
        console.log(results[1].email);
        connection.release();
        if (error) throw error;
    });
});*/

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
    console.log('the user email is ' +req.session.email);
    if (typeof req.session.userId == 'undefined'){
        req.session.userId = 2;
    }
    console.log('user is logged in as user number ' + req.session.userId);
    res.render('main')
});
router.get('/0m', function(req, res, next) {
    res.render('0m')
});
router.get('/6m', function(req, res, next) {
    res.render('6m')
});
router.get('/videoPage', function(req, res, next) {
    res.render('videoPage')
});
router.get('/signup', function(req, res, next) {
    res.render('signup')
});
router.get('/infographic', function(req, res, next) {
    res.render('infographic')
});
router.get('/usefulInfo', function(req, res, next) {
    res.render('usefulInfo')
});
router.get('/myAccount', function(req, res, next) {
        if (req.session.userId == '2'){
        req.session.userId = 2;
        req.session.emailMsg = 'You are not logged in';
    }
 else { 
        req.session.emailMsg = req.session.email;
}


    res.render('account', {emailMsg: req.session.emailMsg})
});
router.get('/logout', function(req, res, next) {
  req.session.destroy()
  res.redirect('/login');
});
var videoName = '';
var videoText = '';
var videoURL = '';

router.get('/2y', function(req, res, next) {
    pool.getConnection(function(err, connection) {
        connection.query('SELECT * FROM videos JOIN trackVideo ON videos.videoId = trackVideo.videoId WHERE trackVideo.trackVideoUserId=?',[2], function(err, results, fields) {


            if (err) {
                throw err;
            }

            var allVideos = new Array();

            for (var i = 0; i < results.length; i++) {
                var video = {};
                video.name = results[i].videoName;
                video.text = results[i].videoText;
                video.url = results[i].videoURL;
                videoURL = results[i].videoURL;
                video.BG = results[i].videoBG;
                videoName = results[i].videoName;
                videoText = results[i].videoText;
                videoUserId = results[i].videoUserId;
                videoViewed = '';
                videoStatus = (function status() {
                if (results[i].viewed == 'viewed') {
                video.viewed = ['ui-btn', 'ui-icon-check', 'ui-btn-icon-left', 'viewed-icon']
                     }
                  else {
                video.viewed = ['ui-btn', 'ui-icon-carat-r', 'ui-btn-icon-left']
                  }

                    })();
                                   console.log('----------------------------------------------------'+ videoViewed);
                console.log(video);
                console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'+video.url);
                console.log('OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO'+videoURL);
                allVideos.push(video);
            }
            //console.log(allVideos);
            connection.release();
            
            

            res.render('2y', {
                videos: allVideos
            });



            router.get('/videoPage/:videoURL', function(req, res, next) {
                console.log("Redirecting to video page based on video name clicked on" + req.params.videoURL);
                video.url = req.params.videoURL;

                pool.getConnection(function(err, connection) {
                    connection.query('SELECT videoText, videoName FROM videos WHERE videoURL=?', [video.url], function(err, results, fields) {
                        if (err) {
                            throw err;
                        }
                        if (results.length){
                        videoText = results[0].videoText;
                        videoName = results[0].videoName;
                        }

                        connection.release();

                       //console.log(video.text);
                        console.log(videoText);

                        res.render('videoPage', {
                            video: video, videoText: videoText, videoName: videoName
                        });
                    });
                });
            });
        });
    });
});
console.log(videoName);

 var app_member = {};
router.post('/signup', function(req, res, next){
    
  app_member.id = req.body.id;
  app_member.email = req.body.newUsername;
  app_member.pword = req.body.newPassword;

    pool.getConnection(function(err, connection) {
connection.query('INSERT INTO member (email, pword) VALUES(?,?)',[app_member.email, app_member.pword], function(err, results,fields) {
    if (err) {
      throw err;
    }


    app_member.id = results.insertId;
    req.session.email = app_member.email;
    console.log(JSON.stringify(app_member));

    connection.release();

    res.redirect('/');
  });
   });
    
});

          

router.post('/login', function(req, res, next) {

    app_member.id = req.body.id;
    app_member.email = req.body.username;
    pool.getConnection(function(err, connection) {
        connection.query('SELECT email, pword, id FROM member WHERE email=?', [app_member.email], function(err, results, fields) {
            if (err) {
                throw err;
            } else if (results.length) {
                console.log('The result is  ', results[0].email);
                app_member.userId = results[0].id;
                req.session.email = results[0].email;
            } else {
                console.log("Query didn't return any results.");
                req.session.userMessage = "This email address is not registered";
            }
            //app_member.id = results.insertId;

            var givenUsername = req.body.username;
            var givenPassword = req.body.password;
            console.log(JSON.stringify(app_member));
            connection.release();
            if (results.length == 0) {
                res.render('/login', {
                    msg: req.session.userMessage
})
            } else if (givenPassword != results[0].pword) {
             req.session.userMessage = "Password/email incorrect";
                res.render('login', {
                    msg: req.session.userMessage
                });
            } else {
    
                req.session.email = app_member.email;
                req.session.userId = app_member.userId;
                
                res.redirect('/main')
                
            }
            console.log('The session ID is ' + req.session.userId);
        });
    });
});



router.post('/videoPage', function(req, res, next) {

  var videoStatus = {
    //status: ---> the status that i set to viewed when the video ends?
    status: "Not viewed",
    name: "Not set",
  };

  res.json('videoStatus');
});

module.exports = router;
