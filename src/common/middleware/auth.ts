import { createClient } from '@supabase/supabase-js';
import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from 'express-jwt';
import { InternalServerResponse, UnauthorizedResponse } from 'http-errors-response-ts/lib';
import jwt from 'jsonwebtoken';

const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
	// try {
	const token = req?.headers?.authorization?.split(' ')[1];
	if (!token) return res.status(401).json({ message: 'Unauthorized! No token found' });
	// throw new UnauthorizedResponse('please login first');
	try {
		const user = jwt.verify(token, process.env.JWT_SECRET!);
		if (!user) return res.status(401).json({ message: 'Unauthorized! Invalid token' });
		req.user = user!;
	} catch (error) {
		console.log({ error });
		return res.status(500).json({ message: 'Internal server error' });
	}
	next();

	// passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
	// 	if (err) return res.status(500).json({ message: 'Authentication failed' });
	// 	if (!user) return res.status(401).json({ message: 'Unauthorized' });
	// 	req.user = user;
	// 	req.auth = user;
	// 	next();
	// })(req, res, next);
};

export { authenticateUser };
