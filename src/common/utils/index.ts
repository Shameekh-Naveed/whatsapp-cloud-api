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

const validateTemplateData = (data: any[], template: any) => {
	const templateFields = template.sections.flatMap((section: any) => section.fields);
	const dataFields = data.map((d) => d.field.toString());

	const missingFields = templateFields.filter((field: any) => !dataFields.includes(field._id?.toString() || ''));
	return missingFields;
};

const getFields = (query: any) => {
	const { fields, expanded }: { fields?: string; expanded?: string } = query;
	if (!fields) return { fields: '', expanded: expanded?.split(',').join(' ') || '' };
	const output = fields?.split(',') || [];
	if (expanded) {
		const expandedFields = expanded.split(',');
		for (const expandedField of expandedFields) {
			output.push(expandedField);
		}
	}
	const outputFields = new Set(output);
	return { fields: [...outputFields].join(' '), expanded: expanded?.split(',').join(' ') || '' };
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

// Generates a select query based on given data and the expand arr
const generateSelectQuery = (query: string = '*', expand?: string[]) => {
	if (!expand) return query;
	let output = query;
	for (const expandField of expand) {
		output += `, ${expandField}(*)`;
	}
	return output;
};
export { errorFormatter, validateTemplateData, getFields, ObjectID, errorBody, generateSelectQuery };
