const path = require('path')
const fs = require('fs')

const Promise = require('any-promise')

const marked = require('marked')
const osenv = require('osenv')
const glob = require('glob')
const fm = require('front-matter')
const contentful = require('contentful-management')

const argv = require('minimist')(process.argv.slice(2))
const configPath = argv.config || path.join(osenv.home(), '.contentful.json')

if (!fs.existsSync(configPath)) {
  console.error(`ERROR: Could not find ${configPath}`)
  console.log(`You should create populate it with:

{
 "managementAccessToken": "YOUR_TOKEN"
}

The token can be created in https://app.contentful.com/spaces/brg7eld9zwg1/api/cma_tokens
`)
  process.exit(1)
}

if (argv._.length === 0) {
  console.error(`ERROR: You need to specify the path to ooni-web`)
  console.log('example: node migrate.js /path/to/ooni-web')
  process.exit(1)
}

const config = require(configPath)
const ooniWebDir = argv._[0]

const getImages = (mdBody) => {
  const tokens = marked.lexer(mdBody)
  let images = tokens
                .filter(t => t.type == 'paragraph' && t.text.startsWith('!['))
                .map(t => {
                  const parts = marked.InlineLexer.rules.link.exec(t.text)
                  const pathLower = parts[2].toLowerCase()
                  let contentType = 'application/octet-stream'
                  if (pathLower.endsWith('.png')) {
                    contentType = 'image/png'
                  } else if (pathLower.endsWith('.jpg')) {
                    contentType = 'image/jpeg'
                  } else if (pathLower.endsWith('.jpeg')) {
                    contentType = 'image/jpeg'
                  } else if (pathLower.endsWith('.gif')) {
                    contentType = 'image/gif'
                  }

                  return {
                    title: parts[1],
                    path: path.join(ooniWebDir, 'static', parts[2]),
                    originalPath: parts[2],
                    fileName: path.basename(parts[2]),
                    contentType
                  }
                })
  return images
}

const main = () => {
  var contentfulClient = contentful.createClient({
    accessToken: config.managementAccessToken
  })

  glob(path.join(ooniWebDir, 'content', 'post', '*.md'), (err, files) => {
    if (err !== null) {
      console.error('ERROR: in finding ooni-web dir')
      console.log(err)
      process.exit(1)
    }
    //files.forEach(file => {
      let file = files[0]
      fs.readFile(file, 'utf8', (err, data) => {
        if (err !== null) {
          console.error(`ERROR: in reading ${file}`)
          return
        }
        contentfulClient.getSpace('brg7eld9zwg1')
        .then((space) => {
          const content = fm(data)
          const images = getImages(content.body)
          const { title, categories, tags, author, date } = content.attributes

          console.log(content.attributes.title)
          console.log('======')
          console.log(content.attributes)
          console.log(JSON.stringify(images, null, 2))
          console.log('')

          /*
          if (categories.indexOf('report') !== -1) {
            // We want to put reports in another category
            console.log('...skipping report')
            return
          }
          */

          let imageMap = {}
          console.log('Promise.all()')
          Promise.all(
            images.map(image => {
              return new Promise((resolve, reject) => {
                console.log(`uploading ${image.path}`)
                space.createAssetFromFiles({
                  fields: {
                    title: {
                      'en-US': image.title
                    },
                    file: {
                      'en-US': {
                        contentType: image.contentType,
                        fileName: image.fileName,
                        file: fs.createReadStream(image.path)
                      }
                    }
                  }
                })
                .then(asset => asset.processForAllLocales({
                  processingCheckWait: 1000,
                  processingCheckRetries: 100
                }))
                .then(asset => {
                  console.log('processed')
                  console.log(asset)
                  resolve({
                    id: asset.sys.id,
                    url: asset.fields.file['en-US'].url,
                    image
                  })
                })
                .catch(err => reject(err))
              })
            })
          )
          .then(images => {
            if (err !== null) {
              console.error(`ERROR: failed to process some file inside of ${title}`)
              console.error(err)
              return
            }
            const originalPaths = images.map(img => [img.image.originalPath, img.url])
            let idx,
                body = content.body
            for (idx in originalPaths) {
              console.log('idx', idx)
              console.log('originalPaths', originalPaths)
              let paths = originalPaths[idx]
              console.log('path', paths)
              body = body.replace(paths[0], paths[1])
            }
            space.createEntry('blogPost', {
              fields: {
                title: {
                  'en-US': title
                },
                authors: {
                  'en-US': author.split(',').map(a => a.trim()),
                },
                tags: {
                  'en-US': tags
                },
                publicationDate: {
                  'en-US': date
                },
                content: {
                  'en-US': body
                },
                images: {
                  'en-US': images.map(img => ({sys: {type: 'Link', linkType: 'Asset', id: img.id}}))
                }
              }
            })
            .then(entry => {
              console.log(`created entry for ${title}`)
            })
          }).catch(err => console.log(err)) // end creation of entry
        }) // end getting of space
      }) // end reading of file
    //}) // end files forEach
  }) // end of glob
}

main()

/*
  // Now that we have a space, we can get entries from that space
  space.getEntries()
  .then((entries) => {
    console.log(JSON.stringify(entries.items, null, 2))
  })
})
*/
