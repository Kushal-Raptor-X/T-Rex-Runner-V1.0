var LOGO = 0;
var PLAY = 1;
var END = 2;
var SHOP = 3;
var gameState = LOGO;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var coinsGroup, coinImg;

var score=0;
var cscore=0;

var gameOver, restart;

localStorage["HighestScore"] = 0;

var jumpS, dieS, checkPointS, coinSound;

var logo, logoImg;
var shop, shopImg;

function preload(){
  trex_running =   loadAnimation("imgs/trex1.png","imgs/trex3.png","imgs/trex4.png");
  trex_collided = loadAnimation("imgs/trex_collided.png");
  
  groundImage = loadImage("imgs/ground2.png");
  coinImg = loadImage("imgs/bitcoin.png");
  cloudImage = loadImage("imgs/cloud.png");
  
  obstacle1 = loadImage("imgs/obstacle1.png");
  obstacle2 = loadImage("imgs/obstacle2.png");
  obstacle3 = loadImage("imgs/obstacle3.png");
  obstacle4 = loadImage("imgs/obstacle4.png");
  obstacle5 = loadImage("imgs/obstacle5.png");
  obstacle6 = loadImage("imgs/obstacle6.png");
  
  gameOverImg = loadImage("imgs/gameOver.png");
  restartImg = loadImage("imgs/restart.png");

  jumpS = loadSound('sounds/jump.mp3');
  dieS = loadSound('sounds/die.mp3');
  checkPointS = loadSound('sounds/checkPoint.mp3');
  coinSound = loadSound('sounds/coin.mp3');

  logoImg = loadImage("imgs/logo.png");
  shopImg = loadImage('imgs/shop.png');
}

function setup() {
  createCanvas(displayWidth, displayHeight-200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.setCollider("circle");
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  //trex.velocityX = (6 + 3*score/100);
  
  ground = createSprite(displayWidth*2,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  // ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(displayWidth/2,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(displayWidth/2,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,displayWidth,10);
  invisibleGround.visible = false;
  invisibleGround.velocityX = trex.velocityX;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  coinsGroup = new Group();
  
  score = 0;
  cscore = 0;

  logo = createSprite(displayWidth/2, displayHeight/4);
  logo.addImage(logoImg);
  
  shop = createSprite(displayWidth-130,16);
  shop.addImage(shopImg);
  shop.scale = 0.25;
}

function draw() {
  //trex.debug = true;
  background(150); //150
  
  
  
  //console.log(trex.position.y);
  
  if(gameState===LOGO){
    logo.visible = true;
    trex.visible = false;
    ground.visible = false;
    shop.visible = false;

    if(keyDown("space")){
      gameState = PLAY;
    }
  }
  if(gameState===PLAY || gameState===END){
    textSize(15);
    fill(33,33,33);
    text("High Score: "+ localStorage["HighestScore"], 10,5);
    text("Score: "+ score, 10,20);  
    text("Coins: "+ cscore, displayWidth-100,20);

    fill(0,255,255);
    text("T-REX RUNNER V1.0", 10, ground.y+30);
    text("- by KUSHAL NAIK", displayWidth-140, ground.y+30);
  }
  if (gameState===PLAY){
    logo.visible = false;
    trex.visible = true;
    ground.visible = true;
    

    trex.depth = ground.depth+1;
    
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);

    camera.position.x = displayWidth/2;
    camera.position.y = trex.y;

    if((keyDown("space") || keyDown(UP_ARROW)) && trex.y >= 159) {
      jumpS.play();
      trex.velocityY = -12;
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }

    if (trex.isTouching(coinsGroup)) {
      coinSound.play();
      coinsGroup.destroyEach();
      //speed = speed - 0.5;
      cscore = cscore + 1;  
    }

    if(score>0 && score%100 === 0){
      checkPointS.play();
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
    spawnCoins();
  
    if(obstaclesGroup.isTouching(trex)){
      dieS.play();
      gameState = END;
    }
  }
  if (gameState === END) {
    gameOver.visible = true;
    //gameOver.depth = cloud.depth+1;
    restart.visible = true;
    //shop.visible = true;
    //restart.depth = obstacle.depth+1;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    coinsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
    // if(mousePressedOver(shop)){
    //   gameState = SHOP;
    // }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(camera.x+displayWidth/2,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable // t = d/s
    cloud.lifetime = displayWidth/3+5;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnCoins() {
  //write code here to spawn the coins
  if (frameCount % 100 === 0) {
    var coin = createSprite(camera.x+displayWidth/2,120,20,20);
    coin.y = Math.round(random(120, 160));
    coin.addImage(coinImg);
    coin.scale = 0.025;
    coin.velocityX = -(6 + 3*score/100);
    coin.setCollider("circle");
    //coin.debug = true;
    
     //assign lifetime to the variable // t = d/s
    coin.lifetime = displayWidth/3+5;
    
    
    
    //add each cloud to the group
    coinsGroup.add(coin);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(camera.x+displayWidth/2,165,10,40);
    //obstacle.setCollider("circle");
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = displayWidth/obstacle.velocityX+5;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  coinsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}