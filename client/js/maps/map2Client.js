var map2 = {
	M_ID:2,
    M_Name:'Classic',
	//number of players to start the game
	M_Max:10,
	//maximum tick of the map
	M_M_Tick:5000,
	pin:false,
	L_Map:function(){
	staticBoxes = [];
	countDownBox = new TextBox(8000,7700,0,'This is a countdown',"#000000");
	staticBoxes.push(countDownBox);
	staticBoxes.push(new StaticBox(8000,8200,400,20,0,"#000000"));
	staticBoxes.push(new StaticBox(8000,7800,400,20,0,"#000000"));
	staticBoxes.push(new StaticBox(8200,8000,20,400,0,"#000000"));
	staticBoxes.push(new StaticBox(7800,8000,20,400,0,"#000000"));
	
	drawStaticBox(0,0,2000);
	drawStaticGrid(0,0,300,"#000000", thickness=40);
	drawStaticGrid(0,0,500,"#000000", thickness=40);
	
	//area spliters
	staticBoxes.push(new StaticBox(700,100,600,40,0,"#000000"));
	staticBoxes.push(new StaticBox(700,-100,600,40,0,"#000000"));
	staticBoxes.push(new StaticBox(-700,100,600,40,0,"#000000"));
	staticBoxes.push(new StaticBox(-700,-100,600,40,0,"#000000"));
	staticBoxes.push(new StaticBox(100,700,40,600,0,"#000000"));
	staticBoxes.push(new StaticBox(100,-700,40,600,0,"#000000"));
	staticBoxes.push(new StaticBox(-100,700,40,600,0,"#000000"));
	staticBoxes.push(new StaticBox(-100,-700,40,600,0,"#000000"));
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