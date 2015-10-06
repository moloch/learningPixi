describe("Character", function() {

  var character

  var keyboard = function (keyCode) {
    return {}
  }

  beforeEach(function() {
    var texture = PIXI.Texture.fromImage("images/chrono.png")
    character = new Character(texture, 0, 0, 0, 0, ['down', 'still'])
    character.addControls()
  })

  it("should correctly update state for single pression" , function (){
    
    keys = ['up', 'left', 'down', 'right']
    for (var i = 0; i < keys.length; i++){
      character.controls[keys[i]]['key'].press()
      expect(character.state).toEqual([keys[i], 'moving'])
    }

  })

  it("should correctly update state for press + release of a single button" , function (){
    keys = ['up', 'left', 'down', 'right']
    for (var i = 0; i < keys.length; i++){
      character.controls[keys[i]]['key'].press()
      expect(character.state).toEqual([keys[i], 'moving'])
      character.controls[keys[i]]['key'].release()
      expect(character.state).toEqual([keys[i], 'still'])
    }
  })

})