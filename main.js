// Main file
// initiate:
var express = require("express");
var app = express();
var session = require('express-session');
var con = require(__dirname + '/db/localconfig.js');
var bodyParser = require('body-parser');
require('ejs');
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(session({secret: 'cool'}));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

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
    render.base(res,"about.ejs",{})
};

var events = function (req,res){
    render.base(res,"events.ejs",{})
};

var confrence = function (req, res){
    render.base(res,"confrence.ejs", {})
};

var team = function (req,res){
    render.base(res, "team.ejs", {})
};
//NOT WORKING
var blog = function (req,res){
	var blogs = con.knex('blog_posts').select().from('blog_posts')
	 .then(function() {  return; })
	.catch(function(error) {
    console.error(error)
  });
	console.log(blogs);
	res.send(blogs);

};

var blogPost = function (req,res){

};

var admin = function (req,res){

};

var blogCreatePost = function (req,res){
	con.knex('blog_posts').insert({content: req.body.content,
									title: req.body.title,
									date: new Date() })
	.catch(function(error) {
    console.error(error)
  });
	res.send('added');
};

var adminLogin = function (req,res){

};

var blogWritePost = function (req,res){

};

var blogRewritePost = function (req,res){

};

var blogUpdatePost = function (req,res){

};


var blogDeletePost = function (req,res){

};

var memberAdd = function (req,res){
	con.knex('members').insert({description: req.body.description,
									title: req.body.title })
	.catch(function(error) {
    console.error(error)
  });
	res.send('added');
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
app.get("/admin/blog/create",blogWritePost);
app.post("/admin/blog/create",blogCreatePost);
app.post("/admin/member/add",memberAdd);
app.get("/admin/blog/edit/:postId",blogRewritePost);
app.put("/admin/blog/edit/:postId",blogUpdatePost);
app.delete("/admin/blog/delete/:postId",blogDeletePost)

//run server.
var server = app.listen(2001, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log('App listening at http://%s:%s', host, port)
});
