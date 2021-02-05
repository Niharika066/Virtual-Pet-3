//Create variables here
var dog,sadDog,happyDog,garden,washroom,database;
var foodS,foodStock;
var fedTime,lastFed,currentTime;
var feed,addFood;
var foodObj;
var gameState,readState;

function preload()
{
  //load images here
  happydog=loadImage("images/happydog.png");
  sadDog=loadImage("images/Dog.png");
  bedroom=loadImage("images/Bed Room.png");
  garden=loadImage("images/Garden.png");
  washroom=loadImage("images/Wash Room.png");
}

function setup() {
  database = firebase.database();
   createCanvas(600, 500);

  foodObj=new Food();

  foodStock=database.ref('food');
  foodStock.on("value",readStock);

  fedTime=database.ref('feedTime');
  fedTime.on("value",function (data){
    lastFed=data.val();
  });

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });

dog=createSprite(200,400,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  feed=createButton("Feed the Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoodS);  
}

function draw() { 
  currentTime=hour();
  if(currentTime===lastFed+1){
    update("playing");
    foodObj.garden();
  }
  else if(currentTime==(lastFed+2)){
    update("sleeping");
    foodObj.bedroom();
  }
  else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
  update("bathing");
  foodObj.washroom();
  }
  else{
    update("hungry");
    foodObj.display();
  }
if(gameState!="hungry"){
  feed.hide();
  addFood.hide();
  dog.remove();
}
else{
  feed.show();
  addFood.show();
  dog.addImage(sadDog);
}
  drawSprites();
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
 dog.addImage(happyDog);

 foodObj.updateFoodStock(foodObj.getFoodStock()-1)
database.ref('/').update({
  food:foodObj.getFoodStock(),
  feedTime:hour(),
  gameState:"hungry"
})
}
function addFoodS(){
  foodS++;
  database.ref('/').update({
    food:foodS
  })
}
  function update(state){
  database.ref('/').update({
    gameState:state
})
}