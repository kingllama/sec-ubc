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
var fs = require('fs');
var multer = require('multer');
var upload = multer({ 
    dest: './public/images/uploads/',
    rename: function (fieldname, filename) {
        return filename.replace(/\W+/g, '-').toLowerCase() + Date.now();
    },
    onFileUploadStart: function (file) {
        console.log(file.fieldname + ' is starting ...');
    },
    onFileUploadData: function (file, data) {
        console.log(data.length + ' of ' + file.fieldname + ' arrived');
    },
    onFileUploadComplete: function (file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path);
    }
});
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({secret: 'cool'}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, false);
});

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
    var blogs = con.knex('blog_posts').select().from('blog_posts').orderBy('id','desc').then(function(a) {
        var truncatedBlogPosts = []
        render.base(res,'blog.ejs',{posts:a});
    }).catch(function(error) {
        console.error(error);
    });
};

var team = function (req,res){
    if(req.query.year){
        year = +req.query.year
    } else {
        year = new Date().getFullYear()
    };
    //.where("year",year)
    var blogs = con.knex('members').select().from('members').then(function(a) {
        years = [year-2,year-1,year,year+1]
        render.base(res,'team.ejs',{posts:a,years:years}) 
    }).catch(function(error) {
        console.error(error);
    });
};

var events = function (req,res){
    if(req.query.year){
        year = +req.query.year
    } else {
        year = new Date().getFullYear()
    };

	var blogs = con.knex('events').select().from('events').whereBetween("date",[year+"/01/01",year+"/12/31"]).then(function(a) {
        var properDateEvents = []
        for(var i=0; i< a.length; i++){
            a[i].date = moment(a[i].date).format("MMMM Do, YYYY")
            properDateEvents.push(a[i]);
        };
        years = [year-2,year-1,year,year+1]
        render.base(res,'events.ejs',{posts:a,years:years}) 
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
        console.log(req.user);
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
     var blogs = con.knex('opportunity').select().from('opportunity').then(function(a) {
        render.base(res,'opportunity.ejs',{posts:a})
    }).catch(function(error) {
        console.error(error)
    });
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
	if (!isNaN(req.body.memberDate.valueOf())){
		var date_now = new Date()
		console.log('DIDNT rcvd a date')
	}else{
		console.log('rcvd a date')
		var date_now = req.body.memberDate
	}
	con.knex('members').insert({
        description: req.body.memberDescription,
        title: req.body.memberTitle,
        date: date_now
		// picture: req.body.picture 
    }).catch(function(error) {
        console.error(error);
    });
    res.send('added');
};

var eventAddPost = function (req,res){
	// get the temporary location of the file
    var tmp_path = req.file.path;
    // set where the file should actually exists 
    var target_path = "/public/images/uploads/" + req.file.filename + ".jpg";
    console.log(target_path)
    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        fs.unlink(tmp_path, function() {
            if(err) {
                throw err;
            } else {
                var profile_pic = req.file.name;
                //use profile_pic to do other stuffs like update DB or write rendering logic here.
            };
        });
    });

	if (!isNaN(req.body.eventDate.valueOf())){
		var date_now = new Date()
		console.log('DIDNT rcvd a date')
	}else{
		console.log('rcvd a date')
		var date_now = req.body.eventDate
	}
	con.knex('events').insert({date: date_now,
								title: req.body.eventTitle,
								content: req.body.eventContent,
								link: req.body.eventLink})
	.catch(function(error) {
        console.error(error)
    });
	res.send('added');

};

var opportunityAddPost = function (req,res){
	console.log('member POST hit')
	con.knex('opportunity').insert({content: req.body.opportunityContent,
									title: req.body.opportunityTitle,
									date: new Date() })
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
        console.log(a);
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
app.post("/admin/event/add",upload.single('eventphoto'),eventAddPost);

//opportunities
app.post("/admin/opportunity/add",opportunityAddPost);


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
});

//run server.
var server = app.listen(2001, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log('App listening at http://%s:%s', host, port)
});