// declare and insert all programs, libraries, and variables

const express = require("express");
const app = express();
const path = require("path");
const publicDir = require("path").join(__dirname, "/public");
const bodyParser = require("body-parser");
const port = 3000;
const knex = require("knex")({
    client: 'sqlite3',
    connection: {
        filename: "MusicLibrary.db"
    },
    useNullAsDefault: true
});

//public folder
app.use(express.static(publicDir));

//parse req
app.use(bodyParser.urlencoded({
    extended: true
}));

//convert ejs files to html for the browser
app.set("view engine", "ejs");

//takes everything from the table and gives it to the ejs file
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

// deletes the song
app.post("/deleteSong/:id", (req, res) => {
    knex("Songs").where("SongID", req.params.id).del().then(MusicLibrary => {
        console.log(req.params.id);
        res.redirect("/");
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            err
        });
    });
});

//edit song methods
app.get('/editsong', function (req, res) {
    res.render('editsong')
});

app.post('/editsong', (req, res) => {
    knex('Songs').where({
        SongID: req.body.SongID
    }).update({
        SongID: req.body.SongID,
        SongName: req.body.SongName,
        ArtistID: req.body.ArtistID,
        YearReleased: req.body.YearReleased
    }).then(Songs => {
        res.redirect('/');
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            err
        });
    });;
});

//add song methods
app.get('/addsong', (req, res) => {
    res.render('addsong');
});

app.post("/addsong", (req, res) => {
    console.log(req.body);
    console.log(req.body.SongName);
    knex("Songs").insert(req.body).then(MusicLibrary => {
        // the variable was written as songs, but songs does not exist on the index.ejs file
        res.redirect("/");
    });
});


//port
app.listen(port, function () {
    console.log("Music Library listening");
});

//startover method
app.get("/startover", (req, res) => {
    res.redirect("/startover")
});


app.post("/StartOver/", (req, res) => {
    knex("Songs").del().then(MusicLibrary => {
        knex("sqlite_sequence").where("name", "=", "Songs").update("seq", "0").then(songs => {
            knex("Songs").insert([{
// puts the original songs back in place with the inital ID's attached
                    SongName: "Bohemian",
                    ArtistID: "QUEEN",
                    YearReleased: "1975"
                },
                {
                    SongName: "Don't Stop Believing",
                    ArtistID: "JOURNEY",
                    YearReleased: "1981"
                },
                {
                    SongName: "Hey Jude",
                    ArtistID: "BEATLES",
                    YearReleased: "1968"
                }
            ]).then(MusicLibrary => {
                res.redirect("/")
            })
        })
    })
});