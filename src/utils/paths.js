const moment = require('moment')
const changeCase = require('change-case')

const getBlogPostPath = ({publicationDate, title}) => {
  let path = ''
  console.log('I GOT', publicationDate, title)
  const dateSlug = moment(publicationDate).format('YYYY-MM-DD')
  const titleSlug = changeCase.paramCase(title)
  path = `/post/${dateSlug}-${titleSlug}`
  console.log('returning ', path)
  return path
}

exports = {
  getBlogPostPath
}
module.exports = exports
