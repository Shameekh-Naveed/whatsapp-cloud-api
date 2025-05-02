const http = require('http');
import express, { NextFunction, Request, Response } from 'express';
import messagesRoutes from './routes/messages/routes';
// import peopleRoutes from './routes/people/routes';
import conversationsRoutes from './routes/conversations/routes';
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

import config from './config/configuration';
import { authenticateUser } from './common/middleware/auth';
import errorHandler from './common/middleware/error';
import connectDB from './config/database.config';

const app = express();
app.disable('x-powered-by');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(cors());

const init = () => {
	app.use(express.static(path.join(__dirname, 'public')));

	// Connect to MongoDB
	connectDB();

	app.use('/api/messages', messagesRoutes.init());
	// app.use('/api/people', peopleRoutes.init());
	app.use('/api/conversations', conversationsRoutes.init());

	// @ts-ignore
	app.use(errorHandler);

	const httpServer = http.createServer(app);
	return httpServer;
};

export default { init };
