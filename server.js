'use strict';

const Hapi = require('hapi');
const Good = require('good');
const Path = require('path');

// const server = new Hapi.Server();
// server.connection({
// 	host : 'localhost',
// 	port : 8000
// });

const server = new Hapi.Server({
	connections : {
		routes : {
			files : {
				relativeTo : Path.join(__dirname, 'public')
			}
		}
	}
})

//添加路由

server.route({
	method : 'GET',
	path : '/',
	handler : function (request, reply) {
		reply("root dictionary.");
	}
});

server.route({
	method : 'GET',
	path : '/{name}',
	handler : function (request, reply){
		reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
	}
});

// server.route({
// 	method : 'GET',
// 	path : '/hello',
// 	handler : function (request, reply) {
// 		return reply('Hello world!');
// 	}
// });

server.register(require('inert'), (err) => {
	if(err){
		throw err;
	}
	server.route({
		method : 'GET',
		path : '/hi/{name}',
		handler : function (request, reply) {
			reply.file('./public/hi.html');
		}
	});

	server.route({
		method : 'GET',
		path : '/pic.png',
		handler : function (request, reply){
			reply.file('./public/pic.png');
		}
	})
});

server.register({
	register: Good,
	options : {
		reporters : [{
			reporter : require('good-console'),
			events : {
				response : '*',
				log: '*'
			}
		}]
	}
},(err) => {
	if(err) {
		throw err;
	}

	server.start((err) => {
		if(err) {
			throw err;
		}
		server.log('info','server runing at: ' + server.info.uri);
	});
});

//运行服务
// server.start((err) => {
// 	if (err) {
// 		throw err;
// 	}
// 	console.log('Server running at :', server.info.uri);
// })