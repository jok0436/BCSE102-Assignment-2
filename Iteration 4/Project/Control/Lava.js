/* global Vec State */
/* Lava has a =
pos (position | which is a vec),
speed (some lava blocks move),
reset which is used for moving lava blocks to indicate where they return to after
hitting a wall, it is a Vector */
var Lava = class Lava {
  constructor (pos, speed, reset) {
    this.pos = pos
    this.speed = speed
    this.reset = reset
  }

  get type () {
    return 'lava'
  }
  /* All 3 Types of Lava are generated here =
the dripping block V,
the Horiztonal Moving block =,
the Vertical Moving Block V,
the dripping block utilizes the reset value of Lava to jump back to it's starting
position after colliding with a wall */
  static create (pos, ch) {
    if (ch === '=') {
      return new Lava(pos, new Vec(2, 0))
    } else if (ch === '|') {
      return new Lava(pos, new Vec(0, 2))
    } else if (ch === 'v') {
      return new Lava(pos, new Vec(0, 3), pos)
    }
  }
}
// If a player collides with lava, we lose
Lava.prototype.collide = function (state) {
  return new State(state.level, state.actors, 'lost')
}
/* Every time the game processes a new frame
we run this, it takes the time since the last frame and the games current state */
Lava.prototype.update = function (time, state) {
  // Distance Travelled = our current position plus (our speed * time)
  let newPos = this.pos.plus(this.speed.times(time))
  // if we didnt touch a wall then just move to our new position
  if (!state.level.touches(newPos, this.size, 'wall')) {
    return new Lava(newPos, this.speed, this.reset)
    // if we did touch a wall and we have a reset value (reset to start)
  } else if (this.reset) {
    return new Lava(this.reset, this.speed, this.reset)
    // we did touch a wall and we dont have a reset value (reverse direction)
  } else {
    return new Lava(this.pos, this.speed.times(-1))
  }
}
Lava.prototype.size = new Vec(1, 1)
