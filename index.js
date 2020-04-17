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

//needs to be updated for this project
app.post("/deleteSong/:id", (req, res) => {
    knex("Songs").where("SongID", req.params.id).del().then(MusicLibrary => {
        // changed the variable from songs to MusicLibrary
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
        // again changed the variable name to MusicLibrary instead of songs
        res.redirect('/');
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            err
        });
    });;
});

// app.get("/editsong/:id", (req, res) => {
//     knex.select("SongID", "SongName", "ArtistID", "YearReleased")
//         .from("Songs").where("SongID", req.params.id)
//         .then(songs => {
//             res.render("editsong", {
//                 MusicLibrary: songs
//             });
//         }).catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 err
//             });
//         });
// });

// app.post("/editsong", (req, res) => {
//     knex("Songs").where("SongID", req.body.SongID).update({
//         SongName: req.body.SongName,
//         ArtistID: req.body.ArtistID,
//         YearReleased: req.body.YearReleased
//     }).then(songs => {
//         res.redirect("/");
//     });
// });

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

// ------- Here's everything about starting over haha ------- //

// app.post('/startover', (req, res) => {
//     knex('Songs').del(req.body),
//     // .where('SongID', true).del(),
//     // .del(),
//     // .where(req.body).del(),
//     knex('Songs').insert(
//         [
//             {SongName: "Bohemian", ArtistID: "QUEEN", YearReleased: "1975"},
//             {SongName: "Don't Stop Believing", ArtistID: "JOURNEY", YearReleased: "1981"},
//             {SongName: "Hey Jude", ArtistID: "BEATLES", YearReleased: "1968"}, 
//         ]
//     ).then(MusicLibrary => {
//         res.redirect('/');
//     });
// });

app.get("/startover", (req, res) => {
    res.redirect("/startover")
});


app.post("/StartOver/", (req, res) => {
    knex("Songs").del().then(MusicLibrary => {
        knex("sqlite_sequence").where("name", "=", "Songs").update("seq", "0").then(songs => {
            knex("Songs").insert([{

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

/*
//startover method - I just tried to see if it works. I have not deleted anything, I have just commented out and added my changes.
app.post('/startover', (req,res)=>{
    knex('Songs')
        // [ SongID,req.body.SongID,
        //   SongName,req.body.SongName, 
        //   ArtistID,req.body.ArtistID,
        //   YearReleased,req.body.YearReleased]
        .del().then (MusicLibrary =>{
            res.redirect('/');
        });
    
    });
   
    // prof.Anderson used get method to update the table instead of post. So i have changed the code here
    app.get('/startover', (req, res) => {
      console.log("please work");//kept it for testing
        knex('Songs').insert(
            [
                {SongName: "Bohemian", ArtistID: "QUEEN", YearReleased: "1975"},
                {SongName: "Don't Stop Believing", ArtistID: "JOURNEY", YearReleased: "1981"},
                {SongName: "Hey Jude", ArtistID: "BEATLES", YearReleased: "1968"},
            ]
        ).then(Songs => {
            res.redirect('/');
        });
    });
        
    
    //startover methods- In Prof.Anderson videos he has used get method.So,I have updated the code just below the delete method
    
    
   
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
                    table.integer('YearReleased');
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
    }); */