// import 'reflect-metadata';

import config from './src/config/configuration';
import http from 'http';
import appContainer from './src/app';

// const db = dbContainer(config.dbConnectionString!);

const app = appContainer.init();

const shutdownRoutine = async (server: http.Server) => {
	// await db.close();
	// server.close();
	console.log('Shutdown routine');
	process.exit(1);
};

const startupRoutine = async () => {
	const server = app.listen(config.httpPort, () => {
		console.log(`Listening on port:${config.httpPort}`);
	});
	try {
		// await db.connect();
	} catch (error) {
		await shutdownRoutine(server);
	}
};
startupRoutine();

process.on('SIGINT', shutdownRoutine);
process.on('SIGTERM', shutdownRoutine);

process.on('uncaughtException', (err) => {
	console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
