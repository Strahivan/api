# Novelship

### API Design:
The filtering API is using [objection-find](http://github.com/vincit/objection-find) which exposes a powerful queryable API to the consumers. The API consumer can dynamcally filter on the properties of any resource they have access to without a single modification done to the server.

All query parameters are grouped in five classes: filters, projections, pagination, inclusions and ordering. There's an excellent discussion in [one of the issues in Ghost](https://github.com/TryGhost/Ghost/issues/5463) where they discuss implementing this pattern to let the consumers access the API easily.

### Getting started:

 - Install [nvm](https://github.com/creationix/nvm) and then `nvm install node` (*minimum version: 8.x*).
 - Add `node_modules` to your path variable. For example, for `zsh`, add this to your `.zshrc`: `export PATH="$PATH:./node_modules/.bin"`
 - Install project dependencies: `npm install`
 - Install [PostgreSQL](https://www.postgresql.org/download/) and create a database.
 - Install [redis](http://redis.io)
 - Create an environment variable configuration file named `.env` in the project root and define the environment variables. Here's a [sample](https://gist.github.com/afm-sayem/b000849ffa2f38169c73d2c9bb165bc0).
 - Create tables: `knex migrate:latest`
 - Run the server: `npm run dev`
 - Test the API: http://localhost:3000/products

