/* global FileReader */
class TextReader { // eslint-disable-line no-unused-vars
  // ^^^ Just becuase we're hosting this in a different file so its actually used globally
  readFile (event) {
    // Retrieve the first (and only!) File from the FileList object
    let file = event.target.files[0]
    var promise = Promise.resolve()
    pFileReader(file)
    promise.then(function (result) {
      console.log(result)
    })

    function pFileReader (file) {
      return new Promise((resolve, reject) => {
        var reader = new FileReader()
        reader.onload = function found () {
          resolve(reader.result) // CHANGE to whatever function you want which would eventually call resolve
        }
        reader.readAsText(file)
      })
    }
  }

  splitFile (rawFile = String()) {
    let output = []
    output = rawFile.split('BREAK')
    console.log(output)
  }
}
