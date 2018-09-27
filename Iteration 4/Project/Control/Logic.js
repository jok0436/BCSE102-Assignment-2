/* jshint esversion:6 */
/* global Sound State Timer Level requestAnimationFrame */

// Obviously we want other parts of our program to play sound, so its global too
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
  mySound.clearSoundCache()
  let display = new Display(document.body, level)
  let state = State.start(level)
  let timer = new Timer(0, 0, state.level.completeTime)
  let ending = 1
  return new Promise(resolve => {
    runAnimation(time => {
      state = state.update(time, arrowKeys)
      timer.evalutate(time)
      if (timer.remainingTime === 0) {
        state.status = 'lost'
      }
      if (state.status === 'lost') {
        mySound.playWithID('Death')
      }
      display.setState(state)
      display.drawRemainingTime(timer.remainingTime)
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
  mySound.playWithID('Winner')
  console.log("You've won!")
}
