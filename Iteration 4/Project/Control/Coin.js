/* global Vec mySound State */
/* Coin has a Current Position (Vector)
a Starting Position (Vector)
and a Wobble which is an int */
var Coin = class Coin {
  constructor (pos, basePos, wobble) {
    this.pos = pos
    this.basePos = basePos
    this.wobble = wobble
  }
  get type () {
    return 'coin'
  }
  /* When the Coin is created set the pos/basePos to the given position plus 0.2,0.1
the starting phase of each coin is randomized. The phase of Math.sin’s wave,
the width of a wave it produces, is 2π. We multiply the value returned by Math.random (0->1) by
that number to give the coin a random starting position on the wave.
   */
  static create (pos) {
    let basePos = pos.plus(new Vec(0.2, 0.1))
    return new Coin(basePos, basePos,
      Math.random() * Math.PI * 2)
  }
}
/* When the player collides with a coin, filter that coin out of our list of actors, if there are no more coins left
after filtering then we won, so play a sound
else play the normal coin sound
return our new filtered state */
Coin.prototype.collide = function (state) {
  let filtered = state.actors.filter(a => a !== this)
  let status = state.status
  if (!filtered.some(a => a.type === 'coin')) {
    mySound.playWithID('Victory')
    status = 'won'
  } else {
    mySound.playWithID('Coin', true)
  }
  return new State(state.level, filtered, status)
}
/* Whenever a new frame is processed,
wobble = wobble + time (elapsed) * speed
Calculate a new position for the coin by taking the : sin of wobble * wobble distance
and adding it to our base position */
Coin.prototype.update = function (time) {
  let wobble = this.wobble + time * this.wobbleSpeed
  let wobblePos = Math.sin(wobble) * this.wobbleDist
  return new Coin(this.basePos.plus(new Vec(0, wobblePos)),
    this.basePos, wobble)
}
Coin.prototype.size = new Vec(0.6, 0.6)
Coin.prototype.wobbleSpeed = 4
Coin.prototype.wobbleDist = 0.1
