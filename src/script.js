enchant();

var areaLength=21;
var state = new Array(areaLength);
var mapData = new Array(areaLength);
var itemData = new Array(areaLength);
var chara_x;
var chara_y;
var arrowFlag;
var dx;
var dy;
var CX = areaLength/2; 
var centerX = Math.floor(CX);
var mapTable = {flag:9,life:10,item:11,grass:12,bomb:13,ground:14,block:15,batteryUP:16,batteryDown:17};
//var soundTable = [];
var life = 5;
var select = [];
var lifes = [];
var scoreBoard = [];
var timer = [];
var titles = [];
var treeCount = 3;
var trees  = [];
var batteries = [];
var LOCK=false;
var timerFlag;
var totalTime;
var score;
var limit ; 
var bullets = [];
var defaultMessage;
var explostionFlag;
var choise=0;


window.onload = function() {
    var core = new Game(areaLength*16,(areaLength+5)*16);

    core.fps = 8;
    core.preload('../img/ball.png','../img/frame.png','../img/dialog.png','../img/start.png');  
	core.preload('../img/map.png','../img/message.png','../img/life.png','../img/tree.png','../img/effect0.png','../img/arrow.png','../img/timer.jpg','../img/bar.png','../img/restart.png','../img/number.png','../img/score.png','../img/battery.png','../img/bullet.png');	
	core.preload('../img/clear.png','../img/result.png','../img/timer.png');
	core.preload('../img/gameover.png');	
	/*
	core.preload('..///sound/opening.mp3','..///sound/lock.mp3'); 
	core.preload('..///sound/dig.mp3','..///sound/heal.mp3','..///sound/star.mp3','..///sound/smash.mp3','..///sound/smash.mp3','..///sound/explosion.mp3','..///sound/fire.mp3','..///sound/mark.mp3','..///sound/main.mp3'); 
	core.preload('..///sound/clear.mp3');
	core.preload('..///sound/gameover.mp3');
	*/
    core.onload = function() {
        core.rootScene.backgroundColor = "#fff";
		var mainScene = new Scene();

		/*
		soundTable['opening'] = core.assets['../sound/opening.mp3'];
		soundTable['select'] = core.assets['../sound/lock.mp3'];
		soundTable['change'] = core.assets['../sound/changeScene.mp3'];
		soundTable['main'] = core.assets['../sound/main.mp3'];
		soundTable['dig'] = core.assets['../sound/dig.mp3'];
		soundTable['heal'] = core.assets['../sound/heal.mp3'];
		soundTable['star'] = core.assets['../sound/star.mp3'];
		soundTable['explosion'] = core.assets['../sound/explosion.mp3'];
		soundTable['smash'] = core.assets['../sound/smash.mp3'];	
		soundTable['mark'] = core.assets['../sound/mark.mp3'];
		soundTable['clear']	= core.assets['../sound/clear.mp3'];	
		soundTable['gameover']	= core.assets['../sound/gameover.mp3'];
	*/

		core.keybind(65, 'check');
		core.keybind(70, 'dig');
		core.keybind(' '.charCodeAt(0), 'tree');
			
		var ballSelect = Class.create(Sprite,{
			initialize: function(x,y,n){
				Sprite.call(this,16,16);
				this.x=x;
				this.y=y;
				this.image = core.assets['../img/ball.png'];
				this.frame=n;
				this.n = n;
				gameStart.addChild(this);
				this.addEventListener('touchstart',function(){
					if(!LOCK)
						this.method1();
				});
			},
			method1: function() {
       			selectFrame.x = 40+32*this.n;
				choise = this.n;
				serifLabel.text =Serif[this.n];
				//soundTable['select'].play();
				lock(600);
    		}
		});
		
		var Bar = Class.create(Sprite,{
			initialize: function(x,y){
				Sprite.call(this,1,8);
				this.x=x;
				this.y=y;
				this.image = core.assets['../img/bar.png'];
				this.frame=0;
				mainScene.addChild(this);
			}
		});
	
		var Life = Class.create(Sprite,{
			initialize: function(x,y){
				Sprite.call(this,16,16);
				this.x=x;
				this.y=y;
				this.image = core.assets['../img/life.png'];
				this.frame=0;
				mainScene.addChild(this);
			}
		});
		
		var Tree = Class.create(Sprite,{
			initialize: function(x,y){
				Sprite.call(this,16,16);
				this.x=x;
				this.y=y;
				this.image = core.assets['../img/tree.png'];
				this.frame=0;
				mainScene.addChild(this);
			}
		});
		
		var Number = Class.create(Sprite,{
			initialize: function(x,y,img){
				Sprite.call(this,16,16);
				this.x=x;
				this.y=y;
				this.image = core.assets[img];
				this.frame=0;
			}
		});
		
		var Restart = Class.create(Sprite,{
			initialize: function(x,y/*,sound*/){
				Sprite.call(this,332,139);
				this.x=x;
				this.y=y;
				this.image = core.assets['../img/restart.png'];
				//this.sound = sound;
				this.addEventListener('touchstart',function(){
            	this.method();
				});
			},
			method:function(){
					//this.sound.stop();
					choise = 0;
					//soundTable['opening'].play();	
					//soundTable['opening'].volume=0.5;	
            		initializeData(ball,mainScene);
            		core.popScene();
            		core.pushScene(gameStart);
			}
		});
		
		var Battery = Class.create(Sprite,{
			initialize: function(x,y,dx){
				Sprite.call(this,16,16);
				this.x=x;
				this.y=y;
				this.Y=y;
				this.image = core.assets['../img/battery.png'];
				//this.sound = core.assets['../sound/fire.mp3'];
				this.count=0;
				this.dx=dx;
				this.direction = dx;
				mainScene.addChild(this);
				
				this.on('enterframe',function(){
					
					 this.count++;
					if(this.count % 160 ==0){
						this.direction *= -1;
					}
					
					if(this.count%32<16){
						this.y += this.direction;
					}else if(Math.floor(Math.random()*32)==0){
						//this.sound.play();
						//this.sound.volume =0.4;
						bullets.push(new Bullet(this.x+16*this.dx,this.y+2,Math.ceil(Math.random()*16),this.dx));	
					}
				});
			},
			method1: function() {
       			this.y=this.Y;
       			this.count=0;
       			this.direction=1;
    		}
		});
		
		var Bullet = Class.create(Sprite,{
			initialize: function(x,y,v,d){
				Sprite.call(this,16,14);
				this.x=x;
				this.y=y;
				this.image = core.assets['../img/bullet.png'];
				this.v=v*d;
				if(d==1)
					this.frame=1;
					
				this.on('enterframe',function(){
					this.x += this.v;
					if(this.intersect(ball) && !explostionFlag){ 
						explosionEffect(effect,ball,chara_x,chara_y);
						subLife();
						this.parentNode.removeChild( this );
						arrow.opacity = 0;
					}
					if(this.x<-10 || this.x>areaLength*16)
						this.parentNode.removeChild( this );
				});
				mainScene.addChild(this);
			}
		});
			
		 for(var i=0;i<4;i++)
			batteries[i] = new Battery(0,64*i+16,1);
			
  		for(var i=0;i<4;i++)
			batteries[i+4] = new Battery((areaLength-1)*16,64*i+94,-1);
			
		var gameStart = new Scene();
		gameStart.backgroundColor = "#F2F5A9";
		

		
		var startLogo = new Sprite(236,48);
		startLogo.image = core.assets['../img/start.png'];
		startLogo.x=CX*16-118;;
		startLogo.y=80;
		gameStart.addChild(startLogo);
		
		//soundTable['opening'].play();
		//soundTable['opening'].volume=0.5;

		startLogo.addEventListener('touchstart', function() {   
			ball.frame = choise;
			ball.opacity =1.0;
			//soundTable['opening'].stop()
			//soundTable['main'].play();
			//soundTable['main'].volume=0.5;
 			selectFrame.x = 40;
			serifLabel.text =Serif[8];
			message.text = defaultMessage;
			arrow.opacity = 0;	
            core.rootScene.addChild(map); 
            core.popScene();
        });
        	
        var select_y=210;      
		var selectFrame = new Sprite(32,32);
		selectFrame.image = core.assets['../img/frame.png'];
		selectFrame.x = 40;
		selectFrame.y = select_y-8;
		gameStart.addChild(selectFrame);
		
		for(var i=0;i<8;i++)
			select[i] = new ballSelect(i*32+48,select_y,i);
		

		var dialog = new Sprite(230,40);
		dialog.image = core.assets['../img/dialog.png'];
		dialog.x = 60;
		dialog.y = 300;
		gameStart.addChild(dialog);
		
		var Serif = ["　　サッカーボールにしますか","   　　野球ボールにしますか","　　ただのボール（青）にしますか","　　ただのボール（赤）にしますか","　　ただのボール（黄）にしますか","　　ただのボール（灰）にしますか","　　ただのボール（緑）にしますか","　　ただのボール（橙）にしますか","      好きなボールを選んでください","      わしはボールじゃないぞ！"];
		var serifLabel = new Label();
		serifLabel.font = "10px 'Consolas', 'Monaco', 'ＭＳ ゴシック'";
		serifLabel.text =Serif[8];
		serifLabel.x = 80;
		serifLabel.y = 315;
		gameStart.addChild(serifLabel);


		gameStart.addEventListener('enterframe', function() {
			if(core.input.tree && !LOCK){
				ball.frame = choise;
				ball.opacity =1.0;
				//soundTable['opening'].stop()
				//soundTable['main'].play();
				//soundTable['main'].volume=0.5;
 				selectFrame.x = 40;
				arrow.opacity = 0;	
				message.text = defaultMessage;
				serifLabel.text =Serif[8];
				core.rootScene.addChild(map); 
				core.popScene();
 			}
			if(core.input.right && !LOCK)
				if(choise<7){
                 	lock(600);
					choise++;
					select[choise].method1();
					}
			if(core.input.left && !LOCK)
				if(choise>0 ){
					lock(600);
					choise--;
					select[choise].method1();
				}
        });
         		
        var gameClear = new Scene();
       	gameClear.backgroundColor = "#000";     
       	   
        var clearLogo = new Sprite(267,48);
		clearLogo.image = core.assets['../img/clear.png'];
		clearLogo.x=CX*16-134;
		clearLogo.y=40;
		gameClear.addChild(clearLogo);
		
		var result = new Sprite(336,166);
		result.image = core.assets['../img/result.png'];
		result.x=0;
		result.y=100;
		gameClear.addChild(result);
		
		var scoreResult = [];
		for(var i=0;i<5;i++){
			scoreResult[i] = new Number(196+13*i,118,'../img/timer.png');
			scoreResult[i].scale(1,1.5);
			gameClear.addChild(scoreResult[i]);
		}
		
		var lifeResult = new Number(180,169,'../img/timer.png');
		lifeResult.scale(1,1.5);
		gameClear.addChild(lifeResult);
		
		var lifeWeight = [];
		for(var i=0;i<4;i++){
			lifeWeight[i] = new Number(209+13*i,169,'../img/timer.png');
			lifeWeight[i].scale(1,1.5);
			if(i==0)
				lifeWeight[i].frame=1;
			gameClear.addChild(lifeWeight[i]);
		}
        
        var timeResult = [];
        for(var i=0;i<3;i++){
			timeResult[i] = new Number(176+13*i,144,'../img/timer.png');
			timeResult[i].scale(1,1.5);
			gameClear.addChild(timeResult[i]);
		}
		
        var timeWeight = [];
                for(var i=0;i<2;i++){
			timeWeight[i] = new Number(236+13*i,144,'../img/timer.png');
			timeWeight[i].scale(1,1.5);
			if(i==0)
				timeWeight[i].frame=5;
			gameClear.addChild(timeWeight[i]);
		}
        
        var skullResult = [];
        for(var i=0;i<2;i++){
			skullResult[i] = new Number(176+13*i,194,'../img/timer.png');
			skullResult[i].scale(1,1.5);
			gameClear.addChild(skullResult[i]);
		}
		
        var skullWeight = [];
        for(var i=0;i<3;i++){
			skullWeight[i] = new Number(223+13*i,194,'../img/timer.png');
			skullWeight[i].scale(1,1.5);
			if(i==0)
				skullWeight[i].frame=1;
			gameClear.addChild(skullWeight[i]);
		}
        

        var totalScore = [];
		for(var i=0;i<5;i++){
			totalScore[i] = new Number(196+13*i,230,'../img/timer.png');
			totalScore[i].scale(1,1.5);
			gameClear.addChild(totalScore[i]);
		}
        
        //var clearsound = core.assets['..///sound/clear.mp3'];
 		var restart = new Restart(0,270/*,clearsound*/);
		
		gameClear.addChild(restart);
		
		gameClear.addEventListener('enterframe', function() {
            if(core.input.tree){
            	restart.method();
            	lock(1000);
        	}
        });
        
        var gameOver = new Scene();
		gameOver.backgroundColor = "#000";

        var gameoverLogo = new Sprite(189,97);
		gameoverLogo.image = core.assets['../img/gameover.png'];
		gameoverLogo.x=CX*16-95;
		gameoverLogo.y=80;
		gameOver.addChild(gameoverLogo);
		
	
		var restart2 = new Restart(0,270,/*soundTable['gameover']*/);
		
		gameOver.addChild(restart2);
		
		gameOver.addEventListener('enterframe', function() {
			if(core.input.tree ){
        		restart2.method();
        		lock(1000);
        	}
        });   
        
		var ball = new Sprite(16,16);
        var ball = ballSelect(centerX*16,(areaLength-1)*16);
  		ball.opacity =0;
  		ball.frame=8;
  		
        var msBoard = new Sprite(160,40);
		msBoard.image = core.assets['../img/message.png'];
		msBoard.x = 16;
		msBoard.y = areaLength*16+4; 
		mainScene.addChild(msBoard);       
        
        var defaultMessage = "※獲得したアイテムが    表示されます";
        var message = new Label();
        message.text = defaultMessage;
		message.font = "8px 'Consolas', 'Monaco', 'ＭＳ ゴシック'";
        message.width = 110;
 		message.moveTo(35,areaLength*16+12); 
		mainScene.addChild(message);
         
		var timerBG = new Sprite(308,16);
		timerBG.image = core.assets['../img/timer.jpg'];
        timerBG.x = 16;
        timerBG.y = areaLength*16+48;
        core.rootScene.addChild(timerBG);
        		
		for(var i=0;i<300;i++)
			timer[i] = new Bar(20+i,areaLength*16+52);

		for(var i=0;i<life;i++)
        	  lifes[i] = new Life(i*16+184,areaLength*16+8);
		
		for(var i=0;i<treeCount;i++)
			trees[i] = new Tree(i*17+276,areaLength*16+8);
		
		var treeImage = new Tree(0,0);
			treeImage.opacity =0;
		
		var scoreLabel = new Sprite (68,16);
		scoreLabel.image = core.assets['../img/score.png'];
		scoreLabel.x = (areaLength-9)*16-2;
		scoreLabel.y =areaLength*16+26;
		mainScene.addChild(scoreLabel);
	
		for(var i=0;i<5;i++){
        	 scoreBoard[i] = new Number((areaLength-5)*16+i*12,areaLength*16+26,'../img/number.png');
        	 mainScene.addChild(scoreBoard[i]);
        }
	
		var arrow = new Sprite(16,16);
		arrow.image = core.assets['../img/arrow.png'];
		arrow.opacity = 0;
		
		var effect = new Sprite(16,16);
		effect.image = core.assets['../img/effect0.png'];
		effect.frame=0;
		effect.opacity = 0;
	
		initializeData(ball,mainScene);
		 
		var map = new Map(16,16);
        map.image = core.assets['../img/map.png'];
   
        map.loadData(mapData); 
		core.rootScene.addChild(map);    
		core.pushScene(mainScene);
		mainScene.addChild(ball);
		mainScene.addChild(arrow);
        mainScene.addChild(effect);
		core.pushScene(gameStart);
                
		mainScene.addEventListener('enterframe',function(){	
			if(chara_x==centerX && chara_y==0){
				//soundTable['main'].stop();	
				//soundTable['clear'].play();
				var skullCount = judgeSkull();
				var total=score+life*1000+limit*50+skullCount*100;
				var tmp=10000;

				for(var i=0;i<5;i++){
					totalScore[i].frame= Math.floor(total/tmp);
					total = total%tmp;
					tmp = tmp /10;
				}	

				for(var i=0;i<5;i++)
        	 		scoreResult[i].frame = scoreBoard[i].frame;
        	 	lifeResult.frame = life;
        	 	
        	 	tmp = 100;
        	 	for(var i=0;i<3;i++){
					timeResult[i].frame = Math.floor(limit/tmp);
					limit = limit%tmp;
					tmp = tmp /10;
				}
				tmp = 10
				for(var i=0;i<2;i++){
					skullResult[i].frame = Math.floor(skullCount/tmp);
					skullCount = skullCount %tmp;
					tmp = tmp /10;
				}

				core.pushScene(gameClear);			
			}else{
				totalTime+=1;
				if(totalTime%core.fps==0){
					limit -= 1;
					if(limit<=0){
						
						gameoverLogo.opacity=1.0;					
						//soundTable['main'].stop();	
						core.pushScene(gameOver);
						//soundTable['gameover'].play();
					}	
					timer[limit].frame=1;
				}
			
				if(!explostionFlag){
					if(life <=0){	
			
						gameoverLogo.opacity=1.0;
						arrow.opacity = 0;
						//soundTable['main'].stop();	
						//soundTable['gameover'].play();
						core.pushScene(gameOver);
					}
					var tmp_x=0;
					var tmp_y=0;

					if(core.input.right)	tmp_x=1;		
					if(core.input.left)		tmp_x=-1;		
					if(core.input.up)		tmp_y=-1;		
					if(core.input.down)		tmp_y=1;
			
					if(core.input.right||core.input.left||core.input.up||core.input.down){	
						
						if(tmp_x!=0 || tmp_y!=0){
							var result =  check(tmp_x,tmp_y);
							if(!result){
								ball.opacity = 1.0;	
								arrow.opacity = 0;	
								arrowFlag=false;		
							}else{
								if(result==1){
									move(tmp_x,tmp_y,ball);
									ball.opacity = 1.0;
									arrow.opacity = 0;	
									arrowFlag=false;
									dx=0;
									dy=0;
								}else if(result==2 || result==3){
									ball.opacity = 0;
									arrow.opacity = 1.0;
									arrow.x=chara_x*16+tmp_x*10;
									arrow.y=chara_y*16+tmp_y*10;
									arrow.rotation=0;
									arrow.rotate(angle(tmp_x,tmp_y));
									dx=tmp_x;
									dy=tmp_y;
									var delay=true;
								}
							}
						}
					}
			
					if(arrowFlag){
						if (core.input.dig && !LOCK){
							var dc =  mapData[chara_y+dy][chara_x+dx];
							if(dc == mapTable["grass"] || dc == mapTable["life"] || dc == mapTable["item"]){
								move(dx,dy,ball);
								dig(chara_x,chara_y);
								if(dc == mapTable["grass"] && state[chara_y][chara_x]==mapTable["bomb"]){			
									subLife();
									explosionEffect(effect,ball,chara_x,chara_y);
								}else if(dc == mapTable["grass"]){
									//var d=soundTable['dig'].clone();
									//d.play();
									lock(300);	
									changeScore(100);
								}else if(dc == mapTable["life"]){
									addLife();
									//var h =soundTable['heal'].clone();
									//h.play();
									lock(300);
									changeScore(50);
								}else if(dc == mapTable["item"]){
									//var s=soundTable['star'].clone();
									//s.play()
									message.text = itemData[chara_y][chara_x];
									lock(300);
									changeScore(itemData[chara_y][chara_x].length*100);
								}						
								arrow.opacity = 0;
								ball.opacity = 1.0;	
								map.loadData(mapData);
								core.rootScene.addChild(map);
							}
						}else if(core.input.check  && !LOCK){
							if(mapData[chara_y+dy][chara_x+dx]==mapTable["grass"] || mapData[chara_y+dy][chara_x+dx]==mapTable["flag"]){
								mark(chara_x+dx,chara_y+dy);
								arrow.opacity = 0;	
								ball.opacity = 1.0;
								map.loadData(mapData);
								core.rootScene.addChild(map);
								lock(500);
							}
						}else if(core.input.tree && treeCount >0 && (mapData[chara_y+dy][chara_x+dx]==mapTable["grass"] ||  mapData[chara_y+dy][chara_x+dx]==mapTable["life"] || mapData[chara_y+dy][chara_x+dx]==mapTable["item"])){
							dig(chara_x+dx,chara_y+dy);
							treeCount -= 1;
							arrow.opacity = 0;	
							trees[treeCount].frame=1;
					
							if(state[chara_y+dy][chara_x+dx]===mapTable["bomb"]){
								//soundTable['explosion'].play();
								core.rootScene.addChild(map);
								explosionEffect(effect,ball,chara_x+dx,chara_y+dy);
							}else{
								treeImage.x=(chara_x+dx)*16;
								treeImage.y=(chara_y+dy)*16;
								treeImage.opacity = 1.0;
								blinkImg(treeImage,ball);
								core.rootScene.addChild(map);
								//soundTable['smash'].play();
							}
							lock(1000);
						}
					}
					if(delay)
						arrowFlag=true;
				}
			}
		});
    };
    core.start();
}

function blinkImg(s,b){
	var count=0;
	var id = setInterval(function(){
				s.opacity = (s.opacity==1)?0:1;
				count++;
				if(count>10){
					clearInterval(id);
					b.opacity=1;
				}
			},100);
}

function stock() {
  $.ajax({
    type: "get",
    dataType: "jsonp",
    url: "http://ja.wikipedia.org/w/api.php?action=query&list=random&rnnamespace=0&rnlimit=30&format=json",
    success: function(json) {
      $.each(json.query.random, function(i, e) {
        titles.push(e.title);
      });
      var tmp=0;
      
      for(var i=0;i<areaLength;i++)
      	 for(var j=0;j<areaLength;j++)
      	 	if(mapData[i][j]==mapTable["item"])
      	 		itemData[i][j]=titles[tmp++];
    }
  });
}

function initializeData(ball,mainScene){
	chara_x=centerX;
	chara_y=areaLength-1;
	ball.x=chara_x*16;
	ball.y=chara_y*16;
	arrowFlag=false;
	dx=0;
	dy=0;
	life = 5;
	LOCK=false;
	timerFlag=true;
	totalTime=0;
	score=0;
	limit=300;
	treeCount=3;
	
	for(var i=0;i<limit;i++)
		timer[i].frame=0;
	
	for(var i=0;i<life;i++)
		lifes[i].frame=0;
	
	for(var i=0;i<treeCount;i++)
		trees[i].frame=0
	
	 for(var i=0;i<4;i++)
		batteries[i].method1();
	
	for(var i=0;i<5;i++)
		 scoreBoard[i].frame=0;
		 
	for(var i =0;i<bullets.length;i++)
		mainScene.removeChild(bullets[i]);
	titles = [];
	setMine();
	count();
	stock();
}

function moves(x,y,ball){
	chara_x += x;
	chara_y += y;
	ball.x +=x*16;
	ball.y +=y*16;
	arrowFlag=false;
}

function changeScore(point){
	score += point;
	var tmp = score;
	var n=10000;
	
	for(var i=0;i<5;i++){
		scoreBoard[i].frame= Math.floor(tmp/n);
		tmp = tmp%n;
		n = n/10;
	}
}

function dig(x,y){	
	mapData[y][x]=state[y][x];
}

function lock(time){
	LOCK=true;
	window.setTimeout("unlock()",time);
}

function  unlock(){
	LOCK=false;
}

function subLife(){
	if(life>0){
		life -= 1;
		lifes[life].frame=1;
	}
}

function addLife(){
	if(life<5){
		lifes[life].frame=0;
		life += 1;
	}
}

function explosionEffect(effect,b,x,y){
	lock(1000);
	//soundTable['explosion'].play();						
	var count=0;
	effect.opacity = 1;
	effect.x=x*16;
	effect.y=y*16;
	explostionFlag=true;
						
	var id = setInterval(function(){
		effect.frame = count;
		count++;
		if(count>4){
			clearInterval(id);
			effect.opacity = 0;
			b.opacity=1;
			explostionFlag=false;
		}
		
	},250);
}

function check(x,y){
	try{
		var tmp = mapData[(chara_y+y)][(chara_x+x)];
 		if(tmp == mapTable["block"]){
			return false;
		}else if(tmp < 9 || tmp == mapTable["ground"] || tmp==mapTable["bomb"]){
			return 1;
		}else if(tmp == mapTable["grass"] || tmp==mapTable["item"] || tmp == mapTable["life"]){	
			return 2;
		}else if(tmp==mapTable["flag"]){
			return 3;
		}
	}catch (e){
	}	
	return false;	
}

function move(x,y,ball){
	chara_x += x;
	chara_y += y;
	ball.x +=x*16;
	ball.y +=y*16;
	arrowFlag=false;
}

function mark(x,y){
	mapData[y][x]=(mapData[y][x]==mapTable["flag"])?mapTable["grass"]:mapTable["flag"];
	arrowFlag=false;
	//soundTable['mark'].play();
}

function setMine(){
	for(i=0;i<areaLength;i++)
		state[i]=new Array(areaLength);	
	
	for(var i=0;i<areaLength;i++){
		if(i==0 || i==areaLength-1){
        	for(var j=0;j<areaLength;j++){
        		state[i][j]=0;
        	}
        }else{
 			for(var j=0;j<areaLength;j++){
 				if(j==0 || j==areaLength-1){
 					state[i][j]=0;
 				}else{
 					if(Math.floor(Math.random()*4)==0)
 						state[i][j]=mapTable["bomb"];
 					else
 						state[i][j]=0;
 				}
 			}
 		}
 	}
 	state[areaLength-2][centerX]=0;
 	state[1][centerX]=0;
 }
 

function count(){
	var cnt=0;
 	for(var i=0;i<areaLength;i++){
 		for(var j=0;j<areaLength;j++){
 			if(state[i][j]!=mapTable["bomb"]){	
 				var tmp=0;
 				for(var k=i-1;k<i+2;k++){
 					for(var l=j-1;l<j+2;l++){
 						try{
 							if(state[k][l]==mapTable["bomb"]){
 								tmp++;
 							}
						}catch (e){
						}
					}
				}
				state[i][j]=tmp
			}else{
				cnt++;
			}
		}
	}
	setMap(cnt);
}

function setMap(count){
	var max=19*19-count;
	for(var i=0;i<areaLength;i++){
        mapData[i] = new Array(areaLength);
        itemData[i] = new Array(areaLength);
        if(i==0 || i==areaLength-1){
        	for(var j=0;j<areaLength;j++){
        		mapData[i][j]=mapTable["block"];
        	}
        }else{
        	for(var j=0;j<areaLength;j++){
        		if(j==0 || j==areaLength-1){
        			mapData[i][j]=mapTable["block"];
        		}else{
        			if(state[i][j]!=mapTable["bomb"]){
        				var rnd = Math.floor(Math.random()*max);
        				if(rnd < 15){
        					mapData[i][j]=mapTable["item"];
        				}else if(rnd<25){
        					mapData[i][j]=mapTable["life"];
        				}else{
        					mapData[i][j]=mapTable["grass"];
						}
        			}else{
        				mapData[i][j]=mapTable["grass"];
        			}
        		}
        	}
        }
	}   
	mapData[0][centerX]=mapTable["ground"];	
	mapData[areaLength-1][centerX]=mapTable["ground"];
}


function judgeSkull(){
	var correctCount=0
	for(var i=0;i<areaLength;i++){
		for(var j=0;j<areaLength;j++){
			if(mapData[i][j]==9 && state[i][j]==13)
				correctCount+=1
		}
	}
	return correctCount;
}

function angle(x,y){
	var ang;
	if(x==0){
		if(y==0)		ang=0;
		else if(y==1)	ang=180;
		else if(y==-1)	ang=0;
	}else if(x==1){
		if(y==0)		ang=90;
		else if(y==1)	ang=120;
		else if(y==-1)	ang=45;
	}else if(x==-1){
		if(y==0)		ang=270;
		else if(y==1)	ang=225;
		else if(y==-1)	ang=315;
	}
	return ang;
}
