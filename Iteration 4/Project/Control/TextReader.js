/* global FileReader */
class TextReader { // eslint-disable-line no-unused-vars
  // ^^^ Just becuase we're hosting this in a different file so its actually used globally
  readFile (event) {
    // Retrieve the first (and only!) File from the FileList object
    let file = event.target.files[0]
    if (file) {
      let reader = new FileReader()
      reader.onload = function (e) {
        let contents = e.target.result
        console.log(contents)
        return contents
      }
      console.log(reader.readAsText(file))
    } else {
      return null
    }
  }

  splitFile (rawFile = String()) {
    let output = []
    output = rawFile.split('BREAK')
    console.log(output)
  }
}
