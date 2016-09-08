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