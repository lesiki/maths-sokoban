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
	sokoban.drawable.DeadBlock.prototype = Drawable.prototype;
	sokoban.drawable.Player.prototype = Drawable.prototype;
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
