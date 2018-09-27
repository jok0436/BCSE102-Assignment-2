/* jshint esversion:6 */
/* global Sound State Level requestAnimationFrame CanvasDisplay */

// Obviously we want other parts of our program to play sound, so its global
var mySound = new Sound()

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
  let ending = 1
  let arrowKeys = trackKeys(['ArrowLeft', 'ArrowRight', 'ArrowUp'])
  // we keep running this until the resolve function is called, so basically until we lose or win
  return new Promise(resolve => {
    runAnimation(time => {
      state = state.update(time, arrowKeys)
      state.timer.evalutate(time)
      if (state.timer.remainingTime === 0) {
        state.status = 'lost'
      }
      if (state.status === 'lost') {
        mySound.playWithID('Death')
      }
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

async function runGame (allPlans) { // eslint-disable-line no-unused-vars
  // for each level in our level plans
  for (let level = 0; level < allPlans.length;) {
    // run the level and await the results
    let status = await runLevel(new Level(allPlans[level]))
    // if we won then go to the next level
    if (status === 'won') level++
  }
  // We won the game!
  mySound.playWithID('Winner')
  console.log("You've won!")
}
