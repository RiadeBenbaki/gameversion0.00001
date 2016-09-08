var express = require('express');
var app = express();
var log = [];

var server = require('http').createServer(app);

var io = require('socket.io')(server);

app.get('/',function(req,res) { 
	    res.sendFile(__dirname + '/game.html');
});

function getduration(miliseconds)
{
	var minutes = miliseconds/(1000*60);
	minutes = Math.floor(minutes);

	var seconds = miliseconds/1000;
	seconds = Math.floor(seconds % 60);

	var milisecond = Math.floor(miliseconds % 100);

	return {min : minutes, sec: seconds, milisec : milisecond};
}
io.on('connection', function(socket) {

	socket.on('gameloaded',function(data) {
socket.username = data;
	});


	socket.on('start',function(data) {
	
		socket.startedat = data.startwhen;
		console.log(socket.username + ' started playing at ' + socket.startedat);

	});
socket.on('stop',function(data) {
		socket.stopedat = data;

		var duration = socket.stopedat - socket.startedat;
		console.log(socket.username + ' stoped at ' + socket.stopedat);
		var result = socket.username + ' played for ' + getduration(duration).min + ' minutes and ' + getduration(duration).sec + ' seconds and ' +getduration(duration).milisec + ' miliseconds';
        if(socket.ischeating == true) { result += ' But he cheated !'}
        console.log(result);
        log.push(result);
        socket.emit('logupdate',result);
        socket.broadcast.emit('logupdate',result);

	});

socket.on('verifyvalues',function(data) {
var canvaswidth = data.canvaswidth;
var canvasheight = data.canvasheight;
var dspeed = data.dspeed;
var ballradius = data.ballradius;
var paddlewidth = data.paddlewidth;
var paddleheight = data.paddleheight;
var dx = data.dx;
var dy = data.dx;
if(dspeed != '0.1' || ballradius != '10' || paddlewidth != '75' || paddleheight != '10')
{
  socket.ischeating = true;
}

});

socket.on('verification',function(data) {
	var original = `
var username = prompt("Please pick a username");

var socket = io.connect('http://localhost:4200');
socket.emit('gameloaded',username);
function sendveri()
{
var datatosend = $('script').last().html();
socket.emit('verification',datatosend);
}


	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	
	var x = canvas.width/2;
    var y = canvas.height-30;
	
	var dx = 2;
    var dy = -2;
	
	var dspeed = 0.1;
	
	var ballRadius = 10;
	
	var paddleHeight = 10;
    var paddleWidth = 75;
    var paddleX = (canvas.width-paddleWidth)/2;
    
    var rightPressed = false;
var leftPressed = false;
    
    var dpaddle = 5;
function resettodefault()
{

	
	 x = canvas.width/2;
    y = canvas.height-30;
	
	 dx = 2;
     dy = -2;
	
	 dspeed = 0.1;
	
	 ballRadius = 10;
	
	 paddleHeight = 10;
     paddleWidth = 75;
     paddleX = (canvas.width-paddleWidth)/2;
    
     rightPressed = false;
 leftPressed = false;
    
    dpaddle = 5;
}
	
    
    function drawPaddle()
 {
    ctx.beginPath();
    if(leftPressed && paddleX>0)
    {
    	paddleX -= dpaddle;
    }
    if(rightPressed && (paddleX + paddleWidth) < canvas.width)
    {
    	paddleX += dpaddle;
    }
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

	function increasespeed() 
	{
		if(Math.abs(dx) <6)
		{
		if(dx>0) {dx += dspeed;}
	 	    if(dx<0) {dx -= dspeed;}
	 	    if(dy>0) {dy += dspeed;}
	 	        if(dy<0) {dy -= dspeed;}
	 	}
	}
	function drawball()
	{
		  ctx.beginPath();
          ctx.arc(x, y, ballRadius, 0, Math.PI*2);
          ctx.fillStyle = "#0095DD";
          ctx.fill();
          ctx.closePath();
	}
	var tostop = false;
function draw()
	 {
	 socket.emit('verifyvalues',{canvaswidth : canvas.width,canvasheight : canvas.height,dspeed:dspeed,ballradius:ballRadius,paddlewidth:paddleWidth,paddleheight:paddleHeight,dx:dx,dy:dy,dpaddle:dpaddle});
	 	if(x>canvas.width-ballRadius || x <ballRadius)
	 	{
	 		dx = -dx;
	 		increasespeed();
	 	}
	 
	 	if(y < ballRadius)
	 	{
	 		dy = -dy;
	 				increasespeed();
	 		
	 	}
	 	else
	 	{
	 		
	 		if(y>canvas.height-ballRadius)
	 		{
	 			if(x>paddleX - ballRadius && x<paddleX+paddleWidth + ballRadius)
	 			{
	 				dy = -dy;
	 					increasespeed();
	 			}
	 			else
	 			{
	 				tostop = true;
					$('#start').prop('disabled', false);
					resettodefault();
					socket.emit('stop',Date.now());
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                     
	 			}
	 		}
	 	}
	 	if(!tostop)
		{
		ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawball();
        x += dx;
        y += dy;
drawPaddle();


requestAnimationFrame(draw);
}
else
{

}

}
    
    document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}
$('#start').click(function() {
tostop = false;
$('#start').prop('disabled', true);
socket.emit('start',{startwhen :Date.now() });
draw();

});

socket.on('logupdate',function(data){
$('#log').html($('#log').html() + '<br>' + data);
});

setInterval(sendveri,2000);
`;
if(data != original)
{
	socket.ischeating = true;
}
});

});

server.listen(4200);