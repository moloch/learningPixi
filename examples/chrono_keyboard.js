//Aliases
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    TextureCache = PIXI.utils.TextureCache,
    Texture = PIXI.Texture,
    Sprite = PIXI.Sprite;

//Create a Pixi stage and renderer and add the
//renderer.view to the DOM
var stage = new Container(),
    renderer = autoDetectRenderer(800, 600);
document.body.appendChild(renderer.view);

//load a JSON file and run the `setup` function when it's done
loader
  .add("images/chrono.json")
  .add("images/treasureHunter.json")
  .load(setup);

//Define variables that might be used in more
//than one function
var blob
var frame_n = 0
var textures;

function loadTextures(){

  textures = {
    up:    [],
    left:  [],
    down:  [],
    right: []
  }

  Object.keys(textures).forEach(function (key){
    for (var i=0; i<= 3; i++){
        textures[key].push(Texture.fromFrame("chrono_" + key + "_" + i + ".png"))
    }
  })
}

function setup() {

  loadTextures();
  var chrono = new Character(textures['down'][0], 32, 32, 0, 0, ['down', 'still'])
  chrono.addControls();
  stage.addChild(chrono);

  blob = new Sprite.fromFrame("blob.png");
  blob.x = 300
  blob.y = 0
  blob.v = 1
  stage.addChild(blob);

  new Game().play(chrono);
}

function Game(){
}

Game.prototype.play = function(chrono) {

  requestAnimationFrame(function(){
      Game.prototype.play(chrono);
    }
  );

  if(frame_n % 10 == 0){
    chrono.pick_animation(frame_n / 10);
    if(frame_n == 40){
     chrono.pick_animation(0);
      frame_n = 0;
    }
  }
  

  if ((chrono.x > 0 || chrono.v['x']!= -1) && (chrono.x < 760 || chrono.v['x']!=1))
    chrono.x += chrono.v['x'] * 2;
  if ((chrono.y > 0 || chrono.v['y']!= -1) && (chrono.y < 530 || chrono.v['y']!=1))
    chrono.y += chrono.v['y'] * 2;

  if(blob.y > 575){
    blob.v = -1
  }
  if(blob.y < 0){
    blob.v = 1
  }
  blob.y += blob.v

  frame_n += 1;

  //Render the stage
  renderer.render(stage);
}

function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}