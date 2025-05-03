import { Request, Response, NextFunction } from 'express';
import { ConversationsService } from '../services/conversations.service';
import { MessageSender, MessageType } from '../models/message.model';
import { BadRequestResponse } from 'http-errors-response-ts/lib';

class ConversationsController {
    constructor(private service: ConversationsService) { }

    async getConversations(req: Request, res: Response, next: NextFunction) {
        try {
            const filter = req.query.filter ? JSON.parse(String(req.query.filter)) : {};
            const conversations = await this.service.getConversations(filter);
            res.status(200).json({ conversations });
        } catch (error) {
            next(error);
        }
    }

    async getConversation(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const conversation = await this.service.getConversation(id);
            res.status(200).json(conversation);
        } catch (error) {
            next(error);
        }
    }

    async findOrCreateConversation(req: Request, res: Response, next: NextFunction) {
        try {
            const { personId } = req.body;
            if (!personId) {
                throw new BadRequestResponse('Person ID is required');
            }
            const conversation = await this.service.findOrCreateConversation(personId);
            res.status(200).json(conversation);
        } catch (error) {
            next(error);
        }
    }

    async archiveConversation(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const conversation = await this.service.archiveConversation(id);
            res.status(200).json(conversation);
        } catch (error) {
            next(error);
        }
    }

    async markAsRead(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const conversation = await this.service.markAsRead(id);
            res.status(200).json(conversation);
        } catch (error) {
            next(error);
        }
    }

    async getMessages(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const limit = req.query.limit ? parseInt(String(req.query.limit)) : 50;
            const before = req.query.before ? new Date(String(req.query.before)) : undefined;

            const messages = await this.service.getMessages(id, limit, before);
            res.status(200).json({ messages });
        } catch (error) {
            next(error);
        }
    }

    async sendMessage(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { content, type, mediaUrl } = req.body;

            if (!content) {
                throw new BadRequestResponse('Message content is required');
            }

            const messageType = type ? (type as MessageType) : MessageType.TEXT;
            const message = await this.service.addMessage(
                id,
                MessageSender.SYSTEM,
                content,
                messageType,
                mediaUrl
            );

            res.status(201).json({ message });
        } catch (error) {
            next(error);
        }
    }
}

export { ConversationsController };