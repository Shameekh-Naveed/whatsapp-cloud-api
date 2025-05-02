import upload from '../../config/multer';
import { MessagesController } from '../../controllers/messages.controller';
import { MessagesService } from '../../services/messages.service';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router({ mergeParams: true });

const service = new MessagesService();
const controller = new MessagesController(service);

function init() {
	router.post('/send-messages', async (req: any, res: any) => controller.sendMessages(req, res));
	router.get('/whatsapp-webhook', async (req: any, res: any) => controller.verifyWhatsappWebhook(req, res));
	router.post('/whatsapp-webhook', async (req: any, res: any) => controller.whatsappWebhook(req, res));
	return router;
}

export default { init };
