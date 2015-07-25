con = require('./localconfig.js');


// DOCS http://knexjs.org/#Schema
<<<<<<< HEAD
con.knex.schema.createTable('drone', function(table) {
	table.string('ip_addr');
	table.string('name');
	})

	.createTable('user', function(table) {
	table.string('email').unique();
	table.string('hash');
	table.string('salt');
=======
con.knex.schema.createTable('admins', function(table) {
	table.string('username').unique();
	table.string('hash');
	})

	.createTable('blog_posts', function(table) {
	table.date('date');
	table.text('content','longtext');
	table.string('title');
	})

	.createTable('events', function(table) {
	table.date('date');
	table.string('title');
	})

	.createTable('members', function(table) {
	table.string('title');
	table.text('discription');
	})

	.createTable('conference', function(table) {
	table.text('content','longtext');
	})

	.createTable('galaries', function(table) {
	table.binary('picture');
>>>>>>> 904cb851bc82a8ed8b6a43b541c594b63d13d1c1
	})
	
	.catch(function(e) {
  	console.error(e);
	})
	.then(function(){
	console.log(" EXITING")
	process.exit();
	});