/*
*
* 权限控制器
*
*/

const { handleRequest, handleError, handleSuccess } = require('np-utils/np-handle');
const User = require('np-model/user.model');
const config = require('np-config');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userCtrl = { user:{}, login: {}, register: {} };

// md5编码
const md5Decode = pwd => {
	return crypto.createHash('md5').update(pwd).digest('hex');
};

// get user info by jwt-tokenUsername
userCtrl.user.GET = ({ tokenUsername: username }, res) => {

	User.find({username: username}, '-_id -password -__v')
	.then(([result = {}]) => {
		handleSuccess({ res, result, message: 'get userinfo success!' });
	})
	.catch(err => {
		handleError({ res, err, message: 'get userinfo err!' });
	})
};

// change user password by jwt-tokenUsername
userCtrl.user.PUT = ({ body: user, tokenUsername: username }, res) => {

	// init
	const { slogan, gravatar, password, new_password, rel_new_password } = user;
	
	// auth password new_password and rel_new_password
	if (!password || ((!new_password || !rel_new_password) || !Object.is(new_password, rel_new_password))) {
		handleError({ res, message: 'password not consistent or invalid' });
		return false;
	};

	if ([new_password, rel_new_password].includes(password)) {
		handleError({ res, message: 'new-old password not consistent' });
		return false;
	};
	
	// auth password before change
	User.find({username: username}, '-__v')
	.then(([result = {}]) => {
		if (!Object.is(result.password, md5Decode(password))) {
			handleError({ res, message: 'password err' }); 
		} else {
			user.password = md5Decode(user.rel_new_password);
			User.findByIdAndUpdate(result._id, user.password, { new: true })
			.then(result => {
				handleSuccess({ res, result: 'password changed!', message: 'change password success' });
			})
			.catch(err => {
				handleError({ res, err: 'update err', message: 'change password err' });
			})
		}
	})
	.catch(err => {
		handleError({ res, err: 'find err', message: 'change password err' });
	})
};

// change someting
userCtrl.user.PATCH = ({ body: user, tokenUsername: username }, res) => {

	const { slogan, gravatar } = user;
	
	// find user by username
	User.find({username: username}, '-__v')
	.then(([result = {}]) => {
		delete user.password
		delete user.username
		delete user._id
		delete user.todos
		User.findByIdAndUpdate(result._id, user, { new: true })
		.then(result => {
			handleSuccess({ res, result: 'changed!', message: 'change success' });
		})
		.catch(err => {
			handleError({ res, err: 'update err', message: 'change err' });
		})
	})
	.catch(err => {
		handleError({ res, err: 'find err', message: 'change err' });
	})
};

// login and sign Token by username and password
userCtrl.login.POST = ({ body: user }, res) => {
	
	let { username, password } = user;
	// Verify
	if (!username || !password) {
		handleError({ res, err: { err: 'username or password can\'t be empty!' }, message: 'register err!' });
	}

	User.find({username: username}, '-_id username password')
	.then(([result = {}]) => {
		if (!!username && Object.is(result.username, username)) {			
			if (!!password && Object.is(result.password, md5Decode(password))) {
				const token = jwt.sign({
					data: username,
					exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
				}, config.JWT.jwtTokenSecret);
				handleSuccess({ res, result: { token }, message: 'login success!' });
			} else {
				handleError({ res, err: { err: 'password err!' }, message: 'login err!' });
			}
		} else {
			handleError({ res, err: { err: 'username err!' }, message: 'login err!' });
		}		
	})
	.catch(err => {
		handleError({ res, err, message: 'login err!' });
	})
};

// register by username and password
userCtrl.register.POST = ({ body: user }, res) => {
	
	let { username, password } = user;
	
	if (!username || !password) {
		handleError({ res, err: { err: 'username or password can\'t be empty!' }, message: 'register err!' });
	}

	User.find({username: username})
	.then(([_user = {}]) =>{
		if (typeof(_user.username) === "undefined") {
			user.password = md5Decode(user.password);
			new User(user).save()
			.then((result = user) => {
				handleSuccess({ res, result, message: 'register success!' });
			})
			.catch(err => {
				handleError({ res, err, message: 'register err!' });
			})
		} else {
			handleError({ res, err: { err: 'username existed!' }, message: 'register err!' });
		}	
	})
	.catch(err => {
		handleError({ res, err, message: 'register err!' });
	})
};

// export
exports.user = (req, res) => { handleRequest({ req, res, controller: userCtrl.user })};
exports.login = (req, res) => { handleRequest({ req, res, controller: userCtrl.login })};
exports.register = (req, res) => { handleRequest({ req, res, controller: userCtrl.register })};