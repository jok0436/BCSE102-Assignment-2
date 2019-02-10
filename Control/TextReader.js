/* global FileReader */
/* Alright so i had to learn about JS Promises for this so im just dumping what i know into
this comment, basically when i call findGameLevels im passing the event from a file type
input element, so im only looking for 1 file so i bind the first file in the targets' .files
array then i bind result to the result of getFile(file) but i have to wait for it to finish
since it performs this function asynchrounously, so once getFile returns resultSplit with resolve
i then set the global variable allMyLevels to result */
class TextReader { // eslint-disable-line no-unused-vars
  // ^^^ Just becuase we're hosting this in a different file so its actually used globally
  getFile (file) {
    return new Promise(function (resolve) {
      let reader = new FileReader()
      reader.onload = function found () {
        let result = reader.result
        let resultSplit = []
        resultSplit = result.split('BREAK')
        resolve(resultSplit)
      }
      reader.readAsText(file)
    })
  }

  async findGameLevels (event) {
    let file = event.target.files[0]
    let result = await this.getFile(file)
    window.allMyLevels = result
  }
}
