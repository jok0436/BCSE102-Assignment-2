/*
A Vector is just an object containing an X and Y variable
we usually use this for positioning, but we can also use this for the size of a 2d object
you can add and times two Vec's together using the relevant functions
*/
var Vec = class Vec { // eslint-disable-line no-unused-vars
  // ^^^ Just becuase we're hosting this in a different file so its actually used globally
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
