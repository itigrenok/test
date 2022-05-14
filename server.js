const express = require('express')
const axios = require('axios');
const app = express()
const urlencodedParser = express.urlencoded({extended: false});
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.listen(15000)

app.post("/v1/authorization", urlencodedParser, function (req, res) {
    axios.post("http://localhost:8990/v1/authorization", {login: req.body.login, password: req.body.password}, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        res.cookie("access_token", response.data.access_token).redirect("/v1/cars")
    }).catch(function () {
        res.status(401).sendFile(__dirname + '/views/401.html')
    });
});

app.get('/v1/authorization', function (req, res) {
    res.sendFile(__dirname + '/views/authorization.html')
});

app.get('/', function(req, res){
    res.sendFile(__dirname + '/views/authorization.html')
});

app.get("/v1/cars", (req, res) => {
    axios.get("http://localhost:8990/v1/cars", {
        headers: {
            "Authorization": req.cookies.access_token,
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        res.send(response.data)
    }).catch(function () {
        res.redirect("/")
    });
});

app.get('*', function(req, res){
    res.status(404).sendFile(__dirname + '/views/404.html')
});