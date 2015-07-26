con = require('./localconfig.js');



	con.knex('admins').insert({username: 'secatubc',
								hash: 'hammertime33'})
	.catch(function(error) {
        console.error(error)
    })
    .then(function(){
	console.log(" added admin account")
	process.exit();
	});