# React, Node.js and MySQL
A basic template for creating a React app to run basic MySQL queries.

For this project the front-end (contained in the client folder) was hosted on Netlify and the back-end (contained in the server folder) was hosted on Heroku with the MySQL server being a free instance of ClearDB on Heroku.
# Netlify
## Build settings
Base directory: client
Build command: npm run build
Publish directory: client/build
# Heroku
## ClearDB
Go to Resources and add the free tier of ClearDB MySQL.

Go to Settings > Config Vars and reveal to see the URL to your ClearDB server. It'll have a format of

    mysql://[user]:[pass]@[host]/[database]

E.g., if the Config Var is 

    mysql://b57e165b4c319d:password@us-cdbr-east-04.cleardb.com/heroku_200e0e8c7fc90b0?reconnect=true

Then your connection pool information in index.js should be

    const db = mysql.createPool({
        connectionLimit: 10,
        user: 'b57e165b4c319d',
        host: 'us-cdbr-east-04.cleardb.com',
        password: password,
        database: 'heroku_200e0e8c7fc90b0'
    });

Instead of putting the password directly in the code though create a new Config Var on Heroku named DB_PASSWORD with the value containing the actual password, then change the connection pool information in index.js to

    const db = mysql.createPool({
        connectionLimit: 10,
        user: 'b57e165b4c319d',
        host: 'us-cdbr-east-04.cleardb.com',
        password: process.env.DB_PASSWORD,
        database: 'heroku_200e0e8c7fc90b0'
    });

You'll need to update the link to your database in the GetQuery.jsx file's Axios.get() function as well.
## Node.js
Go to Settings > Buildpacks and add "https://github.com/timanovsky/subdir-heroku-buildpack.git" as a buildpack. Drag to be first/before heroku/nodejs

Go to Settings > Config Vars and add a config var with the name "PROJECT_PATH" and value "server"