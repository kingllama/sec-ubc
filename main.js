// Main file
// initiate:
var express = require("express");
var app = express();
var session = require('express-session');
var con = require(__dirname + '/db/localconfig.js');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('ejs');
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(session({secret: 'cool'}));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, false);
});

console.log("Node Server is Running!");

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
	console.log("-----")
        console.log(req.session);
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

var authHelperPost = function (req,res){
	console.log('login POST hit')
	
}

var authHelper = function (req,res){
	res.render('login.ejs',{});
}



passport.use(new LocalStrategy(
	{
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },function(req, username, password, done,err) { 
    // check in mongo if a user with username exists or not
    con.knex('admins').select().from('admins').where({username: username}).then(function(a) {
        //In case of any error, return using the done method
        //console.log(a);
        if (err)
          return done(err);
        // Username does not exist, log error & redirect back
        if (a.length == 0){
          console.log('User Not Found with username '+username);
          return done(null, false);                 
        }
        // User exists but wrong password, log the error\
        console.log(password+a[0].hash)
        if (password.localeCompare(a[0].hash)){
          console.log('Invalid Password');
          return done(null, false);
        }
        // User and password both match, return user from 
        // done method which will be treated like success
        return done(null, a);
      }
    );
}));



//urls
app.get("/", main);
app.get("/about",about);
app.get("/events",events);
app.get("/team",team);
app.get("/blog",blog);
app.get("/blog/:postId",blogPost);

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

app.post("/login",passport.authenticate('local', { successRedirect: '/admin',
                                   failureRedirect: '/login',
                                   failureFlash: true }));
app.get("/login",authHelper);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/'); //Can fire before session is destroyed?
});s

//run server.
var server = app.listen(2001, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log('App listening at http://%s:%s', host, port)
});