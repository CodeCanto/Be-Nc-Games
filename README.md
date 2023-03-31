# NC GAMES

Provides access to database of reviews, categories, comments and users allowing easy request for specific data.

Host URL: https://nc-games-m65q.onrender.com/api/

Use git clone on the provided github URL to download the code:
https://github.com/Entelodonto/be-nc-games

Run `npm install` in terminal to download dependencies,
Run `npm run setup-dbs` to set up databases.
Run `npm run seed-prod` to seed databases.
RUn `npm test app.test` to run jest test suite on test js file.

Environment Variable File Set Up:

Create a .gitignore file which contains the following:

node_modules
.env.\*

Then create two environment files in the local folder of the
project with the following file names and extensions:

.env.development

.env.test

Within each put the corresponding information.

PBDATABASE=nc_games; //place inside .env.development

PBDATABASE=nc_games_test; //place inside .env.testt

Make sure to have the minimum versions of the following installed:

Node.js: 19.6.0

Postgres: 15.2
