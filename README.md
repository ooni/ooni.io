# OONI website

Assuming you have node and yarn installed, run:

```
yarn install
```

Note: If you encounter issues with the install process getting stuck while
installing `sharp`, try installing node-gyp globally with `npm install
node-gyp` and re-running the above command.

To start the dev server run:

```
yarn run develop
```

## TODO

### Technical

* [ ] See how we can map legacy URLs to new URLs in the website. For example: `/post/old-blog-post-name` to `/post/new-blog-post-name`
* [ ] Fix markdown rendering to use our custom Marked renderer that uses `ooni-components`. Use as example: https://github.com/OpenObservatory/design/blob/master/guide/src/Markdown.js
* [ ] Write scripts that migrate content from ooni-web to contentful
* [ ] Come up with a reasonable data model for the various content on our current website

### UI/UX

* [ ] Come up with a reasonable site map for the new website
* [ ] Do mockups of how the new website should look like
* [ ] Implement the missing components in `ooni-components`
* [ ] Implement based on `ooni-components` the new website
* [ ] Add footer with license information
