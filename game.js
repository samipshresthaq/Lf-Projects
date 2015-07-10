;(function(){
	'use strict';
	
	var gameOver = false;
	var aliens = [];
	var bullets = [];
	var shooting = false;
	var start = null;
	var stop=false;
	var frameCount=0;
	var fps,fpsInterval,startTime,now,then,elapsed;
	var heroAction;
	var req;

	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                            	window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

	var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

// Alien Class
	function Alien() {
		var that = this;
		
		var alienCounter = 0;
	 	var alienPosition = Math.floor((Math.random() * 10) + 0);


		this.image = document.createElement('div');
		this.image.setAttribute('class','alienSprite');
		this.image.style.position = 'absolute';

		this.element  = document.createElement('div');
		// this.element.style.border = '1px solid red';
		// this.element.style.background = 'red';
		this.element.style.position= 'absolute';

		this.element.appendChild(that.image);

		this.x = 0;
		this.y = 0;
		this.dx = 3;
		this.dy = 3;
		
		this.height = 15;
		this.width = 25;
		
		this.move = function() {
			if (alienPosition <= 4) 
			{
				that.x = that.x - that.dx;
				that.y = that.y + that.dy;
			}

			else if (alienPosition > 4 ) 
			{
				that.x = that.x - 1;
				that.y = that.y + that.dy;
			}

			// else if (alienPosition > 3 && alienPosition < 5) 
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
			marginLeft -= 1;
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
	function Bullet() {
		var that = this;
		
		var bulletCounter = 0;

		this.image = document.createElement('div');
		// this.image.setAttribute('class','bullet');
		this.image.style.position = 'absolute';
		this.image.style.background = 'url("bullet.png") no-repeat';
		this.image.style.width = '4px';
		// this.image.style.border = '1px solid red';
		this.image.style.height = '4px';

		this.element  = document.createElement('div');
		// this.element.style.border = '1px solid red';
		// this.element.style.background = 'red';

		this.element.appendChild(that.image);

		this.x = 0;
		this.y = 0;
		
		this.height = 5;
		this.width = 5;
		
		this.move = function() {
			that.x = that.x + 5;
		};
		
		this.updateFrame = function() {
			that.image.style.left = that.x + 'px';
			that.image.style.top = that.y + 'px';
			
			that.image.style.width = that.width + 'px';
			that.image.style.height = that.height + 'px';
		};

		this.render = function(){
			that.move();
			that.updateFrame();
		}
	};

// Collision Detection Class
	function CollisionDetection() {

		this.detect = function(aliens,hero) {
			// console.log(aliens);
			for (var i=0; i < aliens.length; i++) {
				if((aliens[i].x <= (hero.x + hero.width)) && ((aliens[i].x + aliens[i].width) >= hero.x))
				{
					if((aliens[i].y <= (hero.y + hero.height)) && ((aliens[i].y + aliens[i].height) >= hero.y))
					{	
						console.log('die');
						gameOver = true;
					}
				}
			}
		}
	};

	function CollisionDetectionBullet() {

		this.detect = function(aliens,bullets,gameDiv){
			// console.log(aliens);
			for (var i=0; i < aliens.length; i++) {
				var alien = aliens[i];
				for (var j=0; j < bullets.length; j++) 
				{
					var bullet = bullets[j];
					if((alien.x <= (bullet.x + bullet.width - 15)) && ((alien.x + alien.width) >= bullet.x))
					{
						if((alien.y <= (bullet.y + bullet.height)) && ((alien.y + alien.height) >= bullet.y))
						{	
							aliens.splice(i,1);
							bullets.splice(j,1);
							gameDiv.removeChild(alien.element);	
							gameDiv.removeChild(bullet.element);
						}
					}
				};
			};
		}
	};


	//Hero Class
	function Hero(gameProps) {
		var that = this;
		
		this.image = document.createElement('div');
		this.image.setAttribute('class','heroSprite');
		this.image.style.border = '1px solid red';
		this.image.style.position = 'absolute';

		this.element  = document.createElement('div');
		// //this.element.style.overflow ='hidden'
		this.element.style.border = '1px solid blue';
		// this.element.style.background = 'blue';
		this.element.style.position = 'absolute';

		this.element.appendChild(that.image);

		this.x = 0;
		this.y = 0;

		this.width = 10;
		this.height = 35;
		this.image.style.marginLeft = '-10px';
		this.image.style.marginTop = '-2px';

		this.updateFrame = function() {
			that.element.style.left = that.x + 'px';
			that.element.style.top = that.y + 'px';

			that.element.style.width = that.width + 'px';
			that.element.style.height = that.height + 'px';
		};

		// this.stopSprite = function(sprite){
		// 	console.log(sprite);
		// 	var stop = function ()
		// 	{
		// 		window.cancelAnimationFrame(sprite.animate);
		// 	};

		// 	setTimeout(stop,600);
		// };


		// Jump Duck function
		this.jump = function(sprite){
			// console.log(sprite);

			that.image.style.marginLeft = '-16px';
			that.image.style.marginTop = '-5px';
			that.y = gameProps.height - that.height - 82;
			// console.log("Y="+that.y);
			setTimeout(that.gravity,800);
		};

		this.slide = function(){
			that.width = 15;
			that.height = 20;
			that.image.style.marginTop = '-5px';
			that.y = gameProps.height - that.height - 39;
			setTimeout(that.gravity,800);
		};

		this.shoot = function(){
			that.height = 39;
			// that.y = gameProps.height - that.height - 40;
			that.image.style.marginLeft = '-10px';
		}

		this.gravity = function(){
			window.cancelAnimationFrame(req);
			that.width = 10;
			that.height = 35;
			that.image.style.marginLeft = '-10px';
			that.image.style.marginTop = '-2px';
			// animation = setInterval(spriteSheet.animate,100);
			that.y = gameProps.height - that.height - 45;
			heroAction = new HeroSheet('heroSprite',330,40,1,9,'run');
			heroAction.animate();

			// heroRun.animate();
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
				// console.log(src);

				 // request another frame
				
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
					    }, 1000 / fps);

				that.x = that.x - that.dx;
				// console.log("Y="+that.y);

				that.canvas.style.backgroundPosition = that.x + 'px ' + that.y + 'px';
				}

			};
		}
	};

	function HeroSheet(imgClass,imageWidth,imageHeight,row,column,flag)
	{	
		var that = this;
		var src;
		this.x = 0;
		this.y = 0;
		this.dx = Math.floor(imageWidth/column);
		this.dy = Math.floor(imageHeight/row);
		this.element = document.getElementsByClassName(imgClass);

		if(flag === 'run')
		{
			src = 'hero.png';
		}

		else if(flag === 'jump')
		{
			src = 'heroJump.png';
		}

		else if(flag === 'slide')
		{
			src = 'heroSlide.png';
		}

		else if(flag === 'shoot')
		{
			src = 'heroShoot.png';
		}

		console.log(src);

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

					// setTimeout(function() {
					// 	       requestAnimationFrame(that.animate);
					// 	    }, 1000 / fps);

					that.x = that.x - that.dx;

					that.canvas.style.backgroundPosition = that.x + 'px ' + that.y + 'px';
				}

			};
		}
	};
	
	// Line runner main function
	function LineRunner(gameDiv_) {
		var gameDiv = gameDiv_;
		var heroAnimation;
		var heroRunAnimate;
		// var score = new Score();
		var interval = 50;
		var collisionDetection = new CollisionDetection();
		var collisionDetectionBullet = new CollisionDetectionBullet();
		var background = new Background();
		// var alienPosition = 0;
		
		var gameProps = {
			width: 600,
			height: 224
		};
		
		var hero = new Hero(gameProps);

		var createAlien = function()
		{
			var alien = new Alien();
			alien.x = 540;
			var position =  Math.floor((Math.random() * 80) + 38);
		 	// alienPosition = Math.floor((Math.random() * 10) + 0);

		 	// console.log(alienPosition);
		 	// if(alienPosition <3)
		 	alien.y = gameProps.height - hero.height - position;
			console.log(alien.y);


			aliens.push(alien);
			gameDiv.appendChild(alien.element);
		};

		var createBullet = function() {
			var bulletNew = new Bullet();

		 	bulletNew.x = (hero.y + hero.width + bulletNew.width) + 40;

			bulletNew.y = (gameProps.height - hero.height - bulletNew.height) - 27;
			bulletNew.render();
			bullets.push(bulletNew);
			gameDiv.appendChild(bulletNew.element);
		};

		window.onkeydown = function(event){
			// console.log(event.which);
			if(!gameOver)
			{
				if(event.keyCode === 38){
					if(hero.y === gameProps.height - hero.height - 45)
					{
						heroAction = new HeroSheet('heroSprite',312,48,1,9,'jump');//call new spritesheet for jump action
						hero.jump();
						heroAction.animate();
					}
				}

				else if(event.keyCode === 65)
				{
					if(hero.y === gameProps.height - hero.height - 45)
					{
						if(!shooting)
						{
								createBullet();
								shooting = true;
								heroAction = new HeroSheet('heroSprite',617,45,1,10,'shoot') ;
								hero.shoot();
								heroAction.animate();
						}
					}
				}

				else if(event.keyCode === 40){

					heroAction = new HeroSheet('heroSprite',330,40,1,9,'slide');//call new spritesheet for jump action
					hero.slide();
					heroAction.animate();
				}

			}
		};

		window.onkeyup = function(event){
			// alert(event.keyCode);
			if(event.keyCode === 65)
			{
				shooting = false;
				hero.gravity();
			}

		};

	//Game Setup
		var gameSetup = function() {
			gameDiv.style.width = gameProps.width + 'px';
			gameDiv.style.height = gameProps.height + 'px';
			// gameDiv.style.border = '1px solid black';
			gameDiv.style.overflow = 'hidden';

			hero.y = gameProps.height-hero.height-45;
			hero.x = 140;
			
			gameDiv.appendChild(background.element);
			gameDiv.appendChild(hero.element);
		};

	// Game main loop
		var loopCounter = 0;

		var gameLoop = function() 
		{
			if(!gameOver)
			{
				loopCounter++;
				background.updateFrame();
				hero.updateFrame();

				if (loopCounter % 110 === 0) {
					createAlien();	
					var alienSheet = new AlienSheet('alien.png','alienSprite',192,23,1,6,5);
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

					if(alien.y < 0 || alien.y > 149)
					{
						alien.dy = alien.dy * (-1);
					}

					alien.render();
				}

				for (var i=0; i<bullets.length; i++) 
				{
					var bullet = bullets[i];
					
					if(bullet.x >600 )
					{
						bullets.splice(i,1);
						gameDiv.removeChild(bullet.element);
					}
					bullet.render();
				}	

				// collisionDetection.detect(aliens,hero);
				collisionDetectionBullet.detect(aliens,bullets,gameDiv);

				requestAnimationFrame(gameLoop);
			}

			else
			{
				//call new spritesheet for duck action
				var spriteDeath = new SpriteSheet('heroDeath.png','heroSprite',620,40,1,16,20);
				
				//Run death spritesheet
				(function startDeath() 
				{
		    		heroAnimation = setInterval(spriteDeath.animate,100);
				})();

				function stopHero(){
					clearInterval(heroAnimation);
				};

				setTimeout(stopHero,1600);
			}
		};
		
		gameSetup();
		gameLoop();

		heroAction = new HeroSheet('heroSprite',330,40,1,9,'run');

		setInterval(heroAction.animate,100);
	};

	window.LineRunner = LineRunner;

})();