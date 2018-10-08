/* global Vec */
var Player = class Player {
  constructor (pos, speed) {
    this.pos = pos
    this.speed = speed
  }

  get type () {
    return 'player'
  }

  static create (pos) {
    return new Player(pos.plus(new Vec(0, 0)),
      new Vec(0, 0))
  }
}
/* That leaves the player itself. Player motion is handled separately per axis because hitting the floor
 should not prevent horizontal motion, and hitting a wall should not stop falling or jumping motion. */
Player.prototype.update = function (time, state, keys) {
  let xSpeed = 0
  if (keys.ArrowLeft) xSpeed -= this.playerXSpeed
  if (keys.ArrowRight) xSpeed += this.playerXSpeed
  let pos = this.pos
  let movedX = pos.plus(new Vec(xSpeed * time, 0))
  if (!state.level.touches(movedX, this.size, 'wall')) {
    pos = movedX
  }

  let ySpeed = this.speed.y + time * this.gravity
  let movedY = pos.plus(new Vec(0, ySpeed * time))
  if (!state.level.touches(movedY, this.size, 'wall')) {
    pos = movedY
  } else if (keys.ArrowUp && ySpeed > 0) {
    ySpeed = -this.jumpSpeed
  } else {
    ySpeed = 0
  }
  return new Player(pos, new Vec(xSpeed, ySpeed))
}
/* The horizontal motion is computed based on the state of the left and right arrow keys. When there’s no wall blocking the new
position created by this motion, it is used. Otherwise, the old position is kept. Vertical motion works in a similar way but
has to simulate jumping and gravity. The player’s vertical speed (ySpeed) is first accelerated to account for gravity.
We check for walls again. If we don’t hit any, the new position is used. If there is a wall, there are two possible
outcomes. When the up arrow is pressed and we are moving down (meaning the thing we hit is below us), the speed is set to a
relatively large, negative value. This causes the player to jump. If that is not the case, the player simply bumped into something,
and the speed is set to zero. The gravity strength, jumping speed, and pretty much all other constants in this game have been set
by trial and error. I tested values until I found a combination I liked */
Player.prototype.size = new Vec(0.4, 0.4)
Player.prototype.gravity = 30
Player.prototype.playerXSpeed = 7
Player.prototype.jumpSpeed = 17
Player.prototype.lives = 3
