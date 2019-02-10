/* global Vec */
class TouchRing { // eslint-disable-line no-unused-vars
  // ^^^ Just becuase we're hosting this in a different file so its actually used globally
  constructor (outerRingPosition = Vec, innerRingPosition = Vec, name) {
    this.pos = new Vec(-1000, -1000)
    this.outerRingPosition = outerRingPosition
    this.innerRingPosition = innerRingPosition
    this.name = name
    this.isHidden = true
  }
  get type () {
    return 'TouchRing'
  }
}
TouchRing.prototype.update = function (time, state, keys) {
  return this
}
TouchRing.prototype.setOriginalPositions = function (newX, newY) {
  this.show()
  this.innerRingPosition.x = newX
  this.innerRingPosition.y = newY
  this.outerRingPosition.x = newX
  this.outerRingPosition.y = newY
}
TouchRing.prototype.newInnerRingPositions = function (newInnerX, newInnerY) {
  this.innerRingPosition.x = newInnerX
  this.innerRingPosition.y = newInnerY
}
TouchRing.prototype.newOuterRingPositions = function (newOuterX, newOuterY) {
  this.outerRingPosition.x = newOuterX
  this.outerRingPosition.y = newOuterY
}
TouchRing.prototype.reset = function (newOuterX, newOuterY) {
  this.hide()
  this.innerRingPosition.x = -1000
  this.innerRingPosition.y = -1000
  this.outerRingPosition.x = -1000
  this.outerRingPosition.y = -1000
}
TouchRing.prototype.hide = function () {
  this.isHidden = true
}

TouchRing.prototype.show = function () {
  this.isHidden = false
}
TouchRing.prototype.size = new Vec(0, 0)
