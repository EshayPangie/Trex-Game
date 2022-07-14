var die;
var checkPoint;
var jump;
var score = 0;
var trexCollided;
var gameOver_sprite;
var restart_sprite;
var gameOver_image;
var restart_image;
var obstacleGroup;
var cloudGroup;
var gameState = "play";
var obstacle1_image;
var obstacle2_image;
var obstacle3_image;
var obstacle4_image;
var obstacle5_image;
var obstacle6_image;
var ground_image;
var ground_sprite;
var trex_running;
var trex_sprite;
var cloud_image;
var cloud_sprite;
var invisibleGround;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  ground_image = loadImage("ground2.png");
  cloud_image = loadImage("cloud.png");
  obstacle1_image = loadImage("obstacle1.png");
  obstacle2_image = loadImage("obstacle2.png");
  obstacle3_image = loadImage("obstacle3.png");
  obstacle4_image = loadImage("obstacle4.png");
  obstacle5_image = loadImage("obstacle5.png");
  obstacle6_image = loadImage("obstacle6.png");
  gameOver_image = loadImage("gameOver.png");
  restart_image = loadImage("restart.png");
  trexCollided = loadAnimation("trex_collided.png");
  die = loadSound("die.mp3");
  checkPoint = loadSound("checkPoint.mp3");
  jump = loadSound("jump.mp3")
}

function setup() {
  createCanvas(600, 200);
  trex_sprite = createSprite(50, 160, 10, 10);
  trex_sprite.addAnimation("running", trex_running);
  trex_sprite.addAnimation("collided", trexCollided);
  trex_sprite.scale = 0.5;
  ground_sprite = createSprite(300, 180, 600, 10);
  ground_sprite.addImage("background", ground_image);
  invisibleGround = createSprite(300, 190, 600, 10);
  invisibleGround.visible = false;
  obstacleGroup = createGroup();
  cloudGroup = createGroup();
  gameOver_sprite = createSprite(290, 70, 20, 20);
  restart_sprite = createSprite(300, 100, 15, 15);
  gameOver_sprite.addImage("gameOver", gameOver_image);
  restart_sprite.addImage("restart", restart_image);
  gameOver_sprite.scale = 0.5;
  restart_sprite.scale = 0.4;
}

function draw() {
  background("black");
  text("score=" + score, 530, 20);

  trex_sprite.collide(invisibleGround);

  if (gameState == "play") {
    score = score + 0.5;
    trex_sprite.changeAnimation("running", trex_running);
    if (keyDown("space") && trex_sprite.y > 110) {
      trex_sprite.velocityY = -12;
      jump.play()
    }
    if(score % 200 == 0){
      checkPoint.play()
    }
    trex_sprite.velocityY = trex_sprite.velocityY + 1;
    ground_sprite.velocityX = -10;
    if (ground_sprite.x < 0) {
      ground_sprite.x = 300;
    }
    if (trex_sprite.isTouching(obstacleGroup)) {
      gameState = "end";
      die.play()
    }
    generateClouds();
    generateObstacles();
    gameOver_sprite.visible = false;
    restart_sprite.visible = false;
  }

  if (gameState == "end") {
    trex_sprite.changeAnimation("collided", trexCollided);
    ground_sprite.velocityX = 0;
    obstacleGroup.setVelocityXEach(0);
    cloudGroup.setVelocityXEach(0);
    obstacleGroup.setLifetimeEach(-100);
    cloudGroup.setLifetimeEach(-100);
    gameOver_sprite.visible = true;
    restart_sprite.visible = true;
    if (mousePressedOver(restart_sprite)) {
      restartGame();
    }
  }
  drawSprites();
}

function generateClouds() {
  if (frameCount % 60 == 0) {
    cloud_sprite = createSprite(570, 50, 15, 15);
    cloud_sprite.addImage("cloud", cloud_image);
    cloud_sprite.velocityX = -7;
    cloud_sprite.y = Math.round(random(0, 60));
    cloud_sprite.scale = 0.6;
    cloud_sprite.lifetime = 79;
    cloudGroup.add(cloud_sprite);
  }
}

function generateObstacles() {
  if (frameCount % 50 == 0) {
    obstacle_sprite = createSprite(590, 160, 15, 15);
    obstacle_sprite.velocityX = -6;
    var obstacle = Math.round(random(1, 6));
    switch (obstacle) {
      case 1:
        obstacle_sprite.addImage("obstacle1", obstacle1_image);
        break;
      case 2:
        obstacle_sprite.addImage("obstacle2", obstacle2_image);
        break;
      case 3:
        obstacle_sprite.addImage("obstacle3", obstacle3_image);
        break;
      case 4:
        obstacle_sprite.addImage("obstacle4", obstacle4_image);
        break;
      case 5:
        obstacle_sprite.addImage("obstacle5", obstacle5_image);
        break;
      case 6:
        obstacle_sprite.addImage("obstacle6", obstacle6_image);
        break;
    }
    obstacle_sprite.scale = 0.55;
    obstacle_sprite.lifetime = 103;
    obstacleGroup.add(obstacle_sprite);
  }
}

function restartGame() {
  cloudGroup.destroyEach();
  obstacleGroup.destroyEach();
  score = 0;
  gameState = "play";
}