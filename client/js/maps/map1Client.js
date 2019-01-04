var map1 = {
	M_ID:1,
    M_Name:'test',
	//number of players to start the game
	M_Max:3,
	//maximum tick of the map
	M_M_Tick:250,
	pin:false,
	L_Map:function(){
	staticBoxes = [];
	countDownBox = new TextBox(8000,7700,0,'This is a countdown',"#000000");
	staticBoxes.push(countDownBox);
	staticBoxes.push(new StaticBox(8000,8200,400,20,0,"#000000"));
	staticBoxes.push(new StaticBox(8000,7800,400,20,0,"#000000"));
	staticBoxes.push(new StaticBox(8200,8000,20,400,0,"#000000"));
	staticBoxes.push(new StaticBox(7800,8000,20,400,0,"#000000"));
	
	staticBoxes.push(new StaticBox(0,200,400,20,0,"#000000"));
	staticBoxes.push(new StaticBox(0,-200,400,20,0,"#000000"));
	staticBoxes.push(new StaticBox(200,0,20,400,0,"#000000"));
	staticBoxes.push(new StaticBox(-200,0,20,400,0,"#000000"));
},
};