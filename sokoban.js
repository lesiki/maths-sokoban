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
	objects = [],
	player,

	init = function() {
		sokoban.constants = new Constants(10, 600);

		var b = new sokoban.drawable.DeadBlock();
		b.putAt(3,2);

		player = new sokoban.drawable.Player();
		player.putAt(8,1);

		var t = new sokoban.drawable.Target(3);
		t.putAt(9,3);

		var m = new sokoban.drawable.MovableBlock(2);
		m.putAt(3,8);

		var plus = new sokoban.drawable.MathBlock('+', function() { console.log('plusss'); });
		plus.putAt(5,3);

		objects.push(b,player,t,m,plus);
		redraw();
		bindListeners();
	},
	redraw = function() {
		context.clearRect(0, 0, canvas.width, canvas.height);
		drawGridLines();
		for(var i = 0; i < objects.length; i++) {
			objects[i].draw();
		}
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
	move = function(direction) {
		if(direction === sokoban.constants.directions.UP) {
			player.putAt(player.gX, player.gY - 1);
		}
		else if(direction === sokoban.constants.directions.DOWN) {
			player.putAt(player.gX, player.gY + 1);
		}
		else if(direction === sokoban.constants.directions.LEFT) {
			player.putAt(player.gX - 1, player.gY);
		}
		else if(direction === sokoban.constants.directions.RIGHT) {
			player.putAt(player.gX + 1, player.gY);
		}
		redraw();
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
	};
	sokoban.drawable = {};
	sokoban.drawable.DeadBlock = function() {
		this.draw = function() {
			var gradient=context.createLinearGradient(0,0,600, 600);
			context.fillStyle=gradient;
			context.beginPath();
			gradient.addColorStop("0","#333");
			gradient.addColorStop("1","#555");
			context.moveTo(this.pX, this.pY);
			context.lineTo(this.pX + sokoban.constants.blockWidth, this.pY);
			context.lineTo(this.pX + sokoban.constants.blockWidth, this.pY + sokoban.constants.blockWidth);
			context.lineTo(this.pX, this.pY + sokoban.constants.blockWidth);
			context.lineTo(this.pX, this.pY);
			context.fill();
		};
	};
	sokoban.drawable.Player = function() {
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
		this.draw = function() {
			var gradient=context.createLinearGradient(0,0,600, 600);
			gradient.addColorStop("0","#794");
			gradient.addColorStop("1","#794");
			context.strokeStyle=gradient;
			context.lineWidth=3;
			context.beginPath();
			context.moveTo(this.pX, this.pY);
			context.lineTo(this.pX + sokoban.constants.blockWidth, this.pY);
			context.lineTo(this.pX + sokoban.constants.blockWidth, this.pY + sokoban.constants.blockWidth);
			context.lineTo(this.pX, this.pY + sokoban.constants.blockWidth);
			context.lineTo(this.pX, this.pY);
			context.stroke();
			context.closePath();
			context.beginPath();
			context.lineWidth=1.5;
			context.font="60px Sans-Serif";
			context.fillStyle = gradient;
			context.textAlign = 'center';
			context.textBaseline = 'middle';
			context.strokeText(this.value, this.pX + (sokoban.constants.blockWidth / 2), this.pY + (sokoban.constants.blockWidth / 2));
			context.closePath();
		};
	};
	sokoban.drawable.MovableBlock = function(val) {
		this.value = val;
		this.draw = function() {
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
	sokoban.drawable.MathBlock = function(symbol, applyOperand) {
		this.symbol = symbol;
		this.draw = function() {
			var gradient=context.createLinearGradient(0,0,600, 600);
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

$(function() {
	sokoban.game = new Sokoban();
});
