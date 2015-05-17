var sokoban = { },
Constants = function(initialGridSize, initialCanvasWidth){
	this.gridSize = initialGridSize;
	this.blockWidth = initialCanvasWidth/initialGridSize,
	this.directions = {
		UP: 0,
		DOWN: 1,
		LEFT: 2,
		RIGHT: 3,
	};
},
Sokoban = function() {
	var canvas = document.getElementById('canvas'),
	context = canvas.getContext('2d'),
	objects,
	player,
	level,

	levelUp = function() {
		level = level + 1;
		if(level >= Levels.length) {
			$('div.instructions').html('<h1>Winner!</h1><p>More levels coming soon!</p>');
			$('div.instructions').append('<p class="meta">Built by Sitati. <a href="https://github.com/lesiki/maths-sokoban">View source on Github</a>.');
		}
		else {
			setUpLevel();
		}
	},
	putBlock = function(x, y, character) {
		var block;
		if(character === "#") {
			block = new sokoban.drawable.DeadBlock();
		}
		else if(character === "$") {
			block = new sokoban.drawable.Player();
			player = block;
		}
		else if(character === "+") {
			block = new sokoban.drawable.MathBlock('+', function(a,b) {
				return parseInt(a) + parseInt(b);
			});
		}
		else if(character === "-") {
			block = new sokoban.drawable.MathBlock('-', function(a,b) {
				return parseInt(a) - parseInt(b);
			});
		}
		else if(character === "*") {
			block = new sokoban.drawable.MathBlock('*', function(a,b) {
				return parseInt(a) * parseInt(b);
			});
		}
		else if(!isNaN(parseInt(character))) {
			block = new sokoban.drawable.MovableBlock(parseInt(character));
		}
		else if((97 <= character.charCodeAt(0)) && (character.charCodeAt(0) < 122)) {
			block = new sokoban.drawable.Target(character.charCodeAt(0) - 96);
		}
		if(typeof block !== 'undefined') {
			block.putAt(x, y);
			objects.push(block);
		}
	},
	getURLParameter = function(name) {
		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
	},
	setUpLevel = function() {
		objects = new Objects();
		var gridSize = Levels[level].layout.length
		for(y = 0; y < gridSize; y++) {
			row = Levels[level].layout[y];
			for(x = 0; x < gridSize; x++) {
				currentChar = row[x]
				putBlock(x, y, currentChar);
			}
		}
		$('.levelTitle').html("" + (level + 1) + " of " + Levels.length);
		if(Levels[level].title) {
			$('.levelTitle').append(": " + Levels[level].title);
		}
		if(Levels[level].showBasicInstructions) {
			$('.basicInstructions').show();
		}
		else {
			$('.basicInstructions').hide();
		}
		if(Levels[level].showAdvancedInstructions) {
			$('.advancedInstructions').show();
			$('.basicInstructions').addClass('dimmed');
		}
		else {
			$('.advancedInstructions').hide();
			$('.basicInstructions').removeClass('dimmed');
		}
		redraw();
	},

	init = function() {
		var x, y, row, currentChar;
		sokoban.constants = new Constants(10, 600);
		var levelInUrl = getURLParameter('g');
		if(levelInUrl !== null) {
			Levels = [
				{
					"title":"Tutorial 1",
					"showBasicInstructions":true,
					"layout": JSON.parse(levelInUrl)
				}
			];
		}
		level = 0;
		setUpLevel();
		bindListeners();
	},
	redraw = function() {
		context.clearRect(0, 0, canvas.width, canvas.height);
		drawGridLines();
		objects.drawAll();
	},
	drawGridLines = function() {
		var gradient=context.createLinearGradient(0,0,600, 600);
		gradient.addColorStop("0","#999");
		gradient.addColorStop("0.5","#aaa");
		gradient.addColorStop("1.0","#777");
		context.strokeStyle=gradient;
		context.lineWidth=0.5;
		for(var x = 600/sokoban.constants.gridSize; x < 600; x += 600/sokoban.constants.gridSize) {
			context.beginPath();
			context.moveTo(x, 0);
			context.lineTo(x, 600);
			context.stroke();
			context.closePath();
		}
		for(var y = 600/sokoban.constants.gridSize; y < 600; y += 600/sokoban.constants.gridSize) {
			context.beginPath();
			context.moveTo(0, y);
			context.lineTo(600, y);
			context.stroke();
			context.closePath();
		}
	},
	Objects = function() {
		var objectList = [];
		this.push = function(ob) {
			objectList.push(ob);
		};
		this.pop = function(ob) {
			// deletes object(s) at specified object's position
			// a math block with an operand shares same position as operand; both will be deleted
			var tempList = [];
			var currentObject;
			for(var i = 0; i < objectList.length; i ++) {
				currentObject = objectList[i];
				if((currentObject.gX !== ob.gX) || (currentObject.gY !== ob.gY)) {
					tempList.push(currentObject);
				}
			}
			objectList = tempList;
		};
		this.isLevelComplete = function() {
			var currentObject;
			for(var i = 0; i < objectList.length; i ++) {
				currentObject = objectList[i];
				if(currentObject.type === 'moveableblock') {
					return false;
				}
				else if(currentObject.type === 'target' && !currentObject.satisfied) {
					return false;
				}
			}
			return true;
		};
		this.list = function() {
			return objectList;
		};
		this.objAt = function(x, y) {
			// returns the object at the specified position.
			// when a mathblock has an operand, the returned object is the mathblock.
			// the operand can be accessed from block.operand
			var currentObject;
			for(var i = 0; i < objectList.length; i ++) {
				currentObject = objectList[i];
				if(currentObject.gX === x && currentObject.gY === y) {
					if(currentObject.type === 'movableblock' && currentObject.isOperand) {
						//skip, so that the mathblock is returned instead
					}
					else {
						return currentObject;
					}
				}
			}
			return undefined;
		};
		this.drawAll = function() {
			for(var i = 0; i < objectList.length; i ++) {
				objectList[i].draw();
			}
		};
	};
	move = function(direction) {
		var newX = player.gX, newY = player.gY, pushTargetX = player.gX, pushTargetY = player.gY, objectAtNewPos, objectAtPushTarget, mathResultBlock;
		if(direction === sokoban.constants.directions.UP) {
			newY = newY - 1;
			pushTargetY = newY - 1;
		}
		else if(direction === sokoban.constants.directions.DOWN) {
			newY = newY + 1;
			pushTargetY = newY + 1;
		}
		else if(direction === sokoban.constants.directions.LEFT) {
			newX = newX - 1;
			pushTargetX = newX - 1;
		}
		else if(direction === sokoban.constants.directions.RIGHT) {
			newX = newX + 1;
			pushTargetX = newX + 1;
		}
		if(!((newX >= 0) && (newY >=0) && (newX < sokoban.constants.gridSize) && (newY < sokoban.constants.gridSize))) {
			// don't allow user to go off grid
			return;
		}
		objectAtNewPos = objects.objAt(newX, newY);
		objectAtPushTarget = objects.objAt(pushTargetX, pushTargetY);
		if(typeof objectAtNewPos === 'undefined') {
			// empty space, move on
			player.putAt(newX, newY);
			redraw();
			return;
		}
		else {
			if(objectAtNewPos.type === 'deadblock') {
				return;
			}
			else if(objectAtNewPos.type === 'target') {
				return;
			}
			else if(objectAtNewPos.type === 'target') {
				return;
			}
			else if(objectAtNewPos.type === 'mathblock') {
				return;
			}
		}
		// Player is trying to push a moveable block
		if(!((pushTargetX >= 0) && (pushTargetY >=0) && (pushTargetX < sokoban.constants.gridSize) && (pushTargetY < sokoban.constants.gridSize))) {
			// don't allow user to push moveable block off grid
			return;
		}
		if(typeof objectAtPushTarget === 'undefined') {
			// empty space, allow push
			objectAtNewPos.putAt(pushTargetX, pushTargetY);
			player.putAt(newX, newY);
			redraw();
			return;
		}
		if(objectAtPushTarget.type === 'target' && !objectAtPushTarget.satisfied) {
			if(objectAtPushTarget.value === objectAtNewPos.value) {
				// success, mark target as happy and delete moveable block
				objectAtPushTarget.satisfied = true;
				objects.pop(objectAtNewPos);
				player.putAt(newX, newY);
				redraw();
				checkForWin();
				return;
			}
		}
		if(objectAtPushTarget.type === 'mathblock') {
			if(objectAtPushTarget.hasOperand) {
				// TODO
				mathResultBlock = new sokoban.drawable.MovableBlock();
				mathResultBlock.value = objectAtPushTarget.applyOperation(objectAtNewPos);
				objects.pop(objectAtPushTarget);
				objects.pop(objectAtNewPos);
				mathResultBlock.putAt(pushTargetX, pushTargetY);
				objects.push(mathResultBlock);
				player.putAt(newX, newY);
				redraw();
				return;
			}
			else {
				objectAtPushTarget.hasOperand = true;
				objectAtPushTarget.operand = objectAtNewPos;
				objectAtNewPos.putAt(pushTargetX, pushTargetY);
				objectAtNewPos.isOperand = true;
				player.putAt(newX, newY);
				redraw();
				return;
			}
		}
	},
	checkForWin = function() {
		if(objects.isLevelComplete()) {
			$('#canvas').addClass('victory');
			window.setTimeout(function() {
				$('#canvas').removeClass('victory');
				levelUp();
			},800);
		}
	},
	navigationKeypressHandler = function(e) {
		if(e.which === 119) {
			move(sokoban.constants.directions.UP);
		}
		else if(e.which === 115) {
			move(sokoban.constants.directions.DOWN);
		}
		else if(e.which === 97) {
			move(sokoban.constants.directions.LEFT);
		}
		else if(e.which === 100) {
			move(sokoban.constants.directions.RIGHT);
		}
	},
	bindListeners = function() {
		$(document).keypress(navigationKeypressHandler);
		$('#reset').click(function() { setUpLevel(); $(this).blur();});
	};
	sokoban.drawable = {};
	sokoban.drawable.DeadBlock = function() {
		this.type = 'deadblock';
		this.draw = function() {
			var gradient=context.createLinearGradient(0,0,600, 600);
			context.fillStyle=gradient;
			context.beginPath();
			gradient.addColorStop("0","#333");
			gradient.addColorStop("1","#333");
			context.moveTo(this.pX, this.pY);
			context.lineTo(this.pX + sokoban.constants.blockWidth, this.pY);
			context.lineTo(this.pX + sokoban.constants.blockWidth, this.pY + sokoban.constants.blockWidth);
			context.lineTo(this.pX, this.pY + sokoban.constants.blockWidth);
			context.lineTo(this.pX, this.pY);
			context.fill();
		};
	};
	sokoban.drawable.Player = function() {
		this.type='player';
		this.draw = function() {
			var gradient=context.createLinearGradient(0,0,600, 600);
			context.fillStyle=gradient;
			context.beginPath();
			gradient.addColorStop("0","#933");
			gradient.addColorStop("1","#933");
			context.moveTo(this.pX, this.pY);
			context.lineTo(this.pX + sokoban.constants.blockWidth, this.pY);
			context.lineTo(this.pX + sokoban.constants.blockWidth, this.pY + sokoban.constants.blockWidth);
			context.lineTo(this.pX, this.pY + sokoban.constants.blockWidth);
			context.lineTo(this.pX, this.pY);
			context.fill();
		};
	};
	sokoban.drawable.Target = function(val) {
		this.value = val;
		this.type = 'target';
		this.satisfied = false;
		this.draw = function() {
			var gradient=context.createLinearGradient(0,0,600, 600);
			if(this.satisfied) {
				gradient.addColorStop("0","#fc0");
				gradient.addColorStop("1","#fc0");
			}
			else {
				gradient.addColorStop("0","#794");
				gradient.addColorStop("1","#794");
			}
			context.strokeStyle=gradient;
			context.fillStyle=gradient;
			context.lineWidth=3;
			context.beginPath();
			context.moveTo(this.pX, this.pY);
			context.lineTo(this.pX + sokoban.constants.blockWidth, this.pY);
			context.lineTo(this.pX + sokoban.constants.blockWidth, this.pY + sokoban.constants.blockWidth);
			context.lineTo(this.pX, this.pY + sokoban.constants.blockWidth);
			context.lineTo(this.pX, this.pY);
			context.stroke();
			if(this.satisfied) {
				context.fill();
				context.closePath();
				gradient.addColorStop("0","#fff");
				gradient.addColorStop("1","#fff");
				context.fillStyle = gradient;
			}
			else {
				context.closePath();
			}
			context.beginPath();
			context.lineWidth=1.5;
			context.font="60px Sans-Serif";
			context.fillStyle = gradient;
			context.textAlign = 'center';
			context.textBaseline = 'middle';
			if(this.satisfied) {
				context.fillText(this.value, this.pX + (sokoban.constants.blockWidth / 2), this.pY + (sokoban.constants.blockWidth / 2));
			}
			else {
				context.strokeText(this.value, this.pX + (sokoban.constants.blockWidth / 2), this.pY + (sokoban.constants.blockWidth / 2));
			}
			context.closePath();
		};
	};
	sokoban.drawable.MovableBlock = function(val) {
		this.value = val;
		this.type = 'movableblock';
		this.isOperand = false;
		this.draw = function() {
			if(this.isOperand) {
				//delegate draw to math block
				return;
			}
			var gradient=context.createLinearGradient(0,0,600, 600);
			gradient.addColorStop("0","#794");
			gradient.addColorStop("1","#794");
			context.fillStyle=gradient;
			context.lineWidth=3;
			context.beginPath();
			context.moveTo(this.pX, this.pY);
			context.lineTo(this.pX + sokoban.constants.blockWidth, this.pY);
			context.lineTo(this.pX + sokoban.constants.blockWidth, this.pY + sokoban.constants.blockWidth);
			context.lineTo(this.pX, this.pY + sokoban.constants.blockWidth);
			context.lineTo(this.pX, this.pY);
			context.fill();
			context.closePath();
			gradient.addColorStop("0","#fff");
			gradient.addColorStop("1","#fff");
			context.beginPath();
			context.lineWidth=1.5;
			context.font="60px Sans-Serif";
			context.fillStyle = gradient;
			context.textAlign = 'center';
			context.textBaseline = 'middle';
			context.fillText(this.value, this.pX + (sokoban.constants.blockWidth / 2), this.pY + (sokoban.constants.blockWidth / 2));
			context.closePath();
		};
	};
	sokoban.drawable.MathBlock = function(symbol, operation) {
		this.symbol = symbol;
		this.type = 'mathblock';
		this.hasOperand = false;
		this.operation = operation;
		this.operand;
		this.applyOperation = function(otherBlock) {
			return this.operation(this.operand.value, otherBlock.value);
		}
		this.draw = function() {
			var gradient=context.createLinearGradient(0,0,600, 600);
			if(this.hasOperand) {
				gradient.addColorStop("0","#ebe");
				gradient.addColorStop("1","#ebe");
				context.strokeStyle=gradient;
				context.fillStyle=gradient;
				context.lineWidth=3;
				context.beginPath();
				context.moveTo(this.pX, this.pY);
				context.lineTo(this.pX + sokoban.constants.blockWidth, this.pY);
				context.lineTo(this.pX + sokoban.constants.blockWidth, this.pY + sokoban.constants.blockWidth);
				context.lineTo(this.pX, this.pY + sokoban.constants.blockWidth);
				context.lineTo(this.pX, this.pY);
				context.fill();
				context.closePath();
				gradient=context.createLinearGradient(0,0,600, 600);
				gradient.addColorStop("0","#fff");
				gradient.addColorStop("1","#fff");
				context.beginPath();
				context.lineWidth=1.5;
				context.font="20px Sans-Serif";
				context.fillStyle = gradient;
				context.textAlign = 'center';
				context.textBaseline = 'middle';
				context.fillText(this.operand.value + '' + this.symbol + '_', this.pX + (sokoban.constants.blockWidth / 2), this.pY + (sokoban.constants.blockWidth / 2));
				context.closePath();
			}
			else {
				gradient.addColorStop("0","#bbd");
				gradient.addColorStop("1","#bbd");
				context.strokeStyle=gradient;
				context.fillStyle=gradient;
				context.lineWidth=3;
				context.beginPath();
				context.moveTo(this.pX, this.pY);
				context.lineTo(this.pX + sokoban.constants.blockWidth, this.pY);
				context.lineTo(this.pX + sokoban.constants.blockWidth, this.pY + sokoban.constants.blockWidth);
				context.lineTo(this.pX, this.pY + sokoban.constants.blockWidth);
				context.lineTo(this.pX, this.pY);
				context.fill();
				context.closePath();
				gradient=context.createLinearGradient(0,0,600, 600);
				gradient.addColorStop("0","#fff");
				gradient.addColorStop("1","#fff");
				context.beginPath();
				context.lineWidth=1.5;
				context.font="60px Sans-Serif";
				context.fillStyle = gradient;
				context.textAlign = 'center';
				context.textBaseline = 'middle';
				context.fillText(this.symbol, this.pX + (sokoban.constants.blockWidth / 2), this.pY + (sokoban.constants.blockWidth / 2));
				context.closePath();
			}
		};
	};
	sokoban.drawable.DeadBlock.prototype = Drawable.prototype;
	sokoban.drawable.Player.prototype = Drawable.prototype;
	sokoban.drawable.Target.prototype = Drawable.prototype;
	sokoban.drawable.MovableBlock.prototype = Drawable.prototype;
	sokoban.drawable.MathBlock.prototype = Drawable.prototype;
	init();
},
Drawable = function() { };
Drawable.prototype.putAt = function(x, y) {
	this.gX = x;
	this.gY = y;
	this.pX = x * sokoban.constants.blockWidth;
	this.pY = y * sokoban.constants.blockWidth;
};
Drawable.prototype.type = 'drawable';

$(function() {
	sokoban.game = new Sokoban();
});
