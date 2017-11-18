# Novelship

### API Design:
The filtering API is using [objection-find](http://github.com/vincit/objection-find) which exposes a powerful queryable API to the consumers. The API consumer can dynamcally filter on the properties of any resource they have access to without a single modification done to the server.

All query parameters are grouped in five classes: filters, projections, pagination, inclusions and ordering. There's an excellent discussion in [one of the issues in Ghost](https://github.com/TryGhost/Ghost/issues/5463) where they discuss implementing this pattern to let the consumers access the API easily.

### Getting started:

 - Install [nvm](https://github.com/creationix/nvm) and then install node.js via running `nvm install node` in the terminal (*minimum version: 8.x*).
 - Add `node_modules` to your path variable. For example, for `zsh`, add this to your `.zshrc`: `export PATH="$PATH:./node_modules/.bin"`
 - Clone the project `git clone https://github.com/athenadesk/api.git`
 - Jump into the (local) project repository and run `npm install` to install the project dependencies
 - Install [PostgreSQL](https://www.postgresql.org/download/) and create a database. For MacOS you might install the [PostgreSQLApp](https://postgresapp.com/)
 - Install [redis](http://redis.io)
 - Install [knex](http://knexjs.org)
 - After you've installed knex.js you should see a knex executable file within the following folder `<your-project-folder>/node_modules/.bin/knex`
 - Create an environment variable configuration file named `.env` in the project root and define the environment variables. Here's a [sample](https://gist.github.com/afm-sayem/b000849ffa2f38169c73d2c9bb165bc0).
 - After you've done that, change the following two variables to the appropriate local path of yours: `DATABASE_URL` and `REDIS_URL`
 - Optional: You might modify the <timestamp> triplocation.js 
 - Run the following bash command within the local project directory to clone the actual database-structure: `knex migrate:latest`
 - Run the server: `npm run dev`
 - Test the API: http://localhost:3000/products
 - You may also install [Postgis](http://postgis.net/install/) - But note: You don't have to run the script for enabling Postgis because it's already part of the migration script of knex.js
