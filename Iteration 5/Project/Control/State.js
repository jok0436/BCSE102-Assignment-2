/* global Timer */
/* So state holds our level, our actors and a status about whats happenning */
var State = class State {
  constructor (level, timer, actors, status) {
    this.level = level
    this.timer = timer
    this.actors = actors
    this.status = status
  }

  static start (level) {
    var timer = new Timer(0, 0, level.completeTime)
    return new State(level, timer, level.startActors, 'playing')
  }

  get player () {
    return this.actors.find(a => a.type === 'player')
  }

  get touchRingBlack () {
    return this.actors.find(a => a.name === 'touchRingBlack')
  }

  get touchRingWhite () {
    return this.actors.find(a => a.name === 'touchRingWhite')
  }
}
/* Whenever we process a frame, update all actors, create newState with these new values
if the status of newstate does not equal playing simply return newstate, if we are
touching lava now after updating our player then we lose, for each actor if we overlap with the player
then trigger the collide value of that actor. finally return newstate */
State.prototype.update = function (time, keys) {
  let actors = this.actors
    .map(actor => actor.update(time, this, keys))
  let newState = new State(this.level, this.timer, actors, this.status)

  if (newState.status !== 'playing') return newState

  let player = newState.player
  if (this.level.touches(player.pos, player.size, 'lava')) {
    return new State(this.level, this.timer, actors, 'lost')
  }

  for (let actor of actors) {
    if (actor !== player && this.overlap(actor, player)) {
      newState = actor.collide(newState)
    }
  }
  return newState
}
State.prototype.overlap = function (actor1, actor2) {
  return actor1.pos.x + actor1.size.x > actor2.pos.x &&
    actor1.pos.x < actor2.pos.x + actor2.size.x &&
    actor1.pos.y + actor1.size.y > actor2.pos.y &&
    actor1.pos.y < actor2.pos.y + actor2.size.y
}
