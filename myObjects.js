/*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
 * Game classes
 * 
 * @author Tomasz Scislo <<ahref='mailto:scislot@gmail.com'>scislot@gmail.com</a>>
 * 
 * 
 ******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
"use strict";
var ElementTransformation = function(element, objName) {
		this.count=0;
		this.element=document.getElementById(element);
		this.suffix=15;
		
		this.timedTransform = function (timeout, type) {
			this.type=type;
			if(this.count==0) this.loop=window.setInterval(objName+".makeTransform()", timeout);
		};
		
		this.order=true;
		this.makeTransform = function () {
			var color;
			var bg;
			switch(this.type) {
			case "ERR":
				color="#FF0000";
				bg = '#FF' + this.suffix.toString(16) + this.suffix.toString(16) + this.suffix.toString(16) + this.suffix.toString(16);
				break;
			case "END":
				color="#FF00FF";
				bg = '#FF' + this.suffix.toString(16) + this.suffix.toString(16) + "FF";
				break;
			case "NRL":
				color="#000000";
				bg = '#FFF' + this.suffix.toString(16) + this.suffix.toString(16) + this.suffix.toString(16);
				break;
			}

			this.element.style.backgroundColor=bg;
				if(this.order)this.suffix--;
				else this.suffix++;
			if(this.suffix==0) this.order=false;
			if(this.suffix==15) this.order=true;
			this.count++;
			if(this.count != 0 && this.count>=61){
			this.count=0;
			this.suffix=15;
			window.clearInterval(this.loop);
			}
		};
};


var Player = function (type) {
	this.name;
	this.last_action;
	this.type=type;
	
	this.askName = function () {
		var name;
		while(Boolean(name)===false) {
			name=window.prompt("Player " + this.type + " name?");
			this.name=name;
		}
	};
	
	this.updatePlayerName = function () {
		document.getElementById("name" + this.type).innerHTML=this.name;
	};
	
	this.updateDate = function () {
		var date = new Date();
		date=date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + " " + date.getMilliseconds();
		document.getElementById("action" + this.type).innerHTML=date;
		this.last_action=date;
	};
};

//zaczyna gracz X
Player.prototype.turn=true;

var Board = function (playerX, playerO) {
	this.msg;
	this.elementsUsed=0;
	this.msgBoxElement;
	
	this.clearBoard = function () {
		var elementId;
		this.msgBoxElement = new ElementTransformation('msgBox', 'game.board.msgBoxElement');
		this.fields = new Array( new Array(3) , new Array(3), new Array(3));
		for(var i = 0; i<this.fields.length; i++) {
				for(var k = 0; k<this.fields.length; k++) {
					elementId=i.toString(10)+k.toString(10);
					// dostęp do elementu zgodny z DOM poziom 1
					if(document.getElementById(elementId).childNodes.length>0) document.getElementById(elementId).childNodes[0].nodeValue="";
				}
			}
	};
	
	this.setMsg = function (type, msg) {
		this.msgBoxElement.timedTransform(30, type);
		document.getElementById("msgBox").innerHTML=msg;
	};
	
	
	this.insertElement = function (element) {
		if(!this.checkIfCanPlace(element[0], element[1])) {
			this.setMsg("ERR", "You can't put your element here!");
			return true;
		} 
		this.fields[parseInt(element[0],10)][parseInt(element[1],10)]=((Player.prototype.turn) ? "X" : "O");
		document.getElementById(element).innerHTML=((Player.prototype.turn) ? "X" : "O");
		this.elementsUsed++;
		// sprawdzenie czy gra sie nie zakonczyla
			if(this.checkWinningCondition(element[0], element[1], ((Player.prototype.turn) ? "X" : "O"))) {
				this.setMsg("END", "GAME OVER! Winner: " + ((Player.prototype.turn) ? playerX.name : playerO.name) + ". Start New Game!");
				return false;
			} else if(this.elementsUsed==9) {
				this.setMsg("END", "GAME OVER! No one wins. Start New Game!");
				return false;
			}
			if(Player.prototype.turn) playerX.updateDate();
			else playerO.updateDate();
		Player.prototype.turn=!Player.prototype.turn;
		this.setMsg("NRL", "Next move " + ((Player.prototype.turn) ? "X" : "O"));
		return true;
	};
	
	this.checkIfCanPlace = function (a, b) {
		if(this.fields[parseInt(a,10)][parseInt(b,10)]===undefined) return true;
		else return false;
	};
	
	this.checkRow = function (type,a,b,par) {
		var flag = true;
		for(var i = 0; i<this.fields.length; i += 1) {
			if(par===true) {
				if(this.fields[2-i][i] != type) flag = false;
			} else if(a===undefined && b===undefined) {
				if(this.fields[i][i] != type) flag = false; 
			} else if(a===undefined) {
				if(this.fields[i][b] != type) flag = false; 
			} else if(b===undefined) {
				if(this.fields[a][i] != type) flag = false; 
			}
		};
		return flag;
	};
	
	this.checkWinningCondition = function (a, b, type) {
		if(this.checkRow(type, parseInt(a), undefined)) return true;
		if(this.checkRow(type, undefined, parseInt(b))) return true;
		if(this.checkRow(type, undefined, undefined)) return true;

		if((parseInt(a)%2==0 && parseInt(b)%2==0) || (parseInt(a)==1 && parseInt(b)==1)) {
			if(this.checkRow(type, undefined, undefined, true)) return true;
		}
		return false;
	};
	
	
	this.displayFields = function () {
		for(var i = 0; i<this.fields.length; i++) {
		console.log(this.fields[i]);
		}
	};
};

var Game = function () {
	this.gameEnd=false;
	
	this.startNewGame = function () {
		window.clearInterval(this.board.msgBoxElement.loop);
		if(window.confirm("Do you want to start a new Game?")) this.gameStart();
	};
	
	this.makeAMove = function (element) {
		if(!this.gameEnd && !this.board.insertElement(element)) {
			this.gameEnd=true;
			//this.startNewGame();
		} else if (this.gameEnd) this.startNewGame();
	};	
	
	this.gameStart = function () {
		this.gameEnd=false;
		this.playerX = new Player('X');
		this.playerX.askName();
		this.playerX.updatePlayerName();
		this.playerX.updateDate();
	
		this.playerO = new Player('O');
		this.playerO.askName();
		this.playerO.updatePlayerName();
		this.playerO.updateDate();
	
		this.board = new Board(this.playerX, this.playerO);
		this.board.clearBoard();
		this.board.setMsg("NRL", "Next move " + ((Player.prototype.turn) ? "X" : "O"));
	};
	
	this.gameStart();
	
};

var GameEnviroment = function () {

	this.addEventHandlers = function () {
		var i, k;
		for(i=0;i<3;i++) {
			for(k=0;k<3;k++) {
				this.addEventHandler(i.toString()+k.toString(), this.makeFuncionHandler(i.toString()+k.toString()));
			}
		}
		this.addEventHandler("start", function() {game.startNewGame();});
	};
	
	this.makeFuncionHandler = function (elementId) {
		return function () {
			game.makeAMove(elementId);
		};
	};
	
	this.addEventHandler = function (elementId, eventHandlerFunction) {
		if(document.addEventListener) {
			document.getElementById(elementId).addEventListener('click', eventHandlerFunction , false);
		} else if (document.attachEvent) {
			document.attachEvent('onclick', eventHandlerFunction);
		} else {
			document.onclick=eventHandlerFunction;
		}
	};
	
	this.addEventHandlers();
};

