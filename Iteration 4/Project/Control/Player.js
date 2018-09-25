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
    return new Player(pos.plus(new Vec(0, -0.5)),
      new Vec(0, 0))
  }
}

Player.prototype.size = new Vec(0.4, 0.4)
Player.prototype.gravity = 30
Player.prototype.playerXSpeed = 7
Player.prototype.jumpSpeed = 17
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
