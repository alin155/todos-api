const argv = require('yargs').argv;

exports.MONGODB = {
	uri: `mongodb://127.0.0.1:${argv.dbport || '27017'}/TodosApi`,
	username: argv.db_username || 'DB_username',
	password: argv.db_password || 'DB_password'
}

exports.JWT = {
	jwtTokenSecret: argv.auth_key || 'todosapijwttokensecret',
}

exports.APP = {
	ROOT_PATH: __dirname,
	LIMIT: 16,
	PORT: 8000
}

exports.INFO = {
	name: 'TodosApi',
	version: '1.1.0',
	author: 'Allen'
}
