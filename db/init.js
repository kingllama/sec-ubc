con = require('./localconfig.js');


// DOCS http://knexjs.org/#Schema
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
	})
	
	.catch(function(e) {
  	console.error(e);
	})
	.then(function(){
	console.log(" EXITING")
	process.exit();
	});