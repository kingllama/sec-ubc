// Main file
// initiate:
var express = require("express");
var app = express();
var session = require('express-session');
require('ejs');
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(session({secret: 'cool'}));
app.use(express.static(__dirname + '/public'));

console.log("Node Server is Running!");

//CUSTOM RENDER WRAPPER:
//adds the "main" container wrapper to the template.
var render = {
    base: function(res,fileToRender,props){
        props.partial = fileToRender
        res.render('base.ejs',props)
    },
    adminBase: function(res,fileToRender,props){
        props.partial = fileToRender
        res.render('admin.ejs',props)
    }
};

//views
var main = function (req,res){
    render.base(res,'main.ejs',{});
};

var about = function (req,res){

};

var events = function (req,res){

};

var team = function (req,res){

};

var blog = function (req,res){

};

var blogPost = function (req,res){

};

var admin = function (req,res){

};

//urls
app.get("/", main);
app.get("/about",about);
app.get("/events",events);
app.get("/team",team);
app.get("/blog",blog);
app.get("/blog/:postId",blogPost);

app.get("/admin",admin);
// app.get("/admin/login",adminLogin);

// app.get("/admin/blog/create",blogWritePost);
// app.post("/admin/blog/create",blogCreatePost)
// app.get("/admin/blog/edit/:postId",blogRewritePost);
// app.put("/admin/blog/edit/:postId",blogUpdatePost);
// app.delete("/admin/blog/delete/:postId",blogDeletePost)

//run server.
var server = app.listen(2001, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log('App listening at http://%s:%s', host, port)
});