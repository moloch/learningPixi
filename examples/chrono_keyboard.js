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

function Character(texture, x, y, vx, vy, state){
  
  Sprite.call(this, texture)
  
  this.x = x;
  this.y = y;
  this.v = { x: vx, y: vy };
  this.state = state;

  this.updateStatus = function(controls, others){
    for(var i=0; i<others.length; i++) {
      if(controls[others[i]]['key'].isDown)
        this.state = [others[i], 'moving']
    }
  }

  this.pick_animation = function(animation_frame){
    var self = this
    if(self.state[1] == 'still'){
      animation_frame = 0;
    }
    Object.keys(textures).forEach(function (key){
      if (self.state[0] == key){
        self.texture = textures[key][animation_frame];
      }
    })
  }

  this.addControls = function (){
    var controls = {
      left:  { key: keyboard(37), axis: 'x', v: -1, others: ['up',   'right', 'down']},
      up:    { key: keyboard(38), axis: 'y', v: -1, others: ['left', 'right', 'down']},
      right: { key: keyboard(39), axis: 'x', v:  1, others: ['up',   'left',  'down']},
      down:  { key: keyboard(40), axis: 'y', v:  1, others: ['up',   'right', 'left']}
    }

    var self = this

    Object.keys(controls).forEach(function (key){

      controls[key]['key'].press = function() {
        self.state = [key, 'moving']
        self.v[controls[key]['axis']] += controls[key]['v']
      }

      controls[key]['key'].release = function() {
        self.state = [key, 'still']
        self.updateStatus(controls, controls[key]['others'])
        self.v[controls[key]['axis']] = 0
      }
    })
  }
}

Character.prototype = Object.create(Sprite.prototype)
Character.prototype.constructor = Character

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

  if(frame_n == 10){
    chrono.pick_animation(1);
  }
  if(frame_n == 20){
    chrono.pick_animation(2);
  }
  if(frame_n == 30){
    chrono.pick_animation(3);
  }
  if(frame_n == 40){
    chrono.pick_animation(0);
    frame_n = 0;
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