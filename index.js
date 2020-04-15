const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const port = 3000;
const knex = require("knex")({
    client: 'sqlite3',
    connection: {
        filename: "MusicLibrary.db"
    },
    useNullAsDefault: true
});

//parse req
app.use(bodyParser.urlencoded({
    extended: true
}));

//convert ejs files to html for the browser
app.set("view engine", "ejs");

//takes everything from the table and gives it to the ejs file
//needs to be updated for this project
app.get("/", (req, res) => {
    knex.select("SongID", "SongName", "ArtistID", "YearReleased").from("Songs").orderBy("SongID").then(songs => {
        res.render("index", {
            startOver: songs,
            MusicLibrary: songs
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            err
        });
    });
});

//needs to be updated for this project
app.post("/deleteSong/:id", (req, res) => {
    knex("Songs").where("SongID", req.params.id).del().then(songs => {
        console.log(req.params.id);
        res.redirect("/");
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            err
        });
    });
});


app.get('/addsong', (req, res) => {
    res.render('addsong');
});

app.post("/addsong", (req, res) => {
    console.log(req.body);
    console.log(req.body.SongName);
    knex("Songs").insert(req.body).then(songs => {
        res.redirect("/");
    });
});


//startover methods
app.get("/startover", (req, res) => {
    res.redirect("/startover")
});

app.post("/startover", (req, res) => {
    //first, desete all the records
    knex("Songs").del(),

        knex.schema.createTable('Songs', table => {
                table.increments('SongID'),
                table.string('SongName'),
                table.string('ArtistID'),
                table.integer('YearReleased')
        });
        console.log(Songs);


    knex('Songs').insert(
        [{
                SongID: "1",
                SongName: "Bohemian Rhapsody",
                ArtistID: "QUEEN",
                YearReleased: "1975"
            },
            {
                SongID: "2",
                SongName: "Don't Stop Believing",
                ArtistID: "JOURNEY",
                YearReleased: "1981"
            },
            {
                SongID: "3",
                SongName: "Hey Jude",
                ArtistID: "BEATLES",
                YearReleased: "1968"
            }
        ]
    ).then(songs => {
        res.redirect('/')
    })
});

//edit song methods
app.get('/editsong', function (req, res) {
    res.render('editsong')
});

app.post('/editsong', (req, res) => {
    console.log(req.body.ArtistID);
    knex('Songs').where({
        SongID: req.body.SongID
    }).update({
        SongID: req.body.SongID,
        SongName: req.body.SongName,
        ArtistID: req.body.ArtistID,
        YearReleased: req.body.YearReleased
    }).then(songs => {
        res.redirect('/');
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            err
        });
    });;
});

app.post('/editsong', (req, res) => {
    res.render('/')
});

/*
app.post('/addBatch', (req, res) => {
    knex('Student').insert(
        [
            {firstName: "Tony", LastName: "Stark", Email: "Y"},
            {firstName: "Steve", LastName: "Rogers", Email: "Y"},
           {firstName: "Natsha", LastName: "Romeoa", Email: "N"},
            {firstName: "Carol", LastName: "Danvers", Email: "N"},
        ]
    ).then(student => {
        res.redirect('/');
    });
});*/

app.listen(port, function () {
    console.log("Music Library listening started");
});