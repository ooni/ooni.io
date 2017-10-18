const moment = require('moment')
const changeCase = require('change-case')

const getBlogPostPath = ({publicationDate, title}) => {
  const dateSlug = moment(publicationDate).format('YYYY-MM-DD')
  const titleSlug = changeCase.paramCase(title)
  return `/post/${dateSlug}-${titleSlug}`
}

exports = {
  getBlogPostPath
}
module.exports = exports
