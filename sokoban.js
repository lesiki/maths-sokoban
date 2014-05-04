var sokoban = { },
Constants = function(initialGridSize, initialCanvasWidth){
	this.gridSize = initialGridSize;
	this.blockWidth = initialCanvasWidth/initialGridSize;
},
Sokoban = function() {
	var canvas = document.getElementById('canvas'),
	context = canvas.getContext('2d'),

	init = function() {
		sokoban.constants = new Constants(10, 600);
		drawGridLines();

		var b = new sokoban.drawable.DeadBlock();
		b.putAt(3,2);
		b.draw();

		var p = new sokoban.drawable.Player();
		p.putAt(8,1);
		p.draw();

		var t = new sokoban.drawable.Target(3);
		t.putAt(9,3);
		t.draw();

		var m = new sokoban.drawable.MovableBlock(2);
		m.putAt(3,8);
		m.draw();

		var plus = new sokoban.drawable.MathBlock('+', function() { console.log('plusss'); });
		plus.putAt(5,3);
		plus.draw();
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
	};
	sokoban.drawable = {};
	sokoban.drawable.DeadBlock = function() {
		this.draw = function() {
			console.log('draw block');
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
			console.log('draw player');
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
			console.log('draw target');
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
			console.log('draw movable');
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
			console.log('draw movable');
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
