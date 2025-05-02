import { ValidationError } from 'class-validator';
import { BadRequestResponse, HttpError } from 'http-errors-response-ts/lib';
import { Types } from 'mongoose';

const errorFormatter = (errors: ValidationError[]) => {
	return errors.map((error) => {
		return {
			constraints: error.constraints,
			property: error.property,
		};
	});
};

const errorBody = (error: any) => {
	if (error instanceof HttpError)
		return {
			message: error.message,
			statusCode: error.statusCode,
			name: error.name,
		};
	return error;
};

const ObjectID = (id?: string) => {
	try {
		const mongoID = new Types.ObjectId(id);
		if (!mongoID) throw new BadRequestResponse('Invalid ID');
		return mongoID;
	} catch (error) {
		throw new BadRequestResponse('Invalid ID');
	}
};


export { errorFormatter, ObjectID, errorBody };
