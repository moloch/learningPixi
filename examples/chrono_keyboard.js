var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    TextureCache = PIXI.utils.TextureCache,
    Texture = PIXI.Texture,
    Sprite = PIXI.Sprite;

var stage = new Container(),
    renderer = autoDetectRenderer(800, 600);
document.body.appendChild(renderer.view);

loader
  .add("images/chrono.json")
  .add("images/treasureHunter.json")
  .load(setup);

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