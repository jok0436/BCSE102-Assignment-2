/* global Vec */
class TouchRing { // eslint-disable-line no-unused-vars
  // ^^^ Just becuase we're hosting this in a different file so its actually used globally
  constructor (outerRingPosition = Vec, innerRingPosition = Vec, name) {
    this.pos = outerRingPosition
    this.innerRingPosition = innerRingPosition
    this.name = name
    this.isHidden = true
  }
  get type () {
    return 'TouchRing'
  }
}
TouchRing.prototype.update = function () {
  return this
}
TouchRing.prototype.newPositions = function (newOuterRingPosition, newInnerRingPosition) {
  this.pos = newOuterRingPosition
  this.innerRingPosition = newInnerRingPosition
}
TouchRing.prototype.hide = function () {
  this.isHidden = true
}

TouchRing.prototype.show = function () {
  this.isHidden = false
}
TouchRing.prototype.size = new Vec(0, 0)
