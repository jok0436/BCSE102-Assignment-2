
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
      width: Math.min(level.rows[0].length, this.canvas.width / this.scale),
      height: Math.min(level.rows.length, this.canvas.height / this.scale)
    }
  }

  clear () {
    this.canvas.remove()
  }
}

CanvasDisplay.prototype.setState = function (state) {
  this.updateCanvas()
  this.updateViewport(state)
  this.clearDisplay(state.status)
  this.drawBackground(state.level)
  this.drawActors(state.actors)
  this.drawRemainingTime(state.timer.remainingTime)
  this.drawLives(state.player.lives.count)
}
CanvasDisplay.prototype.updateCanvas = function () {
  this.canvas.width = window.innerWidth
  this.canvas.height = window.innerHeight
}

CanvasDisplay.prototype.drawRemainingTime = function (remainingTime) {
  this.cx.font = '30px Consolas'
  this.cx.fillStyle = 'white'
  this.cx.fillText(remainingTime, 2, 20)
}

CanvasDisplay.prototype.drawLives = function (remainingLives) {
  this.cx.font = '30px Consolas'
  this.cx.fillStyle = 'white'
  this.cx.fillText('lives : ' + remainingLives, 100, 20)
}

CanvasDisplay.prototype.updateViewport = function (state) {
  let view = this.viewport
  let player = state.player
  let center = player.pos.plus(player.size.times(0.5))
  let scaledDownCanvasWidth = this.canvas.width / this.scale
  let scaledDownCanvasHeight = this.canvas.height / this.scale
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
    this.cx.fillStyle = 'rgb(128, 0, 0)'
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
      let screenX = (x - left) * this.scale
      let screenY = (y - top) * this.scale
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
      this.cx.fillRect(Math.round(screenX), Math.round(screenY), this.scale, this.scale)
    }
  }
}
CanvasDisplay.prototype.drawActors = function (actors) {
  for (let actor of actors) {
    let width = actor.size.x * this.scale
    let height = actor.size.y * this.scale
    let x = (actor.pos.x - this.viewport.left) * this.scale
    let y = (actor.pos.y - this.viewport.top) * this.scale
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
CanvasDisplay.prototype.scale = 20
