/* This class handles the sounds for the game, */
class Sound { // eslint-disable-line no-unused-vars
  // ^^^ Just becuase we're hosting this in a different file so its actually used globally
  constructor () {
    // Most sound files are only played once per level, so hold those ID's in this array
    // We check against this array when we play certain sounds so they only get played once
    this.allSoundsIHavePlayed = []
  }
  /* Takes in a Sound ID and a Reset boolean, if the reset boolean is set to true then the
  sound is a repeated sound e.g. a jump sound, collecting coins etc
  the reset boolean is set to false by default */
  playWithID (soundID, reset = false) {
    let soundFile = document.getElementById(soundID)
    // Check that we actually found something
    if (soundFile) {
      // The Winner and Defeat sounds require the background sound to be paused, so do that
      if (soundID === 'Winner' || soundID === 'Defeat') {
        this.pauseWithID('Background')
      }
      // If we want to repeat this sound, then set the current time value to 0 and play the sound
      // we're done at this point so lets return
      if (reset) {
        soundFile.currentTime = 0
        soundFile.play()
      } else if (!reset && this.allSoundsIHavePlayed.includes(soundID)) {
        // We have played this sound already and reset is set to false, so do nothing
      } else {
        // We have not played this sound before so lets play it now and add it to our played
        // sounds array
        soundFile.play()
        this.allSoundsIHavePlayed.push(soundID)
      }
    } else {
      // There was no sound file with this ID, so do nothing
    }
  }
  // Takes in a SoundID and tries to find that element in the webpage, if it does find that
  // element it pauses it.
  pauseWithID (soundID) {
    let soundFile = document.getElementById(soundID)
    if (soundFile) {
      soundFile.pause()
    } else {
    // There was no sound file with this ID, so do nothing
    }
  }
  // Either Unpauses or Plays a sound file and doesn't worry about wether it's been played before
  alwaysPlaySoundWithID (soundID) {
    let soundFile = document.getElementById(soundID)
    if (soundFile) {
      soundFile.play()
    } else {
    // There was no sound file with this ID, so do nothing
    }
  }
  // Clear out the sound cache (probably becuase we started a new level)
  clearSoundCache () {
    this.allSoundsIHavePlayed = []
  }
}
