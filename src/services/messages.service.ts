import { Person } from '../models/person.model';
import { ConversationsService } from './conversations.service';
import { MessageSender, MessageType } from '../models/message.model';
import { MessageTemplates } from '../controllers/messages.controller';



class MessagesService {
	private conversationsService: ConversationsService;

	constructor() {
		this.conversationsService = new ConversationsService();
	}

	WHATSAPP_API_URL = "https://graph.facebook.com/v22.0";
	PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
	ACCESS_TOKEN = process.env.ACCESS_TOKEN;

	async sendMessages(numbers: string[], template: MessageTemplates, message: string) {
		const failedNumbers: string[] = [];
		const errors: any[] = [];
		const successNumbers: string[] = [];

		for (const number of numbers) {
			try {
				await this.sendMessage(number, template, message);
				successNumbers.push(number);
			} catch (error) {
				failedNumbers.push(number);
				errors.push(error);
			}
		}

		return {
			success: true,
			successNumbers,
			failedNumbers,
			errors
		}
	}


	async sendMessage(number: string, template: MessageTemplates, message: string) {
		const url = `${this.WHATSAPP_API_URL}/${this.PHONE_NUMBER_ID}/messages`;
		const requestBody = this.createRequestBody(number, template, message);

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${this.ACCESS_TOKEN}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(requestBody)
		});

		const data = await response.json();
		if (!response.ok) {
			const errorMessage = `Failed to send message to ${number}. Response: ${JSON.stringify(data)}`;
			throw new Error(errorMessage);
		}

		await this.handleConversationUpdate(number, template, message);

		return data;
	}

	private async handleConversationUpdate(number: string, template: MessageTemplates, message: string) {
		try {
			let person = await Person.findOne({ phoneNumber: number });

			// If person doesn't exist, create one
			if (!person) {
				person = new Person({
					name: 'Unknown',
					phoneNumber: number,
					tags: ['outgoing']
				});
				await person.save();
			}

			const conversation = await this.conversationsService.findOrCreateConversation(number);
			const systemMessage = this.generateSystemMessage(template, message);

			await this.conversationsService.addMessage(
				conversation._id.toString(),
				MessageSender.SYSTEM,
				systemMessage
			);
		} catch (error) {
			console.error(`Failed to update conversation for ${number}:`, error);
			// Swallowing the error to avoid breaking message sending
		}
	}

	private generateSystemMessage(template: MessageTemplates, message: string): string {
		if (template === MessageTemplates.NONE) {
			return message;
		}
		return `SYSTEM: Template ${template} sent successfully`;
	}


	// Process incoming WhatsApp webhook messages
	async processWebhook(payload: any) {
		try {
			if (!payload.entry || !payload.entry.length) {
				return {
					success: false,
					error: 'Invalid payload structure'
				};
			}

			for (const entry of payload.entry) {
				if (!entry.changes || !entry.changes.length) continue;

				for (const change of entry.changes) {
					// if (change.field == 'messages') continue;
					const value = change.value;
					if (!value) continue;
					if (value.messages) {
						for (const message of value.messages) {
							await this.handleIncomingMessage(message, value.contacts);
						}
					} else if (value.statuses) {
						for (const status of value.statuses) {
							const messageId = status.id;
							const statusType = status.status;
							const recipientNumber = status.recipient_id;
							console.log({ recipientNumber, statusType });
							const conversation = await this.conversationsService.findOrCreateConversation(recipientNumber);
							console.log({ conversation });
							// TODO: Could use some imporvements with the help of timestamps
							if (statusType === "read") {
								await this.conversationsService.userSeenAllMessages(conversation._id.toString());
							}
						}
					}
				}
			}

			return { success: true };
		} catch (error) {
			console.error('Error processing webhook:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			};
		}
	}


	private createRequestBody(number: string, template: MessageTemplates, message: string) {
		// For custom message
		if (template === MessageTemplates.NONE) {
			return {
				messaging_product: "whatsapp",
				recipient_type: "individual",
				to: number,
				type: "text",
				text: {
					preview_url: false,
					body: message
				}
			};
		}
		else if (template === MessageTemplates.DONATION_REMINDER_EN) {
			return {
				messaging_product: "whatsapp",
				to: number,
				type: "template",
				template: {
					name: MessageTemplates.DONATION_REMINDER_EN,
					language: {
						code: "en",
					},
				}
			};
		} else if (template === MessageTemplates.DONATION_REMINDER_UR) {
			return {
				messaging_product: "whatsapp",
				to: number,
				type: "template",
				template: {
					name: MessageTemplates.DONATION_REMINDER_UR,
					language: {
						code: "ur",
					},
				}
			};
		} else if (template === MessageTemplates.EID_REMINDER_EN) {
			return {
				messaging_product: "whatsapp",
				to: number,
				type: "template",
				template: {
					name: MessageTemplates.EID_REMINDER_EN,
					language: {
						code: "en",
					},
				}
			};
		} else if (template === MessageTemplates.DONATION_REMINDER_V2_EN) {
			return {
				messaging_product: "whatsapp",
				to: number,
				type: "template",
				template: {
					name: MessageTemplates.DONATION_REMINDER_V2_EN,
					language: {
						code: "en",
					},
				}
			};
		} else if (template === MessageTemplates.FLOOD_DONATION) {
			return {
				messaging_product: "whatsapp",
				to: number,
				type: "template",
				template: {
					name: MessageTemplates.FLOOD_DONATION,
					language: {
						code: "en",
					},
				}
			};
		} else if (template === MessageTemplates.FLOOD_DONATION_THANKS) {
			return {
				messaging_product: "whatsapp",
				to: number,
				type: "template",
				template: {
					name: MessageTemplates.FLOOD_DONATION_THANKS,
					language: {
						code: "en",
					},
				}
			};
		}

		else
			throw new Error("Invalid template provided");
	}

	private async handleIncomingMessage(message: any, contacts: any[]) {
		console.log({ message, contacts });
		if (!message.from) return;

		const phoneNumber = message.from;
		let person = await Person.findOne({ phoneNumber });

		// If person doesn't exist, create a new person record
		if (!person && contacts && contacts.length > 0) {
			const contact = contacts[0];
			person = new Person({
				name: contact.profile?.name || 'Unknown',
				phoneNumber,
				tags: ['incoming']
			});
			await person.save();
		} else if (!person) {
			person = new Person({
				name: 'Unknown',
				phoneNumber,
				tags: ['incoming']
			});
			await person.save();
		}

		// Find or create conversation
		const conversation = await this.conversationsService.findOrCreateConversation(phoneNumber);

		// Add message to conversation
		let content = '';
		let type = MessageType.TEXT;
		let mediaUrl;

		if (message.text) {
			content = message.text.body;
		} else if (message.image) {
			content = message.image.caption || 'Image';
			type = MessageType.IMAGE;
			mediaUrl = message.image.url;
		} else if (message.audio) {
			content = 'Audio message';
			type = MessageType.AUDIO;
			mediaUrl = message.audio.url;
		} else if (message.video) {
			content = message.video.caption || 'Video';
			type = MessageType.VIDEO;
			mediaUrl = message.video.url;
		} else if (message.document) {
			content = message.document.caption || 'Document';
			type = MessageType.DOCUMENT;
			mediaUrl = message.document.url;
		} else if (message.location) {
			content = 'Location';
			type = MessageType.LOCATION;
		} else {
			content = 'Unsupported message type';
		}

		await this.conversationsService.addMessage(
			conversation._id.toString(),
			MessageSender.USER,
			content,
			type,
			mediaUrl
		);
	}
}

export { MessagesService };
