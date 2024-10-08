import amqp, { Channel } from "amqplib";
import { UserStatusStore } from "../utils";
import config from "../config/config";
import { FCMService } from "./FCMService";

class RabbitMQService {
  private channel!: Channel;
  private userStatusStore = UserStatusStore.getInstance();
  private fcmService: FCMService = new FCMService();
  constructor() {
    this.init();
  }

  async init() {
    const connection = await amqp.connect(config.MESSAGE_BROKER_URL!);
    this.channel = await connection.createChannel();
    await this.notificationReceived();
  }

  async notificationReceived() {
    await this.channel.assertQueue(config.queue.notifications);
    this.channel.consume(config.queue.notifications, async (msg) => {
      if (msg) {
        const { type, userId, userToken, message } = JSON.parse(
          msg.content.toString()
        );
        if (type === "MESSAGE_RECEIVED") { 
          if (this.userStatusStore.isUserOnline(userId) && userToken) { // user is online, send push notification
            await this.fcmService.sendPushNotification(userToken, message);
          } // in case, user seems offline, introduce a email-type notification
        }
        this.channel.ack(msg);
      }
    });
  }
}

export const rabbitMQService = new RabbitMQService();
