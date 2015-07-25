// Main file
// initiate:
var express = require("express");
var app = express();
var session = require('express-session');
require('ejs')
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(session({secret: 'cool'}));
app.use(express.static(__dirname + '/public'));

console.log("Node Server is Running!")

//views
var main = function (req,res){
    res.render('main.ejs',{});
}

//urls
app.get("/", main)

var server = app.listen(2001, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log('App listening at http://%s:%s', host, port)
});