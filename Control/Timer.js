class Timer {// eslint-disable-line no-unused-vars
  // ^^^ Just becuase we're hosting this in a different file so its actually used globally
  constructor (elapsedTime, remainingTime, completeTime) {
    this.elapsedTime = elapsedTime
    this.remainingTime = remainingTime
    this.completeTime = completeTime
  }
  evalutate (newTime) {
    this.elapsedTime += newTime
    this.remainingTime = Math.floor(this.completeTime - this.elapsedTime)
  }
  reset () {
    this.elapsedTime = 0
  }
}
