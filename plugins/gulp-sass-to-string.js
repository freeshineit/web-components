const Transform = require('stream').Transform
const Sass = require('sass')

const path = require('path')

function sassToString() {
  return new Transform({
    objectMode: true,
    /**
     * transformation
     * @param {import("vinyl")} file
     * @param {BufferEncoding} enc
     * @param {(error?: Error | null, data?: any) => void} callback
     */
    transform(file, enc, callback) {
      //   console.log(file)
      if (file.isNull()) {
        return callback(null, file)
      }

      if (file.isBuffer()) {
        let flag = false
        String(file.contents).replace(
          /import (\w+) from ['"].?\/(\w+).scss['"]/g,
          (subStr, index) => {
            let itemArray = subStr.split(' ')

            try {
              const sassPath = path.resolve(
                path.dirname(file.path),
                itemArray[3].replace(/^('|")|('|")$/g, '')
              )

              file.contents = Buffer.from(
                String(file.contents).replace(
                  subStr,
                  `${!flag ? `import {css} from 'lit';\n` : ''}const ${
                    itemArray[1]
                  } = css\`${Sass.compile(sassPath)
                    .css.toString()
                    .replace(/\n|\t/g, '')}\``
                )
              )
              flag = true
            } catch (error) {
              console.log('sass to string error: ', error)
            }
          }
        )

        return callback(null, file)
      }
    },
  })
}

module.exports = sassToString
