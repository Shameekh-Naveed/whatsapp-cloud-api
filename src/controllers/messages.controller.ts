import { Request, Response } from "express";
import { MessagesService } from "../services/messages.service";
import {
  BadGatewayResponse,
  BadRequestResponse,
  UnauthorizedResponse,
} from "http-errors-response-ts/lib";

export enum MessageTemplates {
  DONATION_REMINDER_EN = "donation_reminder",
  DONATION_REMINDER_UR = "donation_reminder_ur",
  EID_REMINDER_EN = "eid_reminder",
  DONATION_REMINDER_V2_EN = "donation_reminder_v2_en",
  FLOOD_DONATION = "flood_donation",
  FLOOD_DONATION_THANKS = "flood_donation_thanks",
  NGO_REGISTERATION = "ngo_registeration",
  NONE = "none",
}

class MessagesController {
  constructor(private service: MessagesService) {}
  verify_token = process.env.WHATSAPP_VERIFY_TOKEN;

  async sendMessages(req: Request, res: Response) {
    const {
      numbers,
      template = MessageTemplates.DONATION_REMINDER_EN,
      message,
    } = req.body;

    if (!numbers)
      throw new BadRequestResponse("Numbers and message are required");

    if (template === MessageTemplates.NONE && !message)
      throw new BadRequestResponse("Message is required when template is NONE");

    if (template !== MessageTemplates.NONE && message)
      throw new BadRequestResponse(
        "Message should not be provided when using a template"
      );

    if (
      template !== MessageTemplates.NONE &&
      !Object.values(MessageTemplates).includes(template)
    )
      throw new BadRequestResponse("Invalid template provided");

    // All numbers should start with 92 and have a total of 12 numbers
    const validNumbers = numbers.filter(
      (number: string) => number.startsWith("92") && number.length === 12
    );
    const invalidNumbers = numbers.filter(
      (number: string) => !number.startsWith("92") || number.length !== 12
    );

    if (validNumbers.length === 0)
      throw new BadRequestResponse("No valid numbers found");
    if (validNumbers.length !== numbers.length) {
      return res.status(400).json({
        message: "Some numbers are invalid",
        invalidNumbers: invalidNumbers,
      });
    }

    const response = await this.service.sendMessages(
      validNumbers,
      template,
      message
    );
    res.status(200).json(response);
  }

  async whatsappWebhook(req: Request, res: Response) {
    console.log("Incoming webhook message:");
    try {
      // Process the webhook payload
      const result = await this.service.processWebhook(req.body);
      console.log({ result });

      // Always return 200 OK to WhatsApp to acknowledge receipt
      return res.status(200).send("Webhook processed successfully");
    } catch (error) {
      console.error("Error processing webhook:", error);
      // Still return 200 to WhatsApp
      return res.status(200).send("Webhook received with errors");
    }
  }

  async verifyWhatsappWebhook(req: Request, res: Response) {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token) {
      if (mode === "subscribe" && token === this.verify_token) {
        console.log("WEBHOOK_VERIFIED");
        return res.status(200).send(challenge);
      } else throw new UnauthorizedResponse("Invalid token");
    } else throw new BadGatewayResponse("Invalid request");
  }
}

export { MessagesController };
