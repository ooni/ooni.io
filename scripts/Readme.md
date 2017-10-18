# ooni-website-scripts

This package contains scripts useful for managing the OONI website.

In general for scripts dealing with contentful you should create a file called
`~/.contentful.json` that contains your API key for the desired space like
this:

```
{
 "managementAccessToken": "CFPAT-YOUR-ACCESS-TOKEN"
}
```

# migrate.js

This is used to automatically migrate blog posts and reports.

It is invoke like this:

```
node migrate.js /path/to/ooni-web
```

It will then create all the blog posts and upload the images.

WARNING: it doesn't take care of de-duplication so be sure to only run it
against a clean contentful slate.
