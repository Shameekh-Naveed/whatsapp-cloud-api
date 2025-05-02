import { isValidObjectId } from 'mongoose';
import { Person, IPerson } from '../models/person.model';
import { BadRequestResponse, NotFoundResponse } from 'http-errors-response-ts/lib';

class PeopleService {
    constructor() { }

    async create(data: Partial<IPerson>): Promise<IPerson> {
        try {
            const person = new Person(data);
            return await person.save();
        } catch (error: any) {
            if (error.name === 'ValidationError') {
                throw new BadRequestResponse(error.message);
            }
            throw error;
        }
    }

    async findById(id: string): Promise<IPerson> {
        if (!id)
            throw new BadRequestResponse('ID is required');

        // If the ID is not a valid ObjectId, Mongoose will throw a CastError
        // which we can catch and throw a NotFoundResponse
        if (!isValidObjectId(id))
            throw new NotFoundResponse('Invalid ID format');


        const person = await Person.findById(id);
        if (!person)
            throw new NotFoundResponse('Person not found');
        return person;
    }

    async findAll(filter?: Record<string, any>): Promise<IPerson[]> {
        const query = filter || {};
        const people = await Person.find(query);

        if (!people.length) {
            throw new NotFoundResponse('No people found');
        }
        return people;
    }

    async update(id: string, data: Partial<IPerson>): Promise<IPerson> {
        const person = await this.findById(id);

        Object.assign(person, data);
        return await person.save();
    }

    async delete(id: string): Promise<{ message: string }> {
        const person = await this.findById(id);
        await person.deleteOne();
        return { message: 'Person deleted successfully' };
    }

    async findByPhoneNumbers(numbers: string[]): Promise<IPerson[]> {
        return await Person.find({ phoneNumber: { $in: numbers } });
    }
}

export { PeopleService };