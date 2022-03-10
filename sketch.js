//https://p5js.org/reference/#/p5/preload
//https://molleindustria.github.io/p5.play/docs/classes/Sprite.html
var trex;
var trexAnimation;
var ground, groundimage;
var invisibleground;
var clouds, cloudsImage;
var obsticales;
var score = 0;
var play = 0;
var end = 1;
var gamestate = play;
var cloudsgroup;
var obstiaclesgroup;
var trex_collided
var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var gameover,gameoverImage
var restart,restartImage
var jump,jumpsound
var die,diesound
var checkpoint,checkpointsound
var trexduck

// called array
sessionStorage["Highest Score"]= 0

function preload() {
  trexAnimation = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  groundimage = loadImage("ground2.png");
  cloudsImage = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  trexduck=loadImage("TREX Duck.png")
  die = loadSound("die.mp3")
  jump = loadSound("jump.mp3")
  checkpoint = loadSound("checkpoint.mp3")
  trex_collided = loadImage("trex_collided.png")
  gameoverImage = loadImage("gameOver.png")
  restartImage = loadImage("restart.png")
}

function setup() {
  //createCanvas(1000,200);
  createCanvas(windowWidth,windowHeight);
  trex = createSprite(30, height-100, 100, 100);
  trex.addAnimation("TREX", trexAnimation);
  trex.addAnimation("collided",trex_collided)
  trex.addAnimation("duck",trexduck)
  trex.scale = 0.3;

  ground = createSprite(500, height-70, 1000, 10);
  ground.addImage("Ground", groundimage);

  //invisibleground = createSprite(500, 195, 1000, 10);
  invisibleground = createSprite(500, height-65, 1000, 10);
  invisibleground.visible = false;

  cloudsgroup = createGroup();
  obstiaclesgroup = createGroup();
  gameover = createSprite(700,height/2+100)
  gameover.addImage("gameover",gameoverImage)
  gameover.scale = 0.3
  restart = createSprite(700,height/2+130)
  restart.addImage("restart",restartImage)
  restart.scale = 0.3

  //debug trex sprite
  trex.debug = false
  //trex.setCollider("rectangle",0,0,80,80);
  trex.setCollider("circle",0,0,50);

  //AI to the trex
  //trex.setCollider("circle",0,0,trex.height-160);
}


function draw() {
  background("black");
  drawSprites();
  text("Score: " + score, 500, height/2+100);
  text("Highest Score "+sessionStorage["Highest Score"],500,height/2+80)

  if (gamestate === play) {
    ground.velocityX = -(4+3*score/100);
    restart.visible=false
    gameover.visible = false

    

    //infinite ground
    if (ground.x < 0) {
      ground.x = 500;
    }
    //Jump Trex
      /*if (keyDown("space") && trex.y >= 175) {
      trex.velocityY = -9;
      jump.play()
    
    }*/
    
    if (keyDown("space") && trex.y >= height-120) {
      trex.velocityY = -9;
      jump.play()
    
    }
    else if((touches.length>0 && trex.y >= height-120))   {
      trex.velocityY = -9;
      jump.play()
      touches = []
    }

    if(keyWentDown("Down")) {
    trex.changeAnimation("duck",trexduck)
    trex.scale = 0.2

    }
    if(keyWentUp("Down")) {
      trex.changeAnimation("TREX", trexAnimation);
      trex.scale = 0.3
  
      }
    //gravity trex
    trex.velocityY = trex.velocityY + 0.5;
    //clouds
    createclouds();
    create_obsticales();
    //increase score based on frame count
    score = score + Math.round(frameCount%5 === 0);
    if(score> 0 && score%50 === 0) {
      checkpoint.play()
  
      }
    //switching to end state
    if (obstiaclesgroup.isTouching(trex)) {
      gamestate = end;
      trex.changeAnimation("collided",trex_collided)
      die.play()
      //trex.velocityY= -8
    }
  } else if (gamestate === end) {
    //Ending
    restart.visible=true
    gameover.visible = true
    //ground speed
    ground.velocityX = 0;
    trex.velocityY = 0;
    cloudsgroup.setVelocityXEach(0);
    obstiaclesgroup.setVelocityXEach(0);
    cloudsgroup.setLifetimeEach(-1);
    obstiaclesgroup.setLifetimeEach(-1);


    if(touches.length  || mousePressedOver(restart))  {
    resetGame()
    touches = []

    }


  }

  trex.collide(invisibleground);
  //console.log(trex.y)
  console.log(frameCount);
  //console.log(Math.random(0,10))
  //console.log(Math.round(0.009))
}
function createclouds() {
  if (frameCount % 80 === 0) {
    clouds = createSprite(900, 60, 60, 10);
    clouds.addImage(cloudsImage);
    clouds.velocityX = -4;
    clouds.y = Math.round(random((height-230), (height-270)));
    clouds.depth = trex.depth;
    clouds.scale = Math.random(0.3, (0, 6));
    //console.log("clouds depth" + clouds.depth);
    //console.log("trex depth" + trex.depth);
    trex.depth += 1;
    clouds.lifetime = 227;
    //adding clouds to group
    cloudsgroup.add(clouds);
  }
}

function create_obsticales() {
  if (frameCount % 60 === 0) {
    //obsticales = createSprite(900, 175, 10, 80);
    obsticales = createSprite(width-20, height-80, 10, 80);
    obsticales.velocityX = -(5+score/100);
    obsticales.depth = trex.depth;
    trex.depth += 1;
    obsticales.scale = 0.4;
    obsticales.lifetime = 280;
    //adding cactus to the group
    obstiaclesgroup.add(obsticales);
    //console.log("obsticales depth" + obsticales.depth);
    //console.log("trex depth" + trex.depth);
    var number = Math.round(random(1, 6));

    switch (number) {
      case 1:
        obsticales.addImage(obstacle1);
        break;
      case 2:
        obsticales.addImage(obstacle2);
        break;
      case 3:
        obsticales.addImage(obstacle3);
        break;
      case 4:
        obsticales.addImage(obstacle4);
        break;
      case 5:
        obsticales.addImage(obstacle5);
        break;
      case 6:
        obsticales.addImage(obstacle6);
        break;
      default:
        break;
    }
  }
}

function resetGame () {

gamestate = play
cloudsgroup.destroyEach();
obstiaclesgroup.destroyEach();
trex.changeAnimation("TREX", trexAnimation);

if(sessionStorage["Highest Score"]<score) {
sessionStorage["Highest Score"] = score

}
score = 0

}


//Lifetime= distane/velocity
