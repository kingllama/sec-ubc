con = require('./localconfig.js');


// DOCS http://knexjs.org/#Schema

con.knex.schema.createTable('admins', function(table) {
	table.increments();
	table.string('username').unique();
	table.string('hash');
	})

	.createTable('blog_posts', function(table) {
	table.increments();
	table.date('date');
	table.text('content','longtext');
	table.string('title');
	table.specificType('picture', 'text[]');
	})

	.createTable('events', function(table) {
	table.increments();
	table.date('date');
	table.string('title');
	table.string('content','longtext');
	table.string('link');
	table.string('image');
	})

	.createTable('members', function(table) {
	table.increments();
	table.string('title');
	table.string('description');
	table.date('date');
	table.string('image');
	})

	.createTable('conference', function(table) {
	table.increments();
	table.text('content','longtext');
	table.specificType('picture', 'text[]');
	})

	.createTable('opportunity', function(table) {
	table.increments();
	table.date('date');
	table.text('content','longtext');
	table.string('title');
	table.specificType('picture', 'text[]');
	})

	/*.createTable('galaries', function(table) {
	table.increments();
	table.bigInteger('bid').references('id').inTable('blog_posts');
	table.string('path');
	})*/

	.catch(function(e) {
  	console.error(e);
	})
	.then(function(){
	console.log(" EXITING")
	process.exit();
	});
