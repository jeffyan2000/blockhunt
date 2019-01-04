var M_ID = 4;

function getRandom(playersL){
	return playersL[Math.floor(Math.random()*playersL.length)];
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function drawStaticBox(x, y, maxSide, Bodies, World, worlds, thickness=20){
	wall1 = Bodies.rectangle(x,maxSide/2+y,maxSide,thickness,{isStatic:true});
	wall2 = Bodies.rectangle(x,-maxSide/2+y,maxSide,thickness,{isStatic:true});
	wall3 = Bodies.rectangle(maxSide/2+x,y,thickness,maxSide,{isStatic:true});
	wall4 = Bodies.rectangle(-maxSide/2+x,y,thickness,maxSide,{isStatic:true});
	World.add(worlds[M_ID],[wall1, wall2, wall3, wall4]);
}

function drawStaticGrid(x, y, maxSide, Bodies, World, worlds, thickness=20){
	World.add(worlds[M_ID],[
	Bodies.rectangle(maxSide/2+x,maxSide/3+y,thickness,maxSide/3,{isStatic:true}),
	Bodies.rectangle(maxSide/2+x,-maxSide/3+y,thickness,maxSide/3,{isStatic:true}),
	Bodies.rectangle(-maxSide/2+x,maxSide/3+y,thickness,maxSide/3,{isStatic:true}),
	Bodies.rectangle(-maxSide/2+x,-maxSide/3+y,thickness,maxSide/3,{isStatic:true}),
	Bodies.rectangle(maxSide/3+x,maxSide/2+y,maxSide/3,thickness,{isStatic:true}),
	Bodies.rectangle(maxSide/3+x,-maxSide/2+y,maxSide/3,thickness,{isStatic:true}),
	Bodies.rectangle(-maxSide/3+x,maxSide/2+y,maxSide/3,thickness,{isStatic:true}),
	Bodies.rectangle(-maxSide/3+x,-maxSide/2+y,maxSide/3,thickness,{isStatic:true})]);
}

module.exports = {
M_ID:M_ID,
M_Name:'Blockhunt Classic',
M_Max:10,
M_M_Tick:6000,
M_Pool:[['rect'],[[22]]],
S_Spawn:[8000, 8000],

L_Map:function(Bodies, World, worlds, MovableWall, MovableBall, MovableWallSp, MovableBallSp){
	waitwall1 = Bodies.rectangle(8000,8200,400,20,{isStatic:true});
	waitwall2 = Bodies.rectangle(8000,7800,400,20,{isStatic:true});
	waitwall3 = Bodies.rectangle(8200,8000,20,400,{isStatic:true});
	waitwall4 = Bodies.rectangle(7800,8000,20,400,{isStatic:true});
	World.add(worlds[M_ID],[waitwall1, waitwall2, waitwall3, waitwall4]);
	
	drawStaticBox(0,-700,2000, Bodies, World, worlds, thickness=40);
	drawStaticGrid(0,0,600, Bodies, World, worlds, thickness=40);
	
	//wood house
	for(var i = 0; i<9; i++){
		var ypos = -1600+i*75;
		World.add(worlds[M_ID],Bodies.rectangle(-900, ypos, 75, 75,{isStatic:true}));
	}
	
	for(var i = 0; i<9; i++){
		var ypos = -1600+i*75;
		World.add(worlds[M_ID],Bodies.rectangle(0, ypos, 75, 75,{isStatic:true}));
	}
	
	for(var i = 1; i<12; i++){
		var xpos = -900+i*75;
		World.add(worlds[M_ID],Bodies.rectangle(xpos, -1600, 75, 75,{isStatic:true}));
	}
	
	for(var i = 1; i<5; i++){
		var xpos = -900+i*75;
		World.add(worlds[M_ID],Bodies.rectangle(xpos, -1000, 75, 75,{isStatic:true}));
	}
	
	for(var i = 4; i>0; i--){
		var xpos = -i*75;
		World.add(worlds[M_ID],Bodies.rectangle(xpos, -1000, 75, 75,{isStatic:true}));
	}
	
	for(var i = 0; i<4; i++){
		for(var l = 0; l<3; l++){
			var bookshelf = new MovableWallSp(M_ID, -825+i*75, -1525+l*75, 75, 75, 'shelf'+i+''+l, 20, false, false);
			bookshelf.add();
		}
	}
	
	for(var i = 0; i<3; i++){
		var bookshelf = new MovableWallSp(M_ID, -825+i*75, -1075, 75, 75, 'furnace'+i, 19, false, false);
		bookshelf.add();
	}
	
	for(var i = 4; i>0; i--){
		var bookshelf = new MovableWallSp(M_ID, -75*i, -1075, 75, 75, 'craft'+i, 0, false, false);
		bookshelf.add();
	}
	
	for(var i = 0; i<2; i++){
		for(var l = -1; l<4; l++){
			var torch = new MovableWallSp(M_ID, -560+i*200, -800+l*200, 15, 75, 'torch'+i+''+l, 18, false, false);
			torch.add();
		}
	}
	
	for(var i = 0; i<8; i++){
		for(var l = -1; l<8; l++){
			if(i!=3&&i!=4&&getRandomArbitrary(0, 3)<=1){
				if(getRandomArbitrary(0, 2)<=1){
					var flower = new MovableWallSp(M_ID, -800+i*100, -800+l*100, 24, 32, 'flower'+i+''+l, 21, false, false);
					flower.add();
				}
				else{
					var flower = new MovableWallSp(M_ID, -800+i*100, -800+l*100, 56, 48, 'flower'+i+''+l, 22, false, false);
					flower.add();
				}
			}

		}
	}
	
	for(var i = 0; i<6; i++){
		for(var l = 0; l<6; l++){
			if(getRandomArbitrary(0, 3)<=1){
				var mine = new MovableWallSp(M_ID, 400+i*75, -500+l*75, 75, 75, 'mine'+i+''+l, parseInt(getRandomArbitrary(11, 15)), false, false);
				mine.add();
				//}
			}
		}
	}
	
	World.add(worlds[M_ID],[Bodies.rectangle(700,  -1400, 75, 75,{isStatic:true}),
	Bodies.rectangle(700, -1325, 75, 75,{isStatic:true}),
	Bodies.rectangle(700, -1475, 75, 75,{isStatic:true}),
	Bodies.rectangle(775, -1400, 75, 75,{isStatic:true}),
	Bodies.rectangle(625, -1400, 75, 75,{isStatic:true})]);
	
	var testBall = new MovableWallSp(M_ID, 700, -1225, 75, 75, 'leaf1', 15);
	testBall.add();
	var testBall = new MovableWallSp(M_ID, 700, -1575, 75, 75, 'leaf2', 15);
	testBall.add();
	var testBall = new MovableWallSp(M_ID, 600, -1325, 75, 75, 'leaf3', 15);
	testBall.add();
	var testBall = new MovableWallSp(M_ID, 800, -1325, 75, 75, 'leaf4', 15);
	testBall.add();
	var testBall = new MovableWallSp(M_ID, 600, -1475, 75, 75, 'leaf5', 15);
	testBall.add();
	var testBall = new MovableWallSp(M_ID, 800, -1475, 75, 75, 'leaf6', 15);
	testBall.add();
	
	var torch1 = new MovableWallSp(M_ID, -100, -1475, 15, 75, 'torch1', 18, false, false);
	torch1.add();
},
}