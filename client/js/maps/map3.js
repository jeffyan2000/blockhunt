var M_ID = 3;

module.exports = {
//the map id
M_ID:3,
//the map name
M_Name:'Texturetest',
//number of players to start the game
M_Max:3,
//maximum tick of the map
M_M_Tick:500,
//shape pool, in this case, the player can be spawn as a circle or rectangle with color A777D6, EBF235 or 00EA0F
M_Pool:[['rect'],[[0,1,2,3,4]]],
//seeker's spawn place
S_Spawn:[8000, 8000],

//the function to load map
L_Map:function(Bodies, World, worlds, MovableWall, MovableBall, MovableWallSp, MovableBallSp){
	//draw four stable walls for the seeker's waiting place
	//usuage('<>'is for the value(s) that you need to put in):
	// <wallname> = Bodies.rectangle(<x position>, <y position>, <width>, <height>, {isStatic:true});
	// the outside walls for boundries are usually static, so isStatic:true.
	waitwall1 = Bodies.rectangle(8000,8200,400,20,{isStatic:true});
	waitwall2 = Bodies.rectangle(8000,7800,400,20,{isStatic:true});
	waitwall3 = Bodies.rectangle(8200,8000,20,400,{isStatic:true});
	waitwall4 = Bodies.rectangle(7800,8000,20,400,{isStatic:true});
	// add the walls to the world
	World.add(worlds[M_ID],[waitwall1, waitwall2, waitwall3, waitwall4]);
	
	//draw four stable walls for the playground
	//usuage('<>'is for the value(s) that you need to put in):
	// <wallname> = Bodies.rectangle(<x position>, <y position>, <width>, <height>, {isStatic:true});
	// the outside walls for boundries are usually static, so isStatic:true.
	wall1 = Bodies.rectangle(0,200,400,20,{isStatic:true});
	wall2 = Bodies.rectangle(0,-200,400,20,{isStatic:true});
	wall3 = Bodies.rectangle(200,0,20,400,{isStatic:true});
	wall4 = Bodies.rectangle(-200,0,20,400,{isStatic:true});
	//add the walls to the world
	World.add(worlds[M_ID],[wall1, wall2, wall3, wall4]);
	
	testBall = new MovableBallSp(M_ID, 100, 100, 50, 'testBall', 0);
	testBall.add();
	
	testWall = new MovableWallSp(M_ID, -100, 100, 75, 75, 'testWall', 0);
	testWall.add();
},
}