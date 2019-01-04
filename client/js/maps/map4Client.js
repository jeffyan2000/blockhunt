var map4 = {
	M_ID:4,
    M_Name:'Blockhunt Classic',
	//number of players to start the game
	M_Max:10,
	//maximum tick of the map
	M_M_Tick:6000,
	pin:[-1000, -1700],
	L_Map:function(){
	staticBoxes = [];
	countDownBox = new TextBox(8000,7700,0,'This is a countdown',"#000000");
	staticBoxes.push(countDownBox);
	staticBoxes.push(new StaticBox(8000,8200,400,20,0,"#000000"));
	staticBoxes.push(new StaticBox(8000,7800,400,20,0,"#000000"));
	staticBoxes.push(new StaticBox(8200,8000,20,400,0,"#000000"));
	staticBoxes.push(new StaticBox(7800,8000,20,400,0,"#000000"));
	
	//wood house
	for(var i = 1; i<8; i++){
		var ypos = -1600+i*75;
		staticBoxes.push(new StaticTexture(-900, ypos, 75, 75, 0, 3));
	}
	staticBoxes.push(new StaticTexture(-900, -1600, 75, 75, 0, 17));
	staticBoxes.push(new StaticTexture(-900, -1000, 75, 75, 0, 17));
	
	for(var i = 1; i<12; i++){
		var xpos = -900+i*75;
		staticBoxes.push(new StaticTexture(xpos, -1600, 75, 75, 0, 3));
	}
	staticBoxes.push(new StaticTexture(0, -1600, 75, 75, 0, 17));
	
	for(var i = 1; i<8; i++){
		var ypos = -1600+i*75;
		staticBoxes.push(new StaticTexture(0, ypos, 75, 75, 0, 3));
	}
	staticBoxes.push(new StaticTexture(0, -1000, 75, 75, 0, 17));
	
	for(var i = 1; i<4; i++){
		var xpos = -900+i*75;
		staticBoxes.push(new StaticTexture(xpos, -1000, 75, 75, 0, 3));
	}
	staticBoxes.push(new StaticTexture(-600, -1000, 75, 75, 0, 17));
	
	for(var i = 3; i>0; i--){
		var xpos = -i*75;
		staticBoxes.push(new StaticTexture(xpos, -1000, 75, 75, 0, 3));
	}
	staticBoxes.push(new StaticTexture(-300, -1000, 75, 75, 0, 17));
	
	staticBoxes.push(new StaticTexture(700, -1400, 75, 75, 0, 17));
	staticBoxes.push(new StaticTexture(700, -1325, 75, 75, 0, 16));
	staticBoxes.push(new StaticTexture(700, -1475, 75, 75, 0, 16));
	staticBoxes.push(new StaticTexture(775, -1400, 75, 75, Math.PI/2, 16));
	staticBoxes.push(new StaticTexture(625, -1400, 75, 75, Math.PI/2, 16));
	
	drawStaticBox(0,-700,2000,thickness=40);
	drawStaticGrid(0,0,600,"#000000",thickness=40);
},
};

function drawStaticBox(x, y, maxSide, thickness=20){
	staticBoxes.push(new StaticBox(x,maxSide/2+y,maxSide,thickness,0,"#000000"));
	staticBoxes.push(new StaticBox(x,-maxSide/2+y,maxSide,thickness,0,"#000000"));
	staticBoxes.push(new StaticBox(maxSide/2+x,y,thickness,maxSide,0,"#000000"));
	staticBoxes.push(new StaticBox(-maxSide/2+x,y,thickness,maxSide,0,"#000000"));
}

function drawStaticGrid(x, y, maxSide, color, thickness=20){
	staticBoxes.push(new StaticBox(maxSide/2+x,maxSide/3+y,thickness,maxSide/3,0,color));
	staticBoxes.push(new StaticBox(maxSide/2+x,-maxSide/3+y,thickness,maxSide/3,0,color));
	staticBoxes.push(new StaticBox(-maxSide/2+x,maxSide/3+y,thickness,maxSide/3,0,color));
	staticBoxes.push(new StaticBox(-maxSide/2+x,-maxSide/3+y,thickness,maxSide/3,0,color));
	
	staticBoxes.push(new StaticBox(maxSide/3+x,maxSide/2+y,maxSide/3,thickness,0,color));
	staticBoxes.push(new StaticBox(maxSide/3+x,-maxSide/2+y,maxSide/3,thickness,0,color));
	staticBoxes.push(new StaticBox(-maxSide/3+x,maxSide/2+y,maxSide/3,thickness,0,color));
	staticBoxes.push(new StaticBox(-maxSide/3+x,-maxSide/2+y,maxSide/3,thickness,0,color));
}