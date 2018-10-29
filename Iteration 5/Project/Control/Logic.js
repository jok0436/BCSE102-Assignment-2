/* jshint esversion:6 */
/* global Sound State Level requestAnimationFrame CanvasDisplay */

// Obviously we want other parts of our program to play sound, so its global
var mySound = new Sound()

function trackKeys (keyboardKeys) {
  let down = Object.create(null)

  function track (event) {
    if (keyboardKeys.includes(event.key)) {
      down[event.key] = event.type === 'keydown'
      event.preventDefault()
    }
  }
  window.addEventListener('keydown', track)
  window.addEventListener('keyup', track)
  return down
}

function trackTouches (state) {
  function onTouchStart (event) {
    if (event.touches[0]) {
      state.touchRingBlack.setOriginalPositions(event.touches[0].pageX, event.touches[0].pageY)
    }
    if (event.touches[1]) {
      state.touchRingWhite.setOriginalPositions(event.touches[1].pageX, event.touches[1].pageY)
    }
  }
  function onTouchMove (event) {
    if (event.touches[0]) {
      state.touchRingBlack.newInnerRingPositions(event.touches[0].pageX, event.touches[0].pageY)
    }
    if (event.touches[1]) {
      state.touchRingWhite.newInnerRingPositions(event.touches[1].pageX, event.touches[1].pageY)
    }
  }

  function onTouchEnd (event) {
    if (!event.touches[0]) {
      state.touchRingBlack.reset()
    }
    if (!event.touches[1]) {
      state.touchRingWhite.reset()
    }
  }
  window.addEventListener('touchstart', onTouchStart, false)
  window.addEventListener('touchmove', onTouchMove, false)
  window.addEventListener('touchend', onTouchEnd, false)
}

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
// runs when a level is playing, takes in a level plan (an array of characters)
function runLevel (level) {
  // all this stuff runs at the start of the level
  mySound.clearSoundCache()
  let display = new CanvasDisplay(document.body, level)
  let state = State.start(level)
  let ending = 8
  let arrowKeys = trackKeys(['ArrowLeft', 'ArrowRight', 'ArrowUp'])
  trackTouches(state)
  // we keep running this until the resolve function is called, so basically until we lose or win
  return new Promise(resolve => {
    runAnimation(time => {
      state = state.update(time, arrowKeys)
      state.timer.evalutate(time)
      if (state.timer.remainingTime === 0) state.status = 'lost'
      if (state.status === 'lost') {
        state.status = state.player.lives.reduceAndCheck()
        if (state.status === 'playing') state.player.reset(state)
        mySound.clearSoundCache()
        state.timer.reset()
      }
      display.setState(state)
      if (state.status === 'playing') {
        return true
      } else if (ending > 0 && state.status !== 'won') {
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

async function runGame (allPlans) { // eslint-disable-line no-unused-vars
  // for each level in our level plans
  for (let level = 0; level < allPlans.length;) {
    // run the level and await the results
    let status = await runLevel(new Level(allPlans[level]))
    // if we won then go to the next level
    if (status === 'won') level++
    if (status === 'lost') window.location.reload(false)
  }
  // We won the game!
  mySound.playWithID('Winner')
  console.log("You've won!")
}
