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
        let arr = String(file.contents).match(
          /import (\w+) from ['"].?\/(\w+).scss['"]/g
        )

        if (arr) {
          arr.map(item => {
            let itemArray = item.split(' ')

            try {
              const sassPath = path.resolve(
                path.parse(file.path).dir,
                itemArray[3].replace(/^('|")|('|")$/g, '')
              )
              // console.log(sassPath)
              file.contents = Buffer.from(
                String(file.contents).replace(
                  item,
                  `import {css} from 'lit'
const ${itemArray[1]} = css\`${Sass.renderSync({
                    file: sassPath,
                  }).css.toString()}\``
                )
              )
            } catch (error) {}
          })
        }
        return callback(null, file)
      }
    },
  })
}

module.exports = sassToString
