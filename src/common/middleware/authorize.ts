import { Request, Response, NextFunction } from 'express';
import { UserLevels, UserRole } from '../enums';
import { User } from '../../core/models/users/model';

// Middleware to authorize based on roles
export const authorizeRole = (allowedRoles: (UserRole | UserLevels)[][]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const user = req.user as any; // Assumes that the token parsing middleware has already attached the user to the request object
		if (!user) {
			return res.status(401).json({ message: 'Unauthorized' });
		}

		let isAuthorized = false;
		allowedRoles.forEach((roles) => {
			if (roles.every((element) => user.rbac.includes(element))) isAuthorized = true;
		});

		if (!isAuthorized) return res.status(403).json({ message: 'Forbidden role' });

		next();
	};
};
