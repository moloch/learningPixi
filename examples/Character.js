function Character(texture, x, y, vx, vy, state){
  
  PIXI.Sprite.call(this, texture)
  
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
    this.controls = {
      left:  { key: keyboard(37), axis: 'x', v: -1, others: ['up',   'right', 'down']},
      up:    { key: keyboard(38), axis: 'y', v: -1, others: ['left', 'right', 'down']},
      right: { key: keyboard(39), axis: 'x', v:  1, others: ['up',   'left',  'down']},
      down:  { key: keyboard(40), axis: 'y', v:  1, others: ['up',   'right', 'left']}
    }

    var self = this

    Object.keys(controls).forEach(function (key){

        self.controls[key]['key'].press = function() {
        self.state = [key, 'moving']
        self.v[controls[key]['axis']] = controls[key]['v']
      }

      controls[key]['key'].release = function() {
        self.state = [key, 'still']
        self.updateStatus(self.controls, self.controls[key]['others'])
        self.v[self.controls[key]['axis']] = 0
      }
    })
  }
}

Character.prototype = Object.create(PIXI.Sprite.prototype)
Character.prototype.constructor = Character