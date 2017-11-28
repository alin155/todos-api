// 路由管理

const config = require('np-config');
const controller = require('np-controller');
const authIsVerified = require('np-utils/np-auth');
const routes = app => {

	// 拦截器
	app.all('*', (req, res, next) => {

		// Set Header
		const allowedOrigins = ['https://TodosApi.com', 'https://admin.TodosApi.com'];
		const origin = req.headers.origin || '';
		if (allowedOrigins.includes(origin) || origin.includes('localhost')) {
			res.setHeader('Access-Control-Allow-Origin', origin);
		};
		res.header('Access-Control-Allow-Headers', 'Authorization, Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With');
		res.header('Access-Control-Allow-Methods', 'PUT,PATCH,POST,GET,DELETE,OPTIONS');
		res.header('Access-Control-Max-Age', '1728000');
		res.header('Content-Type', 'application/json;charset=utf-8');
		res.header('X-Powered-By', 'TodosApi 1.0.0');

		// OPTIONS
		if (req.method == 'OPTIONS') {
			res.sendStatus(200);
			return false;
		};

		// 如果是生产环境，需要验证用户来源渠道，防止非正常请求
		if (Object.is(process.env.NODE_ENV, 'production')) {
			const { origin, referer } = req.headers;
			const originVerified = (!origin	|| origin.includes('TodosApi.com')) && 
									(!referer || referer.includes('TodosApi.com'))
			if (!originVerified) {
				res.status(403).jsonp({ code: 0, message: '来者何人！' })
				return false;
			};
		};

		// 排除auth的post请求
		const isPostLogin = Object.is(req.url, '/auth/login') && Object.is(req.method, 'POST');
		const isPostRegister = Object.is(req.url, '/auth/register') && Object.is(req.method, 'POST');
		if (isPostLogin || isPostRegister) {
			next();
			return false;
		};

		// 拦截所有非管路员的请求
		if (!authIsVerified(req)) {
			res.status(401).jsonp({ code: 0, message: '来者何人！' })
			return false;
		};

		next();
	});

	// Api
	app.get('/', (req, res) => {
		res.jsonp(config.INFO);
	});

	// Auth
	app.all('/auth', controller.auth.user);
	app.post('/auth/login', controller.auth.login);
	app.post('/auth/register', controller.auth.register);

	// todo
	app.all('/todo', controller.todo);

	// record
	app.all('/record', controller.record);

	// 404
	app.all('*', (req, res) => {
		res.status(404).jsonp({
			code: 0,
			message: '无效的API请求'
		})
	});
};

module.exports = routes;
