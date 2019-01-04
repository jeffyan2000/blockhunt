var chatInput = document.getElementById('localInput');
var localInput = document.getElementById('localInputD');
var chatForm = document.getElementById('localForm');
var localForm = document.getElementById('localFormD');
var inputName = document.getElementById('nameInput');
var nameForm = document.getElementById('nameForm');
var chatText = document.getElementById('chat-text');
var localText = document.getElementById('chat-textD');
chatInput.setAttribute("autocomplete", "off");
localInput.setAttribute("autocomplete", "off");
inputName.setAttribute("autocomplete", "off");
var ctelement = document.getElementById("ctx");
var ctx = document.getElementById("ctx").getContext("2d");
var ctxbg = document.getElementById("ctx-bg").getContext("2d");
ctx.font = '30px Arial';
var socket = io();

//Add Map Here
var mapsMain = [null, map1, map2, map3, map4];

var width = 1024;
var height = 768;
var playerSide = 50;

var titleimg=new Image();
var help_0=new Image();
var help_1=new Image();
var help_2=new Image();
help_0.src = 'client/img/help1.png';
help_1.src = 'client/img/help2.png';
help_2.src = 'client/img/help3.png';
titleimg.src = 'client/img/title.png';
var helps=[help_0, help_1, help_2];

var stage = 0;
var helpIndex = 0;
var nameWarning = "Please enter a name";

var mousePos = [0,0];
var mousePosS = [0,0];
var mouseDown = false;
var scrollPos = -300;
var selfInfo = [0,0,0];
var staticBoxes = [];
var indicators = {};
var currentMap = 0;
var currentTick = 0;
var countDownBox = 0;
var buttons = [];
var resultFinal = false;
var circleImgsNum = 1;
var circleImgs = [];
for(var i = 0; i<circleImgsNum; i++){
	var imgTmp = new Image();
	imgTmp.src = 'client/img/ball'+i+'.png';
	circleImgs.push(imgTmp);
}
var wallImgsNum = 23;
var wallImgs = [];
for(var i = 0; i<wallImgsNum; i++){
	var imgTmp = new Image();
	imgTmp.src = 'client/img/walls/wall'+i+'.png';
	wallImgs.push(imgTmp);
}
var shadeImgsNum = 1;
var shadeImgs = [];
for(var i = 0; i<shadeImgsNum; i++){
	var imgTmp = new Image();
	imgTmp.src = 'client/img/shades/shade'+i+'.png';
	shadeImgs.push(imgTmp);
}
var bgImgsNum = 5;
var bgImgs = [];
for(var i = 0; i<bgImgsNum; i++){
	var imgTmp = new Image();
	imgTmp.src = 'client/img/bgs/bg'+i+'.png';
	bgImgs.push(imgTmp);
}

var mapMaxTick = [null];
var mapBoxes = [];
var mapNum = mapsMain.length-2;
for(var i = 1; i<mapsMain.length; i++){
	mapMaxTick.push(mapsMain[i].M_M_Tick);
	var bgimg = new Image();
	bgimg.src = 'client/img/'+mapsMain[i].M_Name+'.png';
	mapBoxes.push(new MapBox(mapsMain[i].M_ID, mapsMain[i].M_Max, mapsMain[i].M_Name, bgimg));
}
var scrollMin = -(mapBoxes[0].w*0.3+mapBoxes[0].id*(mapBoxes[0].w*1.1))*(mapBoxes.length-1);
var scrollMax = -300;

var endGame = function(){
	mousePos = [0,0];
	mousePosS = [0,0];
	mouseDown = false;
	scrollPos = -300;
	selfInfo = [0,0,0];
	staticBoxes = [];
	indicators = {};
	currentMap = 0;
	currentTick = 0;
	countDownBox = 0;
}

var showEnd = function(){
	stage = -1;
	buttons = [];
	buttons.push(new ButtonSt(400, 500, 'Return To Lobby'));
}

var drawGrid = function(){
	var offsetX = selfInfo[0]%64;
	var offsetY = selfInfo[1]%64;
	for(var i=0;i<=1024/64;i++){
		ctx.beginPath();
		ctx.rect(i*64-4-offsetX, 0, 8, 768);
		ctx.fillStyle = "#EEEEEE";
		ctx.fill();
		ctx.closePath();
	}
	for(var l=0;l<=768/64;l++){
		ctx.beginPath();
		ctx.rect(0, l*64-4-offsetY, 1024, 8);
		ctx.fillStyle = "#EEEEEE";
		ctx.fill();
		ctx.closePath();
	}
}

var drawTimeElapse = function(){
	var barL = width/2*(1-currentTick/mapMaxTick[currentMap]);
	var timeleft = parseInt((mapMaxTick[currentMap]-currentTick)/25)
	ctx.font = '45px Arial';
	ctx.beginPath();
	ctx.fillText(timeleft, width/2-20,height/20+62);
	ctx.closePath();
	ctx.beginPath();
	ctx.rect(width/2-width/4, height/20+24, width/2, 3);
	ctx.fillStyle = "#000000";
	ctx.fill();
	ctx.beginPath();
	ctx.rect(width/2-barL/2, height/20+24, barL, 3);
	ctx.fillStyle = "#999999";
	ctx.fill();
	ctx.beginPath();
	ctx.rect(width/2-barL/2, height/20, barL, 20);
	ctx.fillStyle = "#ACEF86";
	ctx.fill();
	ctx.closePath;
	ctx.beginPath();
	ctx.arc(width/2-barL/2,height/20+10,10,0,2*Math.PI);
	ctx.fill();
	ctx.closePath;
	ctx.beginPath();
	ctx.arc(width/2-barL/2+barL,height/20+10,10,0,2*Math.PI);
	ctx.fill();
	ctx.closePath;
}

var blitName = function(){
	ctx.beginPath();
	ctx.fillText(nameWarning,512-nameWarning.length*15/2,300);
	ctx.closePath();
	ctx.beginPath();
	ctx.drawImage(titleimg,260,100,520,150);
	ctx.closePath();
}

var blitMaplist = function(maps){
	for(var i = 0; i < maps[0].length-1; i++){
		var playerN = maps[0][i+1];
		var hover =  mapBoxes[i].hovered(mousePosS);
		mapBoxes[i].draw(playerN,hover,maps[1][i+1]);
	}
	for(var bindex in buttons){
		buttons[bindex].draw();
	}
}

var blitWaiting = function(maps){
	ctx.font = '30px Arial';
	ctx.fillStyle = '#000000';
	var strWait = "Still waiting for player to join, needing "+(maps[2]-maps[0])+" players";
	var strNumb = "Currently we've gotten " + maps[0] + " player(s)";
	var strStar = "So far " + maps[1] + " out of " + maps[0] + " player(s) want(s) to start anyways.";
	ctx.beginPath();
	ctx.fillText(strWait,width/2-strWait.length*13/2,300);
	ctx.fillText(strNumb,width/2-strNumb.length*15/2,350);
	ctx.fillText(strStar,width/2-strStar.length*13/2,400);
	ctx.closePath();
	for(indexB in buttons){
		buttons[indexB].draw();
	}
}

var blitWorld = function(objects){
	objects = Array.prototype.slice.call(objects, 0)
	if(mapsMain[currentMap].pin==false){
		drawGrid();
	}
	else{
		ctxbg.clearRect(0,0,1024,768);
		ctxbg.drawImage(bgImgs[currentMap],mapsMain[currentMap].pin[0]+width/2-selfInfo[0],mapsMain[currentMap].pin[1]+height/2-selfInfo[1]);
	}
	for(var i = 0; i<staticBoxes.length; i++){
		staticBoxes[i].draw(selfInfo);
	}
	for(var i = 0; i<objects.length; i++){
		if(objects[i].length == 3){
			ctx.save();
			ctx.translate(objects[i][0]+width/2-selfInfo[0], objects[i][1]+height/2-selfInfo[1]);
			ctx.rotate(objects[i][2]);
			ctx.beginPath();
			ctx.rect(-playerSide/2, -playerSide/2, playerSide, playerSide);
			ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();
			ctx.beginPath();
			ctx.rect(-playerSide/2+5, -playerSide/2+5, playerSide-10, playerSide-10);
			ctx.fillStyle = "#BBBBBB";
			ctx.fill();
			ctx.closePath();
			
			ctx.beginPath();
			ctx.rect(-playerSide/4, -playerSide/4, 3, 6);
			ctx.fillStyle = "#222222";
			ctx.fill();
			ctx.closePath();
			ctx.beginPath();
			ctx.rect(playerSide/4, -playerSide/4, 3, 6);
			ctx.fillStyle = "#222222";
			ctx.fill();
			ctx.closePath();
			ctx.beginPath();
			ctx.rect(-playerSide/5, playerSide/4, 2*playerSide/5, 3);
			ctx.fillStyle = "#222222";
			ctx.fill();
			ctx.closePath();
			ctx.restore();
		}
		else if(objects[i].length >= 5){
			switch(objects[i][3]){
				case 1:
					ctx.save();
					ctx.translate(objects[i][0]+width/2-selfInfo[0], objects[i][1]+height/2-selfInfo[1]);
					ctx.rotate(objects[i][2]);
					ctx.beginPath();
					ctx.fillStyle = objects[i][objects[i].length-1];
					ctx.rect(-objects[i][4]/2, -objects[i][5]/2, objects[i][4], objects[i][5]);
					ctx.fill();
					ctx.closePath();
					ctx.restore();
					break;
				case 2:
					ctx.save();
					ctx.translate(objects[i][0]+width/2-selfInfo[0], objects[i][1]+height/2-selfInfo[1]);
					ctx.rotate(objects[i][2]);
					ctx.beginPath();
					ctx.fillStyle = objects[i][objects[i].length-1];
					ctx.arc(0,0,objects[i][4],0,2*Math.PI);
					ctx.fill();
					ctx.closePath();
					ctx.restore();
					break;
				case 11:
					ctx.save();
					ctx.translate(objects[i][0]+width/2-selfInfo[0], objects[i][1]+height/2-selfInfo[1]);
					ctx.rotate(objects[i][2]);
					ctx.beginPath();
					ctx.drawImage(wallImgs[objects[i][objects[i].length-1]],-objects[i][4]/2,-objects[i][5]/2,objects[i][4],objects[i][5]);
					typeS = objects[i][objects[i].length-1];
					if(typeS==18){
						ctx.drawImage(shadeImgs[0],-objects[i][4]/2-17,-objects[i][5]/2-25);
					}
					ctx.closePath();
					ctx.restore();
					break;
				case 12:
					ctx.save();
					ctx.translate(objects[i][0]+width/2-selfInfo[0], objects[i][1]+height/2-selfInfo[1]);
					ctx.rotate(objects[i][2]);
					ctx.beginPath();
					ctx.drawImage(circleImgs[objects[i][objects[i].length-1]],-objects[i][4],-objects[i][4],objects[i][4]*2,objects[i][4]*2);
					ctx.closePath();
					ctx.restore();
					break;
			}
		}
	}
	for(var i in indicators){
		indicators[i].draw(selfInfo);
	}
	ctx.save();
	ctx.font = '21px Arial';
	ctx.translate(width/2,height/2);
	ctx.fillStyle = "#000000";
	ctx.rotate(selfInfo[2]);
	ctx.beginPath();
	ctx.fillText("you", -14, -30);
	ctx.closePath();
	ctx.restore();
	drawTimeElapse();
}

document.onkeydown = function(event){
	if(stage == 3){
		if (event.keyCode === 38) {
			socket.emit('keys', [0,true]);
		} if (event.keyCode === 40) {
			socket.emit('keys', [1,true]);
		} if (event.keyCode === 37) {
			socket.emit('keys', [2,true]);
		} if (event.keyCode === 39) {
			socket.emit('keys', [3,true]);
		}
	}
}

document.onkeyup = function(event){
	if(stage == 3){
		if (event.keyCode === 38) {
			socket.emit('keys', [0,false]);
		} if (event.keyCode === 40) {
			socket.emit('keys', [1,false]);
		} if (event.keyCode === 37) {
			socket.emit('keys', [2,false]);
		} if (event.keyCode === 39) {
			socket.emit('keys', [3,false]);
		}
	}
}

document.onmousedown = function(event){
	mouseDown = true;
	if(stage == 3){
		var mouseSend = [0,0];
		mouseSend[0] = mousePosS[0]-width/2+selfInfo[0];
		mouseSend[1] = mousePosS[1]-height/2+selfInfo[1];
		socket.emit('reqInd',mouseSend);
	}
	else if(stage == 1){
		for(var i = 0; i < mapBoxes.length; i++){
			var hover =  mapBoxes[i].hovered(mousePosS);
			if(hover){
				socket.emit('toMap', i+1);
			}
		}
		if(buttons != []){
			if(buttons[0].hovered(mousePosS)){
				buttons = [];
				stage = -2;
				helpIndex = 0;
			}
		}
	}
	else if(stage == -2){
		helpIndex++;
		if(helpIndex > 2){
			buttons = [];
			stage = 1;
			buttons.push(new ButtonSt(50,50,'How to play?'));
		}
	}
	else if(stage == 2){
		if(buttons[0].hovered(mousePosS)){
			socket.emit('back');
			buttons = [];
			stage = 1;
			buttons.push(new ButtonSt(50,50,'How to play?'));
		}
		if(buttons[1].hovered(mousePosS)){
			socket.emit('StarAny');
		}
	}
}

document.onmouseup = function(event){
	mouseDown = false;
}

document.onmousemove = function(event){
	var rect = ctelement.getBoundingClientRect();
	if(mouseDown&&stage==1){
		scrollPos += event.clientX - mousePos[0];
		if(scrollPos < scrollMin)
			scrollPos = scrollMin;
		if(scrollPos > scrollMax)
			scrollPos = scrollMax;
	}
	mousePos[0] = event.clientX;
	mousePos[1] = event.clientY;
	mousePosS[0] = Math.floor((event.clientX-rect.left)/(rect.right-rect.left)*width);
	mousePosS[1] = Math.floor((event.clientY-rect.top)/(rect.bottom-rect.top)*height);
}

nameForm.onsubmit = function(e){
	e.preventDefault();
	if(inputName.value != ''){
		if(inputName.value.length > 12){
			nameWarning = "The length of the name has to be no longer than 12 characters";
		}
		else{
			socket.emit('requestName', inputName.value);
		}
	}
	else{
		nameWarning = "Please enter a name";
	}
}

chatForm.onsubmit = function(e){
	e.preventDefault();
	if(chatInput.value != ''){
		socket.emit('sendMsgToServer', '-wo-'+chatInput.value);
		chatInput.value = '';
	}
}

localForm.onsubmit = function(e){
	e.preventDefault();
	if(localInput.value != ''){
		socket.emit('sendMsgToServer', '-ro-'+localInput.value);
		localInput.value = '';
	}
}

socket.on('name',function(){
	ctx.clearRect(0,0,width,height);
	blitName();
});

socket.on('nameRespond',function(data){
    if(data){
		nameInput.parentNode.removeChild(nameInput);
		stage = 1;
	}
	else{
		nameWarning = "Your name has already been taken";
	}
});

socket.on('waitingList',function(data){
	ctx.clearRect(0,0,width,height);
	if(stage == -1){
		ctx.font = '30px Arial';
		ctx.fillStyle = '#000000';
		var result = "You "+resultFinal+'!';
		ctx.beginPath();
		ctx.fillText(result,width/2-result.length*13/2,300);
		ctx.closePath();
		for(var i = 0; i<buttons.length; i++){
			buttons[i].draw();
		}
		if(buttons[0].hovered(mousePosS)&&mouseDown){
			stage=1;
			buttons = [];
			buttons.push(new ButtonSt(50,50,'How to play?'));
		}
	}
	else if(stage == -2){
		ctx.beginPath();
		ctx.drawImage(helps[helpIndex],115,75,800,520);
		ctx.closePath();
		ctx.font = '30px Arial';
		ctx.fillStyle = '#000000';
		ctx.beginPath();
		ctx.fillText('Click on the page to continue',320,620);
		ctx.closePath();
	}
	else{
		blitMaplist(data);
	}
});

socket.on('waiting',function(data){
	ctx.clearRect(0,0,width,height);
	blitWaiting(data);
});

socket.on('mapInfo',function(data){
	ctx.clearRect(0,0,width,height);
	blitWorld(data);
});

socket.on('result',function(data){
	ctx.clearRect(0,0,width,height);
	ctxbg.clearRect(0,0,width,height);
	resultFinal = data;
	endGame();
	showEnd();
});

socket.on('mapTick',function(data){
	currentTick = data;
});

socket.on('chstage',function(data){
	stage = data;
	buttons = [];
	if(stage == 1){
		buttons = [];
		buttons.push(new ButtonSt(50,50,'How to play?'));
	}
	if(stage == 2){
		buttons = [];
		buttons.push(new ButtonSt(800,700,'Back'));
		buttons.push(new ButtonSt(400,500,'Start Anyway'));
	}
});

socket.on('cmap',function(data){
	currentMap = data;
	mapsMain[data].L_Map();
});

socket.on('playerP',function(data){
	selfInfo = data;;
});

socket.on('count',function(data){
	countDownBox.info = data+' more seconds till you can start catching!';
});

socket.on('addInd',function(data){
	randId = Math.random();
	indicators[randId]=new HitIndicator(data[0], data[1], randId);
});

socket.on('addToChat',function(data){
    chatText.innerHTML += '<div>'+data+'</div>';
	chatText.scrollTop = chatText.scrollHeight;
});

socket.on('addToChatD',function(data){
    localText.innerHTML += '<div>'+data+'</div>';
	localText.scrollTop = localText.scrollHeight;
});

window.addEventListener('wheel', function(e) {
  if (e.deltaY < 0) {
    socket.emit('scroll', true);
  }
  if (e.deltaY > 0) {
    socket.emit('scroll', false);
  }
});

window.addEventListener("focus", function(event) {
	socket.emit('keys', [0,false]);
	socket.emit('keys', [1,false]);
	socket.emit('keys', [2,false]);
	socket.emit('keys', [3,false]);
});

