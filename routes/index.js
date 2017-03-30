var express = require('express');
var router = express.Router();
var mysql = require('mysql');


var pool  = mysql.createPool({
  connectionLimit : 100, //important
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'cfyc_app'
});
 
pool.getConnection(function(err, connection) {
  // connected! (unless `err` is set) 
  connection.query('SELECT * from member', function (error, results, fields) {
    // And done with the connection. 
    console.log(results[1].email);
    connection.release();
 
    // Handle error after the release. 
    if (error) throw error;
 
    // Don't use the connection here, it has been returned to the pool. 
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next){
    res.render('login')
});

router.get('/main', function(req, res, next){
    res.render('main')
});
router.get('/0m', function(req, res, next){
    res.render('0m')
});
router.get('/6m', function(req, res, next){
    res.render('6m')
});
//router.get('/2y', function(req, res, next){
    //res.render('2y')
//});
router.get('/videoPage', function(req, res, next){
    res.render('videoPage')
});
router.get('/signup', function(req, res, next){
    res.render('signup')
});

var videoName = '';

router.get('/2y', function(req, res, next) {
    pool.getConnection(function(err, connection) {
connection.query('SELECT * FROM videos', function(err, results, fields){
    if (err) {
      throw err;
    }

    var allVideos = new Array();

    for (var i=0; i<results.length; i++) {
      var video = {};
      video.id = results[i].id;
      video.name = results[i].videoName;
      videoName =results[i].videoName;
      console.log(video);

     // console.log(JSON.stringify(video));
 

      allVideos.push(video);
    }
   console.log(allVideos);
   console.log(videoName);
        connection.release();

    res.render('2y', {videos: allVideos});
     
    
  router.get('/videoPage/:videoName', function(req, res, next) {
  console.log("Redirecting to video page based on video name clicked on" + req.params.videoName);
  //currentVideo = req.params.videoName;
  video.name = req.params.videoName;
       res.render('videoPage', {video: video});
  
//  console.log(currentVideo);
      });
    });
   });
});

//var currentVideo = '';


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

    // notice that results.insertId will give you the value of the AI (auto-increment) field
    app_member.id = results.insertId;
    console.log(JSON.stringify(app_member));

    // Close the connection and make sure you do it BEFORE you redirect
    connection.release();

    res.redirect('/');
  });
   });
    
});


router.post('/login', function(req, res, next){
    
  app_member.id = req.body.id;
 app_member.email = req.body.username;
 // app_member.pword = req.body.password;

 // if(username.length == 0){
   //     res.redirect('/login')
   // }
   // if(password != "cfyc"){
    //    console.log("wrong password")
    //    res.redirect('/login')
   // }
   // else{
     //   req.session.username = username;
    //    res.redirect('/main')
   // }

    pool.getConnection(function(err, connection) {
connection.query('SELECT email, pword FROM member WHERE email=?',[app_member.email],function(err, results,fields) {
    // error will be an Error if one occurred during the query
    // results will contain the results of the query
    // fields will contain information about the returned results fields (if any)
    if (err) {
      throw err;
    }

    else if (results.length) { 
  console.log('The result is  ', results[0].email);
  } else {
  console.log("Query didn't return any results.");
  }
    app_member.id = results.insertId;

    var givenUsername = req.body.username;
    var givenPassword = req.body.password;

   // username = username.trim();

   // if(username.length == 0){
   //     res.redirect('/login')
   // }
   
    console.log(JSON.stringify(app_member));
    //console.log(results[0].pword)

    // Close the connection and make sure you do it BEFORE you redirect
    connection.release();

   // res.redirect('/');
      if (results.length == 0) {
        res.redirect('/login')
      } 

      else if(givenPassword != results[0].pword){
          console.log("wrong password")
          res.redirect('/login')
      }
      else{
        //  req.session.username = username;
          res.redirect('/main')
          
      }
    
  });
 });
    
});

router.get('/videoPage', function(req, res, next){
  var vid = document.getElementById("video1");
vid.onended = function() {
    alert("The video has ended");
    console.log('video 1 has ended')
};
    res.render('videoPage')
    console.log('video 1 has ended')
});


router.post('/videoPage', function(req, res, next){
    res.send('videoPage')

});

module.exports = router;
