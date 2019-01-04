function MapBox(id, maxP, name, txtu){
	this.w = 500;
	this.h = 300;
	this.id = id;
	this.bgc = txtu;
	this.posX = this.w*0.1+this.id*(this.w*1.1);
	this.posY = 100;
	this.color1u = "#93A09F";
	this.color2u = "#E3F2EA";
	this.color1a = "#9EA587";
	this.color2a = "#EFDFC6";
	this.wordC = "#444444";
	this.cover = null;
	this.maxP = maxP;
	this.name = name;
	this.cond = 'Waiting...';
	
	this.draw = function(player, hover, ingame){
		if(ingame){
			this.cond = 'In Game';
		}
		else{
			this.cond = 'Waiting...';
		}
		this.posX = this.w*0.1+this.id*(this.w*1.1)+scrollPos;
		var center = this.posX + this.w/2;
		var playersStr = player+"/"+this.maxP+" players";
		var color1 = this.color1u;
		var color2 = this.color2u;
		if(hover){
			color1 = this.color1a;
			color2 = this.color2a;
		}
		ctx.beginPath();
		ctx.rect(this.posX-5, this.posY-5, this.w+10, this.h+10);
		ctx.fillStyle = color1;
		ctx.fill();
		ctx.closePath();
		
		ctx.beginPath();
		ctx.drawImage(this.bgc,this.posX, this.posY);
		ctx.closePath();
		
		ctx.beginPath();
		ctx.font = '40px Arial';
		ctx.fillStyle = this.wordC;
		ctx.fillText(this.name, center - this.name.length*19/2, this.posY+this.h/6);
		ctx.closePath();
		
		ctx.beginPath();
		ctx.font = '30px Arial';
		ctx.fillStyle = this.wordC;
		ctx.fillText(this.cond, center - this.cond.length*14/2, this.posY+(this.h/6)*2);
		ctx.closePath();
		
		ctx.beginPath();
		ctx.font = '30px Arial';
		ctx.fillStyle = this.wordC;
		ctx.fillText(playersStr, center - playersStr.length*14/2, this.posY+(this.h/6)*3);
		ctx.closePath();
	}
	
	this.hovered = function(mousePos){
		this.posX = this.w*0.1+this.id*(this.w*1.1)+scrollPos;
		if(mousePos[0] < this.posX+this.w&&mousePos[0] > this.posX){
			if(mousePos[1] < this.posY+this.h&&mousePos[1] > this.posY){
				return true;
			}
		}
		return false;
	}
}

function ButtonSt(x,y,txt){
	this.w = txt.length*15+10;
	this.h = 30+10;
	this.posX = x;
	this.posY = y;
	this.txt = txt;
	
	this.draw = function(){
		if(this.hovered(mousePosS)){
			ctx.font = '30px Arial';
			ctx.fillStyle = '#6EFF26';
			ctx.fillText(txt, this.posX+5, this.posY+5);
		}
		else{
			ctx.font = '30px Arial';
			ctx.fillStyle = '#507041';
			ctx.fillText(txt, this.posX+5, this.posY+5);
		}
	}
	this.hovered = function(mousePos){
		if(mousePos[0] < this.posX+this.w&&mousePos[0] > this.posX){
			if(mousePos[1] < this.posY-this.h+12+this.h&&mousePos[1] > this.posY-this.h+10){
				return true;
			}
		}
		return false;
	}
}

function StaticBox(x,y,w,h,ang,color){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.color = color;
	this.ang = ang;
	this.draw = function(relPosition){
		ctx.save();
		ctx.translate(this.x-relPosition[0]+width/2, this.y-relPosition[1]+height/2);
		ctx.rotate(this.ang);
		ctx.beginPath();
		ctx.rect(-this.w/2, -this.h/2, this.w, this.h);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	}
}

function StaticTexture(x,y,w,h,ang,txt){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.txt = wallImgs[txt];
	this.ang = ang;
	this.draw = function(relPosition){
		ctx.save();
		ctx.translate(x-relPosition[0]+width/2, y-relPosition[1]+height/2);
		ctx.rotate(this.ang);
		ctx.beginPath();
		ctx.drawImage(this.txt,-this.w/2, -this.h/2, this.w, this.h);
		ctx.closePath();
		ctx.restore();
	}
}

function TextBox(x,y,ang,info,color){
	this.x = x;
	this.y = y;
	this.color = color;
	this.ang = ang;
	this.info = info;
	this.draw = function(relPosition){
		ctx.font = '30px Arial';
		ctx.fillStyle = this.color;
		ctx.save();
		ctx.translate(this.x-relPosition[0]+width/2, this.y-relPosition[1]+height/2);
		ctx.rotate(this.ang);
		ctx.beginPath();
		ctx.fillText(this.info,-this.info.length*15/2,0);
		ctx.closePath();
		ctx.restore();
	}
}

function HitIndicator(x,y,id){
	this.x = x;
	this.y = y;
	this.id = id;
	this.tick = 1;
	this.maxTick = 64;
	this.draw = function(relPosition){
		ctx.font = '30px Arial';
		ctx.beginPath();
		ctx.fillText("Here?",this.x+width/2-selfInfo[0]-35,this.y+height/2-selfInfo[1]-30);
		ctx.closePath();
		ctx.save();
		ctx.translate(this.x+width/2-selfInfo[0], this.y+height/2-selfInfo[1]);
		ctx.beginPath();
		ctx.arc(0,0,parseInt(this.tick*1.5),0,2*Math.PI);
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
		this.tick=this.tick*2;
		if(this.tick >= this.maxTick){
			delete indicators[this.id];
			delete this;
		}
	}
}