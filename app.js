var express = require('express');
var Matter = require('matter-js');
var app = express();
var serv = require('http').Server(app);

var maps = [null, 
		require('./client/js/maps/map1.js'), 
		require('./client/js/maps/map2.js'),
		require('./client/js/maps/map3.js'),
		require('./client/js/maps/map4.js')];

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));

serv.listen(3001);
console.log("server started!");

var SOCKET_LIST = {};
var PLAYER_LIST = {};

var mapSpawn = [0,0];
var seekerSpawn = [8000,8000];
var playerSide = 50;
var Engine = Matter.Engine,
	World = Matter.World,
	Body = Matter.Body,
	Bodies = Matter.Bodies;
	
var engine;
var world;
var TILE_LIST = {};
var mapWait = [null];
var mapMax = [0];
var mapTick = [null];
var mapMaxTick = [null];
var mapActive = [null];
var mapPools = [null];
var mapInfo = [null];
var mapStar = [null];
var engines = [null];
var worlds = [null];

for(var i = 1; i<maps.length; i++){
	mapWait.push(0);
	mapStar.push(0);
	mapMax.push(maps[i].M_Max);
	mapTick.push(0);
	mapMaxTick.push(maps[i].M_M_Tick);
	mapActive.push(false);
	mapPools.push(maps[i].M_Pool);
	mapInfo.push([]);
	engines.push(Engine.create());
	Engine.run(engines[i]);
	worlds.push(engines[i].world);
	worlds[i].gravity.y = 0;
}

var io = require('socket.io')(serv,{});

var clearMap = function(mapId){
	mapActive[mapId] = false;
	mapTick[mapId] = 0;
	for(var tileInd in TILE_LIST){
		var tiletmp = TILE_LIST[tileInd];
		if(tiletmp.currentMap == mapId){
			delete TILE_LIST[tileInd];
		}
	}
	World.clear(worlds[mapId], false);
}

var activeMap = function(mapId){
	mapActive[mapId] = true;
	maps[mapId].L_Map(Bodies, World, worlds, MovableWall, MovableBall, MovableWallSp, MovableBallSp);
	seekerSpawn = maps[mapId].S_Spawn;
}

var gameOver = function(mapId){
	if(mapTick[mapId] >= mapMaxTick[mapId]){
			return 2;
	}
	for(var i in PLAYER_LIST){
		if(PLAYER_LIST[i].currentMap == mapId){
			if(PLAYER_LIST[i].stats == 'hider'){
				return false;
			}
		}
	}
	return 3;
	
}

var updateMap = function(mapId){
	mapTick[mapId] += 1;
	var mapCond = gameOver(mapId);
	if(mapCond != false){
		//when the hiders win
		if(mapCond == 2){
			for(var i in PLAYER_LIST){
				if(PLAYER_LIST[i].currentMap == mapId){
					if(PLAYER_LIST[i].stats == 'hider'){
						PLAYER_LIST[i].toEnd('win');
					}
					else if(PLAYER_LIST[i].stats == 'seeker'){
						PLAYER_LIST[i].toEnd('lose');
					}
				}
			}
		}
		//when the seekers win
		if(mapCond == 3){
			for(var i in PLAYER_LIST){
				if(PLAYER_LIST[i].currentMap == mapId){
					if(PLAYER_LIST[i].stats == 'hider'){
						PLAYER_LIST[i].toEnd('lose');
					}
					else if(PLAYER_LIST[i].stats == 'seeker'){
						PLAYER_LIST[i].toEnd('win');
					}
				}
			}
		}
		clearMap(mapId);
	}
}

var updateAllMap = function(){
	for(var i = 1; i < mapActive.length; i++){
		if(mapActive[i]){
			updateMap(i);
		}
	}
}

var scaleDeme = function(deme, scale){
	var Tdeme = [false,false,false];
	for(var i = 0; i<deme.length; i++){
		if(deme[i] != false){
			Tdeme[i] = deme[i]*scale;
		}
	}
	return Tdeme;
}

var checkDeme = function(deme, scale){
	for(var i = 0; i<deme.length; i++){
		if(deme[i] != false){
			if(deme[i]*scale <= 150&&deme[i]*scale >= 25&&i!=2){
				return true;
			}
			if(deme[i]*scale <= 75&&deme[i]*scale >= 20&&i==2){
				return true;
			}
		}
	}
	return false;
}

var getRandom = function(playersL){
	return playersL[Math.floor(Math.random()*playersL.length)];
}

var genRandShape = function(mappool){
	var pool = mapPools[mappool];
	var randShape = getRandom(pool[0]);

	if(randShape == 'rect'){
		var color = genRandColor(pool, 'rect');
		var deme = [50,50];
		if(color == 18){
			deme = [10,50];
		}
		else if(color == 21){
			deme = [25,32];
		}
		else if(color == 22){
			deme = [28,25];
		}
		return [Bodies.rectangle(mapSpawn[0], mapSpawn[1],deme[0],deme[1]), 1, [deme[0],deme[1],false], color];
	}
	else if(randShape == 'circle'){
		var color = genRandColor(pool, 'circle');
		return [Bodies.circle(mapSpawn[0], mapSpawn[1],25), 2, [false,false,25], color];
	}
}

var genRandColor = function(pool,shape){
	var randColor = getRandom(pool[1][pool[0].indexOf(shape)]);
	return randColor;
}

var checkName = function(name){
	for(var i in PLAYER_LIST){
		var playerT = PLAYER_LIST[i];
		if(playerT.name == name){
			return false;
		}
	}
	return true;
}

var Player = function(id){
	var self = {
		body:false,
		id:id,
		inGame:false,
		waiting:false,
		finished:false,
		currentMap:0,
		joined:false,
		name:'Unnamed',
		result:false,
		up:false,
		down:false,
		left:false,
		right:false,
		color:false,
		stats:'hider',
		type:false,
		deme:[false,false,false],
		countDown:false,
		startAny:false,
		atkCoolDown:0,
	}
	self.creatBody = function(){
		if(self.stats == "seeker"){
			self.countDown=500;
			self.body = Bodies.rectangle(seekerSpawn[0], seekerSpawn[1],playerSide,playerSide);
			World.add(worlds[self.currentMap], self.body);
		}
		if(self.stats == "hider"){
			var randsha = genRandShape(self.currentMap);
			self.body = randsha[0];
			self.type = randsha[1];
			self.deme = randsha[2];
			self.color = randsha[3];
			if(Number.isInteger(self.color)){
				self.type += 10;
			}
			World.add(worlds[self.currentMap], self.body);
		}
	}
	self.getMapInfo = function(){
		if(self.stats == 'seeker'){
			return [self.body.position.x, self.body.position.y, self.body.angle];
		}
		else if(self.stats == 'hider'){
			switch(self.type){
				case 1:
				case 11:
					return [self.body.position.x, self.body.position.y, self.body.angle, self.type, self.deme[0], self.deme[1], self.color];
					break;
				case 2:
				case 12:
					return [self.body.position.x, self.body.position.y, self.body.angle, self.type, self.deme[2], self.color];
					break;
			}
		}
	}
	self.getRect = function(){
		if(self.type == 1||self.type == 11){
			return[self.body.position.x-self.deme[0]/2,self.body.position.y-self.deme[1]/2,self.body.position.x+self.deme[0]/2,self.body.position.y+self.deme[1]/2];
		}
		else if(self.type == 2||self.type == 12){
			return[self.body.position.x-self.deme[2],self.body.position.y-self.deme[2],self.body.position.x+self.deme[2],self.body.position.y+self.deme[2]];
		}
	}
	self.shouldRender = function(tileT){
		if(Math.abs(tileT[0]-self.body.position.x)<600&&Math.abs(tileT[1]-self.body.position.y)<500){
			return true;
		}
		return false;
	}
	self.collidePoint = function(x,y){
		var rectObj = self.getRect();
		if(x >= rectObj[0]&&x <= rectObj[2]){
			if(y >= rectObj[1]&&y <= rectObj[3]){
				return true;
			}
		}
		return false;
	}
	self.toWaiting = function(gameN){
		self.waiting = true;
		self.currentMap = gameN;
	}
	self.toGame = function(){
		self.creatBody();
		self.waiting = false;
		self.inGame = true;
		self.startAny = false;
	}
	self.toEnd = function(result){
		self.finished = true;
		self.inGame = false;
		self.result = result;
	}
	self.toSeek = function(){
		World.remove(worlds[self.currentMap], self.body);
		self.body = false;
		self.stats = "seeker"
		self.creatBody();
	}
	self.returnToLobby = function(){
		self.inGame = false;
		self.waiting = false;
		self.currentMap = 0;
		self.body = false;
		self.finished = false;
		self.color = false;
		self.stats='hider';
		self.type = false;
		self.deme = [false,false,false];
		self.countDown = false;
		self.atkCoolDown = 0;
		self.startAny = false;
	}
	self.updateVel = function(){
		if(self.body!=false){
			if(self.up){
				Body.setVelocity(self.body, {x:self.body.velocity.x, y:-3});
			}
			if(self.down){
				Body.setVelocity(self.body, {x:self.body.velocity.x, y:3});
			}
			if(self.left){
				Body.setVelocity(self.body, {x:-3, y:self.body.velocity.y});
			}
			if(self.right){
				Body.setVelocity(self.body, {x:3 , y:self.body.velocity.y});
			}
			if(self.countDown != false){
				self.countDown  = self.countDown - 1;
				if(self.countDown <= 0){
					self.countDown = false;
					Body.setPosition(self.body, {x:0,y:0});				
				}
			}
			if(self.atkCoolDown > 0){
				self.atkCoolDown -= 1;
			}
		}
	}
	return self;
}

var MovableWall = function(map,x,y,w,h,id,color,random=true){
	var self = {
		body:false,
		currentMap:map,
		id:id,
		type:1,
		w:w,
		h:h,
		random:random,
		color:color,
	}
	self.add = function(){
		if(self.random){
			self.body = Bodies.rectangle(x, y,w,h,{ angle: Math.random()*2*Math.PI });
		}
		else{
			self.body = Bodies.rectangle(x, y,w,h,{ angle: 0});
		}
		TILE_LIST[id] = self;
		World.add(worlds[self.currentMap], self.body);
	}
	self.remove = function(){
		delete TILE_LIST[self.id];
		delete self;
	}
	self.getMapInfo = function(){
		return [self.body.position.x, self.body.position.y, self.body.angle, self.type, self.w, self.h, self.color];
	}
	return self;
}

var MovableBall = function(map,x,y,r,id,color){
	var self = {
		body:false,
		currentMap:map,
		id:id,
		type:2,
		r:r,
		color:color,
	}
	self.add = function(){
		self.body = Bodies.circle(x, y,r);
		TILE_LIST[id] = self;
		World.add(worlds[self.currentMap], self.body);
	}
	self.remove = function(){
		delete TILE_LIST[self.id];
		delete self;
	}
	self.getMapInfo = function(){
		return [self.body.position.x, self.body.position.y, self.body.angle, self.type, self.r, self.color];
	}
	return self;
}

var MovableWallSp = function(map,x,y,w,h,id,txtid, stable=false, random=true){
	var self = {
		body:false,
		currentMap:map,
		id:id,
		type:11,
		w:w,
		h:h,
		txtid:txtid,
		stable:stable,
		random:random,
	}
	self.add = function(){
		if(self.random){
			self.body = Bodies.rectangle(x, y,w,h,{ angle: Math.random()*2*Math.PI , isStatic:self.stable});
		}
		else{
			self.body = Bodies.rectangle(x, y,w,h,{ angle: 0});
		}
		TILE_LIST[id] = self;
		World.add(worlds[self.currentMap], self.body);
	}
	self.remove = function(){
		delete TILE_LIST[self.id];
		delete self;
	}
	self.getMapInfo = function(){
		return [self.body.position.x, self.body.position.y, self.body.angle, self.type, self.w, self.h, self.txtid];
	}
	return self;
}

var MovableBallSp = function(map,x,y,r,id,txtid){
	var self = {
		body:false,
		currentMap:map,
		id:id,
		type:12,
		r:r,
		txtid:txtid,
	}
	self.add = function(){
		self.body = Bodies.circle(x, y,r);
		TILE_LIST[id] = self;
		World.add(worlds[self.currentMap], self.body);
	}
	self.remove = function(){
		delete TILE_LIST[self.id];
		delete self;
	}
	self.getMapInfo = function(){
		return [self.body.position.x, self.body.position.y, self.body.angle, self.type, self.r, self.txtid];
	}
	return self;
}

io.sockets.on('connection', function(socket){
	console.log("new player joined");
	console.log("socket connection established");
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;
	console.log("id generated as " + socket.id);
	
	var player = Player(socket.id);
    PLAYER_LIST[socket.id] = player;
	
	socket.on('disconnect',function(){
        delete SOCKET_LIST[socket.id];
		delete PLAYER_LIST[socket.id];
		console.log(socket.id + " left the game");
    });
	
	socket.on('keys',function(data){
        switch(data[0]){
			case 0:
				player.up = data[1];
				break;
			case 1:
				player.down = data[1];
				break;
			case 2:
				player.left = data[1];
				break;
			case 3:
				player.right = data[1];
				break;
		}
    });
	
	socket.on('requestName',function(data){
        if(checkName(data)){
			player.name = data;
			socket.emit("nameRespond", true);
			console.log(player.name + " joined the game");
			player.joined = true;
			socket.emit('chstage', 1);
			for(var i in SOCKET_LIST){
				SOCKET_LIST[i].emit('addToChat', player.name + " joined the game");
			}
		}
		else{
			socket.emit("nameRespond", false);
		}
    });
	
	socket.on('reqInd',function(data){
		if(player.atkCoolDown == 0&&player.stats == 'seeker'){
			player.atkCoolDown = 25;
			for(var i in SOCKET_LIST){
				var playerT = PLAYER_LIST[i];
				var socketT = SOCKET_LIST[i];
				if(playerT.currentMap == player.currentMap){
					if(playerT.stats == 'hider'&&playerT.collidePoint(data[0], data[1])){
						for(var it in SOCKET_LIST){
							if(PLAYER_LIST[it].currentMap == player.currentMap){
								SOCKET_LIST[it].emit('addToChat', playerT.name+' has been found by '+player.name);
							}
						}
						playerT.toSeek();
					}
					socketT.emit('addInd', data);
				}
			}
		}
    });
	
	socket.on('sendMsgToServer', function(data){
		if(data.substring(0, 4)=='-wo-'){
			data = data.substr(4);
			for(var i in SOCKET_LIST){
				SOCKET_LIST[i].emit('addToChat', player.name+':'+data);
			}
		}
		if(data.substring(0, 4)=='-ro-'){
			data = data.substr(4);
			for(var i in SOCKET_LIST){
				if(PLAYER_LIST[i].currentMap==player.currentMap){
					SOCKET_LIST[i].emit('addToChatD', player.name+':'+data);
				}
			}
		}
	});
	
	socket.on('scroll', function(data){
		if(player.stats == 'hider'){
			if(data){
				if(checkDeme(player.deme, 1.1)){
					Body.scale(player.body, 1.1, 1.1);
					player.deme = scaleDeme(player.deme, 1.1);
				}
			}
			else if(!data){
				if(checkDeme(player.deme, 0.9)){
					Body.scale(player.body, 0.9, 0.9);
					player.deme = scaleDeme(player.deme, 0.9);
				}
			}
		}
	});
	
	socket.on('StarAny', function(daa){
		player.startAny = !player.startAny;
		if(player.startAny!=false&&mapStar[player.currentMap]+1>=2&&mapStar[player.currentMap]+1 >= mapWait[player.currentMap]){
			activeMap(player.currentMap);
			var avaPlayers = [];
			var avaSockets = [];
			for(var i in SOCKET_LIST){
				var playerT = PLAYER_LIST[i];
				var socketT = SOCKET_LIST[i];
				if(playerT.currentMap == player.currentMap){
					avaPlayers.push(playerT);
					avaSockets.push(socketT);
				}
			}
			getRandom(avaPlayers).stats = 'seeker';
			for(var i = 0; i<avaPlayers.length; i++){
				avaPlayers[i].toGame();
				avaSockets[i].emit('chstage', 3);
				avaSockets[i].emit('cmap', player.currentMap);
			}
		}
	});
	
	socket.on('toMap',function(data){
		if(mapActive[data] == false){
		var flag = false;
		if(mapWait[data] < mapMax[data]){
			player.toWaiting(data);
			socket.emit('chstage', 2);
			flag = true;
		}
		if(mapWait[data]+1 >= mapMax[data]&&flag){
			activeMap(data);
			var avaPlayers = [];
			var avaSockets = [];
			for(var i in SOCKET_LIST){
				var playerT = PLAYER_LIST[i];
				var socketT = SOCKET_LIST[i];
				if(playerT.currentMap == data){
					avaPlayers.push(playerT);
					avaSockets.push(socketT);
				}
			}
			getRandom(avaPlayers).stats = 'seeker';
			for(var i = 0; i<avaPlayers.length; i++){
				avaPlayers[i].toGame();
				avaSockets[i].emit('chstage', 3);
				avaSockets[i].emit('cmap', data);
			}
		}
		}
    });
	
	socket.on('back',function(){
		player.returnToLobby();
    });
});

var sendPlayerInfoPack = function(){
	for(var i = 1; i < mapWait.length; i++){
		mapWait[i] = 0;
		mapInfo[i] = [];
		mapStar[i] = 0;
	}
	updateAllMap();
	for(var i in PLAYER_LIST){
		var player = PLAYER_LIST[i];
		player.updateVel();
		if(player.joined){
			if(player.waiting||player.inGame){
				mapWait[player.currentMap] += 1;
				if(player.startAny){
					mapStar[player.currentMap] += 1;
				}
			}
			if(player.inGame){
				mapInfo[player.currentMap].push(player.getMapInfo());
				SOCKET_LIST[i].emit("playerP", player.getMapInfo());
				if(player.stats == 'seeker'&&player.countDown != false){
					SOCKET_LIST[i].emit("count", Math.floor(player.countDown/25));
				}
			}
		}
	}
	for(tileIn in TILE_LIST){
		var tile = TILE_LIST[tileIn];
		mapInfo[tile.currentMap].push(tile.getMapInfo());
	}
	
	for(var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		var player = PLAYER_LIST[i];
		if(player.joined){
			if(!player.waiting&&!player.inGame&&!player.finished){
				socket.emit('waitingList', [mapWait, mapActive]);
			}
			if(player.waiting){
				socket.emit('waiting',[mapWait[player.currentMap],mapStar[player.currentMap],mapMax[player.currentMap]]);
			}
			if(player.inGame){
				var packPplayer = [];
				for(var tileObj in mapInfo[player.currentMap]){
					if(player.shouldRender(mapInfo[player.currentMap][tileObj])){
						packPplayer.push(mapInfo[player.currentMap][tileObj]);
					}
				}
				socket.emit('mapInfo',Buffer.from(packPplayer));
				socket.emit('mapTick', mapTick[player.currentMap]);
			}
			if(player.finished){
				socket.emit('result', player.result);
				player.returnToLobby();
			}
		}
		else{
			socket.emit('name');
		}
	}
}

setInterval(function(){
    sendPlayerInfoPack();
},1000/25);