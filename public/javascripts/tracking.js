 $(document).ready(function(){
// I'll change the video ID to video.name from database later and also send this back to the server on video.ended, leaving it as video1 now for simplicity
var video = document.getElementById('video1');
var endPoint = "http://localhost:3000";
  video.onended=function(){
 // var status = 'viewed';  
      $.ajax({
          type: "POST",
          url: endPoint + "/videoPage"
        }).done(function( data ) {
          //  data.status ='viewed';
            console.log( "Received server response: " + data.status);
          }).fail(function(msg){
            console.log("Ajax fail: ");
        });
  };
});
