import express from 'express';
import { ConversationsController } from '../../controllers/conversations.controller';
import { ConversationsService } from '../../services/conversations.service';

const router = express.Router({ mergeParams: true });
const service = new ConversationsService();
const controller = new ConversationsController(service);

function init() {
    // Conversation routes
    router.get('/', (req, res, next) => controller.getConversations(req, res, next));
    router.post('/', (req, res, next) => controller.findOrCreateConversation(req, res, next));
    router.get('/:id', (req, res, next) => controller.getConversation(req, res, next));
    router.patch('/:id/archive', (req, res, next) => controller.archiveConversation(req, res, next));
    router.patch('/:id/read', (req, res, next) => controller.markAsRead(req, res, next));

    // Message routes
    router.get('/:id/messages', (req, res, next) => controller.getMessages(req, res, next));
    router.post('/:id/messages', (req, res, next) => controller.sendMessage(req, res, next));

    return router;
}

export default { init };