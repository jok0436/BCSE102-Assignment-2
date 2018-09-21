/* jshint esversion:6 */
var Level = class Level {
  constructor (plan) {
    let rows = plan.trim().split('\n').map(l => [...l])
    this.height = rows.length
    this.width = rows[0].length
    this.startActors = []

    this.rows = rows.map((row, y) => {
      return row.map((ch, x) => {
        let type = levelChars[ch]
        if (typeof type === 'string') return type
        this.startActors.push(
          type.create(new Vec(x, y), ch))
        return 'empty'
      })
    })
  }
}

var State = class State {
  constructor (level, actors, status) {
    this.level = level
    this.actors = actors
    this.status = status
  }

  static start (level) {
    return new State(level, level.startActors, 'playing')
  }

  get player () {
    return this.actors.find(a => a.type === 'player')
  }
}

var Vec = class Vec {
  constructor (x, y) {
    this.x = x
    this.y = y
  }
  plus (other) {
    return new Vec(this.x + other.x, this.y + other.y)
  }
  times (factor) {
    return new Vec(this.x * factor, this.y * factor)
  }
}

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

var Lava = class Lava {
  constructor (pos, speed, reset) {
    this.pos = pos
    this.speed = speed
    this.reset = reset
  }

  get type () {
    return 'lava'
  }

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

Lava.prototype.size = new Vec(1, 1)

var Coin = class Coin {
  constructor (pos, basePos, wobble) {
    this.pos = pos
    this.basePos = basePos
    this.wobble = wobble
  }

  get type () {
    return 'coin'
  }

  static create (pos) {
    let basePos = pos.plus(new Vec(0.2, 0.1))
    return new Coin(basePos, basePos,
      Math.random() * Math.PI * 2)
  }
}

Coin.prototype.size = new Vec(0.6, 0.6)

var levelChars = {
  '.': 'empty',
  '#': 'wall',
  '+': 'lava',
  '@': Player,
  'o': Coin,
  '=': Lava,
  '|': Lava,
  'v': Lava
}

var scale = 20

Level.prototype.touches = function (pos, size, type) {
  var xStart = Math.floor(pos.x)
  var xEnd = Math.ceil(pos.x + size.x)
  var yStart = Math.floor(pos.y)
  var yEnd = Math.ceil(pos.y + size.y)

  for (var y = yStart; y < yEnd; y++) {
    for (var x = xStart; x < xEnd; x++) {
      let isOutside = x < 0 || x >= this.width ||
        y < 0 || y >= this.height
      let here = isOutside ? 'wall' : this.rows[y][x]
      if (here === type) return true
    }
  }
  return false
}

State.prototype.update = function (time, keys) {
  let actors = this.actors
    .map(actor => actor.update(time, this, keys))
  let newState = new State(this.level, actors, this.status)

  if (newState.status !== 'playing') return newState

  let player = newState.player
  if (this.level.touches(player.pos, player.size, 'lava')) {
    return new State(this.level, actors, 'lost')
  }

  for (let actor of actors) {
    if (actor !== player && overlap(actor, player)) {
      newState = actor.collide(newState)
    }
  }
  return newState
}

function overlap (actor1, actor2) {
  return actor1.pos.x + actor1.size.x > actor2.pos.x &&
    actor1.pos.x < actor2.pos.x + actor2.size.x &&
    actor1.pos.y + actor1.size.y > actor2.pos.y &&
    actor1.pos.y < actor2.pos.y + actor2.size.y
}

Lava.prototype.collide = function (state) {
  return new State(state.level, state.actors, 'lost')
}

Coin.prototype.collide = function (state) {
  let filtered = state.actors.filter(a => a !== this)
  let status = state.status
  if (!filtered.some(a => a.type === 'coin')) status = 'won'
  return new State(state.level, filtered, status)
}

Lava.prototype.update = function (time, state) {
  let newPos = this.pos.plus(this.speed.times(time))
  if (!state.level.touches(newPos, this.size, 'wall')) {
    return new Lava(newPos, this.speed, this.reset)
  } else if (this.reset) {
    return new Lava(this.reset, this.speed, this.reset)
  } else {
    return new Lava(this.pos, this.speed.times(-1))
  }
}

var wobbleSpeed = 4
var wobbleDist = 0.1

Coin.prototype.update = function (time) {
  let wobble = this.wobble + time * wobbleSpeed
  let wobblePos = Math.sin(wobble) * wobbleDist
  return new Coin(this.basePos.plus(new Vec(0, wobblePos)),
    this.basePos, wobble)
}

var playerXSpeed = 7
var gravity = 30
var jumpSpeed = 17

Player.prototype.update = function (time, state, keys) {
  let xSpeed = 0
  if (keys.ArrowLeft) xSpeed -= playerXSpeed
  if (keys.ArrowRight) xSpeed += playerXSpeed
  let pos = this.pos
  let movedX = pos.plus(new Vec(xSpeed * time, 0))
  if (!state.level.touches(movedX, this.size, 'wall')) {
    pos = movedX
  }

  let ySpeed = this.speed.y + time * gravity
  let movedY = pos.plus(new Vec(0, ySpeed * time))
  if (!state.level.touches(movedY, this.size, 'wall')) {
    pos = movedY
  } else if (keys.ArrowUp && ySpeed > 0) {
    ySpeed = -jumpSpeed
  } else {
    ySpeed = 0
  }
  return new Player(pos, new Vec(xSpeed, ySpeed))
}

function trackKeys (keys) {
  let down = Object.create(null)

  function track (event) {
    if (keys.includes(event.key)) {
      down[event.key] = event.type === 'keydown'
      event.preventDefault()
    }
  }
  window.addEventListener('keydown', track)
  window.addEventListener('keyup', track)
  return down
}

var arrowKeys =
  trackKeys(['ArrowLeft', 'ArrowRight', 'ArrowUp'])

function runAnimation (frameFunc) {
  let lastTime = null

  function frame (time) {
    if (lastTime != null) {
      let timeStep = Math.min(time - lastTime, 100) / 1000
      if (frameFunc(timeStep) === false) return
    }
    lastTime = time
    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}

function runLevel (level, Display) {
  let display = new Display(document.body, level)
  let state = State.start(level)
  let ending = 1
  return new Promise(resolve => {
    runAnimation(time => {
      state = state.update(time, arrowKeys)
      display.setState(state)
      if (state.status === 'playing') {
        return true
      } else if (ending > 0) {
        ending -= time
        return true
      } else {
        display.clear()
        resolve(state.status)
        return false
      }
    })
  })
}

async function runGame (plans, Display) {
  for (let level = 0; level < plans.length;) {
    let status = await runLevel(new Level(plans[level]),
      Display)
    if (status === 'won') level++
  }
  console.log("You've won!")
}

var CanvasDisplay = class CanvasDisplay {
  constructor (parent, level) {
    this.canvas = document.createElement('canvas')
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
    parent.appendChild(this.canvas)
    this.cx = this.canvas.getContext('2d')
    this.flipPlayer = false

    this.viewport = {
      left: 0,
      top: 0,
      width: Math.min(level.rows[0].length, this.canvas.width / scale),
      height: Math.min(level.rows.length, this.canvas.height / scale)
    }
  }

  clear () {
    this.canvas.remove()
  }
}

CanvasDisplay.prototype.setState = function (state) {
  this.updateCanvas(state)
  this.updateViewport(state)
  this.clearDisplay(state.status)
  this.drawBackground(state.level)
  this.drawActors(state.actors)
}
CanvasDisplay.prototype.updateCanvas = function (state) {
  this.canvas.width = window.innerWidth
  this.canvas.height = window.innerHeight
}

CanvasDisplay.prototype.updateViewport = function (state) {
  let view = this.viewport
  let player = state.player
  let center = player.pos.plus(player.size.times(0.5))
  let scaledDownCanvasWidth = this.canvas.width / scale
  let scaledDownCanvasHeight = this.canvas.height / scale
  let levelWidth = state.level.width
  let levelHeight = state.level.height
  // Calculate the width and height of the viewport
  view.width = Math.min(levelWidth, scaledDownCanvasWidth)
  view.height = Math.min(levelHeight, scaledDownCanvasHeight)
  // Make sure to do this V AFTER calculating the width and height of the viewport
  // Calculate the positions of the camera that would center on the player, as well
  // The maximum positions that the camera could be at
  let playerXMinusView = center.x - (view.width / 2)
  let lastPossibleCameraX = levelWidth - view.width
  let playerYMinusView = center.y - (view.height / 2)
  let lastPossibleCameraY = levelHeight - view.height
  // sets the position of the camera
  view.left = clamp(playerXMinusView, 0, lastPossibleCameraX)
  view.top = clamp(playerYMinusView, 0, lastPossibleCameraY)
  // Try to do the first one, if its too small do the second one, if its too big do the third one
  function clamp (desired, min, max) {
    if (desired < min) {
      return min
    } else if (desired > max) {
      return max
    } else return desired
  }
}

CanvasDisplay.prototype.clearDisplay = function (status) {
  if (status === 'won') {
    this.cx.fillStyle = 'rgb(68, 191, 255)'
  } else if (status === 'lost') {
    this.cx.fillStyle = 'rgb(44, 136, 214)'
  } else {
    this.cx.fillStyle = 'rgb(52, 166, 251)'
  }
  this.cx.fillRect(0, 0,
    this.canvas.width, this.canvas.height)
}

CanvasDisplay.prototype.drawBackground = function (level) {
  let {
    left,
    top,
    width,
    height
  } = this.viewport
  let xStart = Math.floor(left)
  let xEnd = Math.ceil(left + width)
  let yStart = Math.floor(top)
  let yEnd = Math.ceil(top + height)
  for (let y = yStart; y < yEnd; y++) {
    for (let x = xStart; x < xEnd; x++) {
      let tile = level.rows[y][x]
      if (tile === 'empty') continue
      let screenX = (x - left) * scale
      let screenY = (y - top) * scale
      switch (tile) {
        case 'wall':
          this.cx.fillStyle = '#000000'
          break
        case 'lava':
          this.cx.fillStyle = '#ff7b00'
          break
        default:
          break
      }
      this.cx.fillRect(Math.round(screenX), Math.round(screenY), scale, scale)
    }
  }
}
CanvasDisplay.prototype.drawActors = function (actors) {
  for (let actor of actors) {
    let width = actor.size.x * scale
    let height = actor.size.y * scale
    let x = (actor.pos.x - this.viewport.left) * scale
    let y = (actor.pos.y - this.viewport.top) * scale
    switch (actor.type) {
      case 'player':
        this.cx.fillStyle = '#ffffff'
        break
      case 'coin':
        this.cx.fillStyle = '#eeff00'
        break
      case 'lava':
        this.cx.fillStyle = '#ff7b00'
        break
      default:
        break
    }
    this.cx.fillRect(Math.round(x), Math.round(y), width, height)
  }
}
