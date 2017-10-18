const path = require('path')
const fs = require('fs-extra')

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

const contentfulClient = contentful.createClient({
  accessToken: config.managementAccessToken
})

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

const processMarkdown = (data) => {
  return new Promise((resolve, reject) => {
    contentfulClient.getSpace('brg7eld9zwg1')
    .then((space) => {
      const content = fm(data)
      const images = getImages(content.body)
      const { title, categories, tags, author, date } = content.attributes

      console.log(`Processing: ${content.attributes.title}`)

      /*
      if (categories.indexOf('report') !== -1) {
        // We want to put reports in another category
        console.log('...skipping report')
        return
      }
      */

      let imageMap = {}
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
              console.log(`uploaded: ${image.fileName}`)
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
        const originalPaths = images.map(img => [img.image.originalPath, img.url])
        let idx,
            body = content.body
        for (idx in originalPaths) {
          let paths = originalPaths[idx]
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
          resolve(title)
        })
        .catch(err => {
        console.error(`ERROR: failed to process ${title}`)
          reject(err)
        })
      }).catch(err => {
        console.error(`ERROR: failed to process ${title}`)
        console.log(err)
        reject(err)
      }) // end creation of entry
    }) // end getting of space
  })
}

const readFile = (path) => {
  return fs.readFile(path, 'utf8')
    .then(data => {
      if (data.length > 50000) {
        console.log(`SKIPPING ${path}, Contentful disallows allow more than 50k text input`)
        return
      }
      processMarkdown(data)
        .then(title => console.log(`processed ${title}`))
        .catch(err => console.error(`ERROR: failed to process ${title}`))
    })
    .catch(err => {
      console.error(`ERROR: in reading ${path}`)
      console.log(err)
    })
}

const main = () => {
  const files = glob.sync(path.join(ooniWebDir, 'content', 'post', '*.md'))
  files
    .map(path => readFile(path))
    .reduce((p, fn) => (p.then(fn).catch((err) => {console.log(err); process.exit(1)}, Promise.resolve())))
}

main()
