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

var moment = require('moment')
//truncation helper method: use like this .trunc(#num of characters)
String.prototype.trunc = String.prototype.trunc || function(n){ return this.length>n ? this.substr(0,n-1)+'&hellip;' : this; };
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
    render.base(res,'about.ejs',{})
};


var blog = function (req,res){
    var blogs = con.knex('blog_posts').select().from('blog_posts').then(function(a) {
        render.base(res,'blog.ejs',{posts:a}) 
    }).catch(function(error) {
        console.error(error)
    });
};

var team = function (req,res){
    var blogs = con.knex('members').select().from('members').then(function(a) {
        render.base(res,'team.ejs',{posts:a}) 
    }).catch(function(error) {
        console.error(error);
    });
};

var events = function (req,res){
	var blogs = con.knex('events').select().from('events').then(function(a) {
        var properDateEvents = []
        for(var i=0; i< a.length; i++){
            a[i].date = moment(a[i].date).format("MMMM Do, YYYY")
            properDateEvents.push(a[i]);
        };
        render.base(res,'events.ejs',{posts:a}) 
    }).catch(function(error) {
        console.error(error);
    });
};


var blogPost = function (req,res){
    var blogs = con.knex('blog_posts').select().from('blog_posts').where('id',req.params.postId).then(function(a) {
        render.base(res,'blog.ejs',{posts:a})
    }).catch(function(error) {
        console.error(error)
    });
};

var admin = function (req,res){
	render.adminBase(res,'addBlog.ejs',{});
};

var blogCreatePost = function (req,res){
	console.log('blog POST hit');
	con.knex('blog_posts').insert({content: req.body.blogContent,
									title: req.body.blogTitle,
									date: new Date() })
	.catch(function(error) {
    console.error(error)
  });
	res.send('added');
};

var conference = function (req,res){
    render.base(res,"conference.ejs",{})
}

var opportunities = function (req,res){
    render.base(res,"opportunities.ejs",{})
}

var supporters = function (req,res){
    render.base(res,"supporters.ejs",{})
}

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

var memberAddPost = function (req,res){
	console.log('member POST hit')
	con.knex('members').insert({
        description: req.body.memberDescription,
        title: req.body.memberTitle
		// picture: req.body.picture 
    }).catch(function(error) {
        console.error(error);
    });
    res.send('added');
};

var eventAddPost = function (req,res){
	console.log('event POST hit')
	if (!isNaN(req.body.eventDate.valueOf())){
		var date_now = new Date()
		console.log('DIDNT rcvd a date')
	}else{
		console.log('rcvd a date')
		var date_now = req.body.eventDate
	}
	con.knex('events').insert({date: date_now,
								title: req.body.eventTitle})
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
app.get("/opportunities",opportunities);
app.get("/supporters",supporters);
app.get("/conference",conference);

app.get("/admin",admin);
app.get("/admin/login",adminLogin);


//blog
app.get("/admin/blog/create",blogWritePost);
app.post("/admin/blog/create",blogCreatePost);


//members
//app.get("/admin/member/add",memberAdd);
app.post("/admin/member/add",memberAddPost);


//events
//app.get("/admin/event/add",eventAdd);
app.post("/admin/event/add",eventAddPost);

app.get("/admin/blog/edit/:postId",blogRewritePost);
app.put("/admin/blog/edit/:postId",blogUpdatePost);
app.delete("/admin/blog/delete/:postId",blogDeletePost)

//run server.
var server = app.listen(2001, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log('App listening at http://%s:%s', host, port)
});