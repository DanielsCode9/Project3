const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const port = 3000;
const knex = require("knex")({
    client: 'sqlite3',
    connection: {
        filename: "musicinfo.db"
    },
    useNullAsDefault: true
});

//convert ejs files to html for the browser
app.set("view engine", "ejs");