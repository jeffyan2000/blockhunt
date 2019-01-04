var M_ID = 2;
var M_Pool = [['circle','rect'],['#97BEFC','#3FF479','#6100FF','#1DAA72','#7FCC2C']];
var M_Pool2 = [['circle','rect'],[['#97BEFC','#3FF479','#6100FF','#1DAA72','#7FCC2C'],['#97BEFC','#3FF479','#6100FF','#1DAA72','#7FCC2C']]];

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
M_Name:'test',
M_Max:10,
M_M_Tick:5000,
M_Pool:M_Pool2,
S_Spawn:[8000, 8000],

L_Map:function(Bodies, World, worlds, MovableWall, MovableBall, MovableBallSp){
	waitwall1 = Bodies.rectangle(8000,8200,400,20,{isStatic:true});
	waitwall2 = Bodies.rectangle(8000,7800,400,20,{isStatic:true});
	waitwall3 = Bodies.rectangle(8200,8000,20,400,{isStatic:true});
	waitwall4 = Bodies.rectangle(7800,8000,20,400,{isStatic:true});
	World.add(worlds[M_ID],[waitwall1, waitwall2, waitwall3, waitwall4]);
	
	drawStaticBox(0,0,2000, Bodies, World, worlds);
	drawStaticGrid(0,0,300, Bodies, World, worlds, thickness=40);
	drawStaticGrid(0,0,500, Bodies, World, worlds, thickness=40);
	
	//area spliters
	World.add(worlds[M_ID],[Bodies.rectangle(700,100,600,40,{isStatic:true}),
	Bodies.rectangle(700,-100,600,40,{isStatic:true}),
	Bodies.rectangle(-700,100,600,40,{isStatic:true}),
	Bodies.rectangle(-700,-100,600,40,{isStatic:true}),
	Bodies.rectangle(100,700,40,600,{isStatic:true}),
	Bodies.rectangle(100,-700,40,600,{isStatic:true}),
	Bodies.rectangle(-100,700,40,600,{isStatic:true}),
	Bodies.rectangle(-100,-700,40,600,{isStatic:true})]);
	//bottom-right
	for(var i = 0; i < getRandomArbitrary(4,8); i++){
		var ABall = new MovableBall(M_ID, getRandomArbitrary(950, 300), getRandomArbitrary(950, 300), getRandomArbitrary(40,100), 'sec4'+i, getRandom(M_Pool[1]));
		ABall.add();
	}
	//bottom-left
	for(var i = 0; i < getRandomArbitrary(4,8); i++){
		var side = getRandomArbitrary(40,100);
		var AWall = new MovableWall(M_ID, getRandomArbitrary(-300, -950), getRandomArbitrary(950, 300), side,side, 'sec3'+i, getRandom(M_Pool[1]));
		AWall.add();
	}
	//top-right
	for(var i = 0; i < getRandomArbitrary(2,4); i++){
		var side = getRandomArbitrary(40,100);
		var ABall = new MovableBall(M_ID, getRandomArbitrary(950, 300), getRandomArbitrary(-950, -300), getRandomArbitrary(40,100), 'sec2c'+i, getRandom(M_Pool[1]));
		ABall.add();
		var AWall = new MovableWall(M_ID, getRandomArbitrary(950, 300), getRandomArbitrary(-950, -300), side, side, 'sec2s'+i, getRandom(M_Pool[1]));
		AWall.add();
	}
	//top-left
	for(var i = 0; i < getRandomArbitrary(3,8); i++){
		ABall = new MovableBall(M_ID, getRandomArbitrary(-950, -300), getRandomArbitrary(-950, -300), getRandomArbitrary(40,80), 'sec1'+i, getRandom(M_Pool[1]));
		ABall.add();
	}
},
}