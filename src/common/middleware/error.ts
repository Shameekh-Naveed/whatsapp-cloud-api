import { NextFunction, Request, Response } from 'express';
import { HttpError } from 'http-errors-response-ts/lib';

export default function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
	console.log({ err });
	if (err instanceof HttpError)
		return res.status(err.statusCode || 500).json({
			message: err.message,
			statusCode: err.statusCode,
			name: err.name,
		});

	// If it's not an instance of HttpError, pass it to the default error handler
	// next(err);
	return res.status(500).json({
		message: 'Internal server error',
		statusCode: 500,
		name: 'InternalServerResponse',
	});
}
