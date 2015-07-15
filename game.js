;(function(){
	'use strict';
	
	var gameOver = false;
	var aliens = [];
	var bullets = [];

	var jumpFlag = false;
	var slideFlag = false;
	var shootFlag = false;
	var highscore = 0;
	var bossStage = false;

	
	if(localStorage.getItem("highscore"))
		{highscore = localStorage.getItem("highscore");}
	else
		{highscore = 0;}

	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                            	window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

	var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

// Alien Class
	function Alien() {
		var that = this;
		
		var alienCounter = 0;
	 	var alienPosition = Math.floor((Math.random() * 10));

		this.enemy = document.createElement('div');
		this.enemy.setAttribute('class','alienSprite');
		this.enemy.style.position = 'absolute';
		// this.enemy.style.border = '1px solid blue';

		this.element  = document.createElement('div');
		// this.element.style.border = '1px solid red';
		this.element.style.position= 'absolute';

		this.element.appendChild(that.enemy);

		this.x = 0;
		this.y = 0;
		this.dx = 6;
		this.dy = 5;
		
		this.height = 12;
		this.width = 18;
		this.enemy.style.marginLeft = '-7px';
		this.enemy.style.marginTop = '-4px';
		
		this.move = function() {

			if (alienPosition <= 4) 
			{
				that.x = that.x - that.dx;
				that.y = that.y + that.dy;
			}

			else if (alienPosition > 4) 
			{
				that.x = that.x - 8;
				that.y = that.y + that.dy;
			}

			// else if (alienPosition >= 5) 
			// {
			// 	that.x = that.x - that.dx;
			// }
			
		};
		
		this.updateFrame = function() {
			that.element.style.left = that.x + 'px';
			that.element.style.top = that.y + 'px';
			
			that.element.style.width = that.width + 'px';
			that.element.style.height = that.height + 'px';
		};

		this.render = function(){
			that.move();
			that.updateFrame();
		}
	};

//Background Class
	function Background() {
		var that = this;
		
		this.element  = document.createElement('div');
		this.element.style.width = '50000px';
		this.element.style.height = '224px';
		this.element.style.background = 'url(background.png) repeat-x';
		
		var marginLeft = 0;
		
		var move = function() {
			marginLeft -= 5;
			if ((marginLeft % 2000) === 0) {
				bossStage = true;
			};
		};
		
		var render = function() {
			that.element.style.marginLeft = marginLeft + 'px';
		};
		
		this.updateFrame = function() {
			move();
			render();
		};
	};

// Bullet Class
	function Bullet(gameDiv) {
		var that = this;
		this.bullet = document.createElement('div');
		this.bulletX = 180;
		this.width = 5;
		this.height = 5;
		this.y = 152;
		this.flag = 1; //if bullet is removed flag sets to 0

		this.createBullet = function () {
			// that.bullet = document.createElement('div');
			that.bullet.style.width = this.width + "px";
			that.bullet.style.height = this.height + "px";
			that.bullet.style.top = that.y + "px";
			// that.bullet.style.border = "1px solid white";
			// that.bullet.style.left = "200px";
			that.bullet.style.background = "url('bullet.png') no-repeat";
			that.bullet.style.position = "absolute";
			gameDiv.appendChild(that.bullet);

			that.updateBullet();
		}

		this.updateBullet = function(){
			// this.dx = this-5px;
			that.bulletX += 4;
			that.bullet.style.left = that.bulletX + "px";
			if (that.bulletX > 590) {
				// //console.log("remove bullet");

				that.flag = 0;
			};

			if (that.flag == 1) {
				window.requestAnimationFrame(that.updateBullet);
			};
		}
	};

// Collision Detection Class
	function CollisionDetection() {

		this.detect = function(aliens,hero) {
			// //console.log(aliens);
			for (var i=0; i < aliens.length; i++) {
				if((aliens[i].x <= (hero.left + hero.width - 4)) && ((aliens[i].x + aliens[i].width)>= hero.left))
				{
					if((aliens[i].y <= (hero.y + hero.height)) && ((aliens[i].y + aliens[i].height) >= hero.y))
					{	
						////console.log('Hero x ',hero.x,' Hero y ',hero.y);
						////console.log('Alien x ',aliens[i].x,' alien y ',aliens[i].y);
						gameOver = true;
					}
				}
			}
		}
	};

// Collision Detection Between bullet and enemy
	function CollisionDetectionBullet() {

		this.detect = function(aliens,bullets,gameDiv,scoreDisplay){
			// ////console.log(aliens);
			var counter = scoreDisplay.score.innerHTML;

			for (var i=0; i < aliens.length; i++) {
				var alien = aliens[i];
				for (var j=0; j < bullets.length; j++) 
				{
					var bullet = bullets[j];

					if((alien.x <= (bullet.bulletX + bullet.width - 4)) && ((alien.x + alien.width) >= bullet.bulletX))
					{
						////console.log('x axis collide');
						if((alien.y <= (bullet.y + bullet.height + 5)) && ((alien.y + alien.height) >= bullet.y))
						{	
							counter++;
							aliens.splice(i,1);
							bullets.splice(j,1);
							scoreDisplay.score.innerHTML = counter;
							if(counter>highscore)
							{
								highscore = counter;
								scoreDisplay.highScore.innerHTML = highscore;
								localStorage.setItem("highscore", counter);
							}
							gameDiv.removeChild(alien.element);	
							gameDiv.removeChild(bullet.bullet);
						}
					}
				};
			};
		}
	};


//Hero Class
	function Hero(gameProps) {
		var that = this;
		var src = "hero.png";
		this.imageWidth  = 36;
		this.spriteWidth = 324;
		this.x = 0;
		this.y = 0;
		this.left = 150;

		this.createHero = function(){
			this.hero = document.createElement('div');
			this.hero.setAttribute('class','hero');
			// this.hero.style.border = '1px solid red';
			that.hero.style.width = 35 + "px";
			that.hero.style.height = 40 +"px";
			this.hero.style.position = 'absolute';
			that.hero.style.background = 'url(' + src + ') no-repeat';

			this.element  = document.createElement('div');
			// //this.element.style.overflow ='hidden'
			// this.element.style.border = '1px solid blue';
			// this.element.style.background = 'blue';
			this.element.style.position = 'absolute';

			this.element.appendChild(that.hero);

			this.width = 10;
			this.height = 35;
			this.hero.style.marginLeft = '-10px';
			this.hero.style.marginTop = '-2px';

			that.element.style.left = this.left + 'px';
			that.element.style.top = (gameProps.height - that.height - 45) + 'px';

			that.element.style.width = that.width + 'px';
			that.element.style.height = that.height + 'px';
		}

		this.moveHero = function() {

			// animating the sprite for runing hero action
			that.x -= that.imageWidth;
			that.hero.style.backgroundPosition = that.x + "px 0";
			if (that.x <= (-that.spriteWidth + that.imageWidth)) {
				that.x = 0;
			};
		}

		// Jump Duck function
		this.jump = function(sprite){
			that.x = 0;
			that.y = 100;
			that.spriteWidth = 312;
			that.imageWidth = that.spriteWidth / 9;
			that.element.style.top = that.y + "px";
			that.hero.style.height = 48 +"px";

			var src = "heroJump.png";
			that.hero.style.background = 'url(' + src + ') no-repeat';
			//console.log("jump");
			if(!gameOver)
				setTimeout(that.restoreHeroPosition, 540);
		};

		// Slide Function
		this.slide = function(){
			that.x = 0;
			that.y = gameProps.height - that.height - 30;
			that.width = 5;
			that.height = 24;
			that.spriteWidth = 123;
			that.element.style.top = that.y + "px";
			that.imageWidth = that.spriteWidth / 3;
			that.element.style.height = that.height + "px";
			that.element.style.width = that.width + "px";
			that.hero.style.height = 25 + "px";
			that.hero.style.width = 38 + "px";

			var src = "heroSlide.png";
			that.hero.style.background = 'url(' + src + ') no-repeat';

			if(!gameOver)
				setTimeout(that.restoreHeroPosition, 600);
		};

		// Shoot Function
		this.shoot = function(){
			that.x = 0;
			that.spriteWidth = 617;
			that.imageWidth = that.spriteWidth / 10;
			that.height = 40;

			that.hero.style.height = that.height + "px";
			that.hero.style.width = that.imageWidth + "px";

			var src = "heroShoot.png";
			that.hero.style.background = 'url(' + src + ') no-repeat';

			if(!gameOver)
				setTimeout(that.restoreHeroPosition, 460);
		}

		this.death = function(){
			that.x = 0;
			that.spriteWidth = 612;
			that.imageWidth = that.spriteWidth / 16;
			that.height = 40;

			that.element.style.top = (gameProps.height - that.height - 40) + 'px';
			that.hero.style.height = that.height + "px";
			that.hero.style.width = that.imageWidth + "px";

			var src = "heroDeath.png";
			that.hero.style.background = 'url(' + src + ') no-repeat';

			// setTimeout(that.restoreHeroPosition, 460);
		}

		//Restore Running Form Function
		this.restoreHeroPosition = function() {
			jumpFlag = false;
			slideFlag = false;
			shootFlag = false;
			that.height = 35;
			that.width = 10;

			that.element.style.top = (gameProps.height - that.height - 45) + "px";
			that.element.style.height = 35 + "px";
			that.element.style.width = 10 + "px";
			that.hero.style.height = 40 + "px";
			that.hero.style.width = 35 + "px";
			that.element.style.top = (gameProps.height - that.height - 45) + 'px';

			that.spriteWidth = 324;
			that.imageWidth = 36;

			src = "hero.png";
			that.hero.style.background = 'url(' + src + ') no-repeat';
			
			that.x = 0;
		};

	};

// SriteSheet Class
	function AlienSheet(src,imgClass,imageWidth,imageHeight,row,column,fps)
	{	
		var that = this;
		this.x = 0;
		this.y = 0;
		this.dx = Math.floor(imageWidth/column);
		this.dy = Math.floor(imageHeight/row);
		this.element = document.getElementsByClassName(imgClass);

		for(var i = 0; i < this.element.length; i++)
		{	
			this.canvas = this.element[i];
			this.canvas.style.width = this.dx + 'px';
			this.canvas.style.height = this.dy + 'px';

			this.canvas.style.background = 'url(' + src + ') no-repeat';

			this.animate = function(){
				
				if(!gameOver)
				{
					    
				if(that.x === -((column-1) * that.dx))
				{
					that.x = 0;
					if(that.y === -((row-1) * that.dy))
					{
						that.y = 0;
					}
					else
					{
						that.y = that.y - that.dy;
					}
				}

				setTimeout(function() {
					       requestAnimationFrame(that.animate);
					    }, 900 / fps);

				that.x = that.x - that.dx;
				that.canvas.style.backgroundPosition = that.x + 'px ' + that.y + 'px';
				}

			};
		}
	};

//Sprite
	function SpriteSheet(src,imgClass,imageWidth,imageHeight,row,column)
	{	
		// var image = src;
		var that = this;
		this.x = 0;
		this.y = 0;
		this.dx = Math.floor(imageWidth/column);
		this.dy = Math.floor(imageHeight/row);
		this.canvas = document.getElementsByClassName(imgClass)[0];
		this.canvas.style.width = this.dx + 'px';
		this.canvas.style.height = this.dy + 'px';
		this.canvas.style.position = 'absolute';

		this.canvas.style.background = 'url('+ src +') no-repeat';

		this.move = function(){
			if(that.x === -((column-1) * that.dx))
			{
				that.x = 0;
				if(that.y === -((row-1) * that.dy))
				{
					that.y = 0;
				}

				else
				{
				that.y = that.y - that.dy;
				}
			}

			that.x = that.x - that.dx;

			that.canvas.style.backgroundPosition = that.x + 'px ' + that.y + 'px';
			
		}
	}

// Score displaying class
	function ScoreDisplay(){
		var that = this;
		this.scoreContainer = document.createElement('div');

		this.scoreElement = document.createElement('div');
		this.highScoreElement = document.createElement('div');

		this.score = document.createElement('span');
		this.highScore = document.createElement('span');

		// this.scoreElement.style.width = '100px';
		this.scoreElement.style.height = '20px';
		this.scoreElement.style.color = '#f5f5f5';
		this.scoreElement.style.float = 'left';

		// this.highScoreElement.style.width = '100px';
		this.highScoreElement.style.height = '20px';
		this.highScoreElement.style.color = '#f5f5f5';
		this.highScoreElement.style.float = 'right';

		// this.element.style.background = 'lightyellow';
		this.scoreContainer.style.top = '0';
		this.scoreContainer.style.left = '20px';
		this.scoreContainer.style.width = '540px';
		this.scoreContainer.style.position = 'absolute';

		this.scoreElement.innerHTML = 'Your Score : ';
		this.highScoreElement.innerHTML = 'High Score : ';

		this.score.innerHTML = '0';
		this.highScore.innerHTML = highscore;
		this.scoreElement.appendChild(that.score);
		this.highScoreElement.appendChild(that.highScore);

		this.scoreContainer.appendChild(that.scoreElement);
		this.scoreContainer.appendChild(that.highScoreElement);
	};
	
	// Line runner main function
	function MetalContra(gameDiv_) {
		var gameDiv = gameDiv_;
		var that = this;
		
		this.backgroundX = 0;
		var interval = 50;
		var collisionDetection = new CollisionDetection();
		var collisionDetectionBullet = new CollisionDetectionBullet();
		var background = new Background();
		var scoreDisplay = new ScoreDisplay();
		
		var gameProps = {
			width: 600,
			height: 224
		};
		
		var hero = new Hero(gameProps);
		var loopCounter = 0;

		var createAlien = function()
		{
			var alien = new Alien();
			var positionX =  Math.floor((Math.random() * 140) + 450);
			alien.x = positionX;
			var positionY =  Math.floor((Math.random() * 120) + 55);
			// //console.log('alien position',position);
		 	alien.y = positionY;
			aliens.push(alien);
			gameDiv.appendChild(alien.element);
		};

		var createBullet = function()
		{
			var newBullet = new Bullet(gameDiv);
			newBullet.createBullet();
			bullets.push(newBullet);
		};

		window.onkeydown = function(event){
			// //console.log(event.which);
			if(!jumpFlag && !slideFlag && !shootFlag && !gameOver) {
				if(event.keyCode === 38){
						jumpFlag = true;
						// //console.log("up button pressed");
						hero.jump();	
					}

				if (event.keyCode === 40) {
						slideFlag = true;
						// //console.log("down key pressed");
						hero.slide();
				};

				if (event.keyCode === 65) {
						shootFlag = true;
						createBullet();
						//console.log("shoot key pressed");
						hero.shoot();
					}
			}
		}

		//Game Setup
		var gameSetup = function() {
			gameDiv.style.width = gameProps.width + 'px';
			gameDiv.style.height = gameProps.height + 'px';
			// gameDiv.style.border = '1px solid black';
			gameDiv.style.overflow = 'hidden';

			hero.y = gameProps.height - hero.height - 45;
			hero.x = 140;
			
			gameDiv.appendChild(background.element);
			gameDiv.appendChild(hero.element);
			gameDiv.appendChild(scoreDisplay.scoreContainer);
		};

		// Game main loop
		var gameLoop = function() 
		{
			var randomTime = Math.floor((Math.random()*20) + 40);
			var randomAlien = Math.floor((Math.random()*8) + 1);

			if(!gameOver)
			{
				if(bossStage === false)
				{
					loopCounter++;
					background.updateFrame();
					hero.moveHero();

					if (loopCounter % 40 === 0) {
						createAlien();	
						var alienSheet = new AlienSheet('alien1.png','alienSprite',192,23,1,6,10);
						alienSheet.animate();
					}
					
					for (var i=0; i<aliens.length; i++) 
					{
						var alien = aliens[i];
						
						if(alien.x < 0)
						{
							aliens.splice(i,1);
							gameDiv.removeChild(alien.element);
						}

						if(alien.y < 55 || alien.y > 195)
						{
							alien.dy = alien.dy * (-1);
						}

						alien.render();
					}

					for (var i=0; i<bullets.length; i++) 
					{
						var bullet = bullets[i];
						if(bullet.bulletX >580 )
						{
							////console.log('removed from stack');
							//console.log(bullets);
							bullets.splice(i,1);
							gameDiv.removeChild(bullet.bullet);
						}
					}	

					collisionDetection.detect(aliens,hero);	
					collisionDetectionBullet.detect(aliens,bullets,gameDiv,scoreDisplay);  

					var speed = 20;
					setTimeout(function(){requestAnimationFrame(gameLoop);},900 / speed);
				}

				else
				{
					alert('Boss Stage');
					bossStage = false;
					var speed = 20;
					setTimeout(function(){requestAnimationFrame(gameLoop);},900 / speed);
				};
			}

			else
			{
				// var deathSprite = function(){
					hero.death();
					var deathAnimation = setInterval(hero.moveHero,80);
					var stopAnimation = function(){
						clearInterval(deathAnimation);
						gameRetry();
					}

					setTimeout(stopAnimation,1280);
				// //console.log(gameDiv.childNodes.length);
				function gameRetry(){
					var gameoverElement = document.createElement('div');
					var scoreElement = document.createElement('div');
					var retryElement = document.createElement('div');
					var anchorElement = document.createElement('a');
					anchorElement.setAttribute('href', '#');
					retryElement.appendChild(anchorElement);

					gameoverElement.innerHTML = 'GAME OVER';
					gameoverElement.style.top = "80px";
					gameoverElement.style.left = "250px";
					gameoverElement.style.position = "absolute";
					gameoverElement.style.color = "#e13c03";

					scoreElement.innerHTML = 'Your Score : ' + scoreDisplay.score.innerHTML;
					scoreElement.style.top = "107px";
					scoreElement.style.left = "240px";
					scoreElement.style.position = "absolute";
					scoreElement.style.color = "#faa707";

					anchorElement.innerHTML = 'Try Again';

					retryElement.style.margin = "0 auto";
					retryElement.style.top = "135px";
					retryElement.style.left = "255px";
					retryElement.style.textAlign = "center";
					retryElement.style.position = "absolute";

					gameDiv.appendChild(gameoverElement);
					gameDiv.appendChild(scoreElement);
					gameDiv.appendChild(retryElement);

					retryElement.onclick = function(){
						aliens = [];
						bullets = [];

						if(gameDiv.hasChildNodes()) {
							while(gameDiv.hasChildNodes())
								{
									gameDiv.removeChild(gameDiv.firstChild);
								}
						};
						var menu = new Menu(gameDiv);
						menu.loadScreen();
					}
				}
			}
		};

		this.setup = function()
		{
			hero.createHero();
			gameSetup();
		};

		this.init = function ()
		{
			gameLoop();
		};

	};

	function Menu(gameDiv) {

		var that = this;
		var metalContra = new MetalContra(gameDiv);
		metalContra.setup();

		this.mainMenu = function(){
			gameOver = true;
			////console.log(highscore);
			var that = this;
			this.playElement = document.createElement('div');
			this.helpElement = document.createElement('div');

			this.anchorElement = document.createElement('a');
			this.anchorElement.setAttribute('href', '#');
			this.playElement.appendChild(that.anchorElement);

			that.anchorElement.innerHTML = 'PLAY';

			this.playElement.style.width = "100px";
			// this.playElement.style.height = "20px";
			this.playElement.style.margin = "0 auto";
			this.playElement.style.top = "80px";
			this.playElement.style.left = "250px";
			this.playElement.style.textAlign = "center";
			this.playElement.style.position = "absolute";
			// this.playElement.style.background = "#fefefe";

			this.helpElement.style.width = "100px";
			// this.helpElement.style.height = "100px";
			this.helpElement.style.fontSize = "10px";
			this.helpElement.style.margin = "0 auto";
			this.helpElement.style.top = "110px";
			this.helpElement.style.left = "250px";
			this.helpElement.style.color = "#faa707";
			this.helpElement.style.textAlign = "center";
			this.helpElement.style.position = "absolute";

			this.helpElement.innerHTML = "<p> Key Bindings: <br> Shoot - A <br> Jump - Up Arrow <br>Slide - Down Arrow </p>";

			gameDiv.appendChild(that.playElement);
			gameDiv.appendChild(that.helpElement);

			this.playElement.onclick = function() {
				gameDiv.removeChild(that.playElement);
				gameDiv.removeChild(that.helpElement);
				that.loadScreen();
			}
		};

		this.loadScreen = function(){
			var loading = document.createElement('div');
			loading.style.width = "50px";
			loading.style.height = "50px";
			loading.setAttribute('class','loadSprite');
			loading.style.position = "absolute";
			loading.style.top = "80px";
			loading.style.left = "250px";

			var loadingText = document.createElement('div');
			loadingText.style.position = "absolute";
			loadingText.style.top = "120px";
			loadingText.style.left = "250px";
			loadingText.style.color = "#e13c03";
			loadingText.innerHTML = "Loading...";

			gameDiv.appendChild(loading);
			gameDiv.appendChild(loadingText);
			var loadSprite = new SpriteSheet('loading-sprite.png','loadSprite',412,34,1,8);
			setInterval(loadSprite.move,120);

			function loadgame()
			{
			gameDiv.removeChild(loading);
			gameDiv.removeChild(loadingText);
			gameOver = false;
			metalContra.init();
			}
			setTimeout(loadgame,1500);
		}
		// setTimeout(metalContra.init,5000);
	};

	window.Menu = Menu;

})();