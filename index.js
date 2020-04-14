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
    knex.select("CustID", "CustFirstName", "CustLastName", "CustEmail").from("Customer").orderBy("CustID").then(customer => {
        res.render("index", {
            custdata: customer
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            err
        });
    });
});

//needs to be updated for this project
app.post('/DeleteStudent/:id'(req, res) => {
    knex('custdata').where('CustID', req.params.id).del().then(custdata => {
        res.redirect('/');
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            err
        });
    })
});

//needs to be updated for this project
app.get('/addStudent', (req, res) => {
    res.render('addStudent');
});

//needs to be updated for this project
app.post('/addStudent', (req, res) => {
    console.log(req.body);
    console.log(req.body.firstName);
    knex(student).insert(req.body).then(student => {
        res.redirect('/');
    })
});

//needs to be updated for this project
app.get('/updateStudent', (req, res) => {
    res.render('updateStudent');
});

//needs to be updated for this project
app.post('/updateStudent', (req, res) => {
    console.log(req.body.FirstName);
    knex('student').where({
        StudentID: req.body.StudentID
    }).update({
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        Email: req.body.Email
    }).then(student => {
        res.redirect('/');
    });
});

//needs to be updated for this project
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
});

//needs to be updated for this project
app.post("/deleteCustomer/:id", (req, res) => {
    knex("Customer").where("CustID", req.params.id).del().then(customer =>{
        res.redirect("/");
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });
}); 



app.listen(port, function () {
    console.log("Music Store listening started");
});