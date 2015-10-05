describe("Character", function() {

  var character
  var controls

  var keyboard = function (keyCode) {
    return {}
  }

  beforeEach(function() {
    var texture = PIXI.Texture.fromImage("images/chrono.png")
    character = new Character(texture, 0, 0, 0, 0, ['down', 'still'])
    controls = {
      left:  { key: keyboard(37), axis: 'x', v: -1, others: ['up',   'right', 'down']},
      up:    { key: keyboard(38), axis: 'y', v: -1, others: ['left', 'right', 'down']},
      right: { key: keyboard(39), axis: 'x', v:  1, others: ['up',   'left',  'down']},
      down:  { key: keyboard(40), axis: 'y', v:  1, others: ['up',   'right', 'left']}
    }
  })

  it("should correctly update status", function() {
    expect(character.state).toEqual(['down', 'still'])
    
    controls['left']['key'].isDown = true
    character.updateStatus(controls, ['up', 'left', 'right'])
    expect(character.state).toEqual(['left', 'moving'])
    controls['left']['key'].isDown = false
    
    controls['up']['key'].isDown = true
    character.updateStatus(controls, ['up', 'left', 'right'])
    expect(character.state).toEqual(['up', 'moving'])
    controls['up']['key'].isDown = false

    controls['down']['key'].isDown = true
    character.updateStatus(controls, ['down', 'left', 'right'])
    expect(character.state).toEqual(['down', 'moving'])
    controls['down']['key'].isDown = false

    controls['right']['key'].isDown = true
    character.updateStatus(controls, ['up', 'left', 'right'])
    expect(character.state).toEqual(['right', 'moving'])
    controls['right']['key'].isDown = false
  })

})