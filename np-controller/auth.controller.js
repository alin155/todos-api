/*
*
* 权限控制器
*
*/

const { handleRequest, handleError, handleSuccess } = require('np-utils/np-handle');
const Auth = require('np-model/auth.model');
const config = require('np-config');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const authCtrl = { user:{}, login: {}, register: {} };

// md5编码
const md5Decode = pwd => {
	return crypto.createHash('md5').update(pwd).digest('hex');
};

// get auth info
authCtrl.user.GET = (req, res) => {
	Auth.find({username: req.tokenUsername}, '-_id -password')
	.then(([result = {}]) => {
		console.log(result);
		handleSuccess({ res, result, message: 'get authinfo success!' });
	})
	.catch(err => {
		handleError({ res, err, message: 'get authinfo err!' });
	})
};

// 修改权限和个人信息
authCtrl.user.PUT = ({ body: auth }, res) => {

	// 初始化
	let { username, slogan, gravatar, password, new_password, rel_new_password } = auth;
	
	// 验证密码
	if (!password || ((!new_password || !rel_new_password) || !Object.is(new_password, rel_new_password))) {
		handleError({ res, message: '密码不一致或无效' });
		return false;
	};

	if ([new_password, rel_new_password].includes(password)) {
		handleError({ res, message: '新旧密码不可一致' });
		return false;
	};
	
	// 修改前查询验证
	Auth.find({username: username}, '_id username slogan gravatar password')
	.then(([_auth = {}]) => {
		if (!Object.is(_auth.password, md5Decode(password))) {
			handleError({ res, message: '原密码不正确' }); 
		} else {
			auth.password = md5Decode(auth.rel_new_password);
			return (_auth._id ? Auth.findByIdAndUpdate(_auth._id, auth, { new: true }) : new Auth(auth).save())
		}
	})
	.then(({ username, slogan, gravatar } = auth) => {
		handleSuccess({ res, result: { username, slogan, gravatar }, message: '用户权限修改成功' });
	})
	.catch(err => {
		handleError({ res, err, message: '用户权限修改失败' });
	})
};

// login and sign Token
authCtrl.login.POST = ({ body: auth }, res) => {

	let { username, password } = auth;
	// Verify
	if (!username || !password) {
		handleError({ res, err: { err: 'username or password can\'t be empty!' }, message: 'register err!' });
	}

	Auth.find({username: username}, '-_id username password')
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

// register
authCtrl.register.POST = ({ body: auth }, res) => {
	
	let { username, password } = auth;
	
	if (!username || !password) {
		handleError({ res, err: { err: 'username or password can\'t be empty!' }, message: 'register err!' });
	}

	Auth.find({username: username})
	.then(([_auth = {}]) =>{
		if (typeof(_auth.username) === "undefined") {
			auth.password = md5Decode(auth.password);
			new Auth(auth).save()
			.then((result = auth) => {
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
//module.exports = (req, res) => { handleRequest({ req, res, controller: authCtrl })};
exports.user = (req, res) => { handleRequest({ req, res, controller: authCtrl.user })};
exports.login = (req, res) => { handleRequest({ req, res, controller: authCtrl.login })};
exports.register = (req, res) => { handleRequest({ req, res, controller: authCtrl.register })};