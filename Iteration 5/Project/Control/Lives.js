/* global mySound */
var Lives = class Lives { // eslint-disable-line no-unused-vars
  // ^^^ Just becuase we're hosting this in a different file so its actually used globally
  constructor (startingLives) {
    this.count = startingLives
  }
  reduce () {
    this.count--
  }
  reduceAndCheck () {
    if (this.count === 0) {
      mySound.playWithID('Defeat')
      return 'lost'
    } else {
      this.count--
      mySound.playWithID('Death')
      return 'playing'
    }
  }
}
