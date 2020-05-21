'use strict';

// import path from 'path';
import express from 'express';
import path from 'path';
import cors from 'cors';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import compression from 'compression';

import routers from './routers';
import config from '../config';
import {sendError, sendJson} from './middlewares/Response';

const app = new express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(compression());

if(process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
	app.use(cors());
}

app.use((req, res, next) => {
	// res.locals.user = req.session.user; //set current user
	res.locals.publish = config.publish;
	res.locals.server_static = config.server_static;
	res.locals.server_upload = config.server_upload;
	res.locals.pathname = req._parsedUrl.pathname;
	res.set('x-powered-by', 'MVTHP-2020');
	next();
});

app.use(sendError);
app.use(sendJson);
app.use('/api' , routers);

app.use(express.static(path.join(__dirname,'public'),{ maxAge: 129600000}));//1.5d

app.use(function(req, res){
	res.status(404);

	res.sendError({
		error: 404,
		message: 'not found'
	})
});

export default app;
