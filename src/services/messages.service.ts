import { Person } from '../models/person.model';
import { ConversationsService } from './conversations.service';
import { MessageSender, MessageType } from '../models/message.model';

class MessagesService {
	private conversationsService: ConversationsService;

	constructor() {
		this.conversationsService = new ConversationsService();
	}

	WHATSAPP_API_URL = "https://graph.facebook.com/v22.0";
	PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
	ACCESS_TOKEN = process.env.ACCESS_TOKEN;

	async sendMessages(numbers: string[], message: string) {
		const failedNumbers: string[] = [];
		const errors: any[] = [];
		const successNumbers: string[] = [];

		for (const number of numbers) {
			try {
				await this.sendMessage(number, message);
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

	async sendMessage(number: string, message: string) {
		const url = `${this.WHATSAPP_API_URL}/${this.PHONE_NUMBER_ID}/messages`;

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${this.ACCESS_TOKEN}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				messaging_product: "whatsapp",
				to: number,
				type: "template",
				template: {
					name: "donation_reminder",
					language: {
						code: "en",
					},
				}
			})
		});

		const data = await response.json();
		if (!response.ok) {
			const error = "Failed to send message to " + number + " Error stringified: " + JSON.stringify(data);
			throw new Error(error);
		}

		// Try to find a person with this number and update their conversation
		try {
			const person = await Person.findOne({ phoneNumber: number });
			if (person) {
				const conversation = await this.conversationsService.findOrCreateConversation(number);
				await this.conversationsService.addMessage(
					conversation._id.toString(),
					MessageSender.SYSTEM,
					"SYSTEM: donation_reminder template sent successfully"
				);
			} else {
				// Create a new person if not found
				const newPerson = new Person({
					name: 'Unknown',
					phoneNumber: number,
					tags: ['outgoing']
				});
				await newPerson.save();
				const conversation = await this.conversationsService.findOrCreateConversation(number);
				await this.conversationsService.addMessage(
					conversation._id.toString(),
					MessageSender.SYSTEM,
					"SYSTEM: donation_reminder template sent successfully"
				);
			}
		} catch (error) {
			console.error(`Failed to update conversation for ${number}:`, error);
			// Don't fail the whole operation if conversation update fails
		}

		return data;
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
