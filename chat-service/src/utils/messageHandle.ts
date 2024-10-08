import { UserStatusStore } from "./userStore";
import { rabbitMQService } from "../services/RabbitMQService";

const userStatusStore = UserStatusStore.getInstance();

// if the receiver is offline, send a notification to the receiver
export const handleMessageReceived = async (
    senderName: string,
    senderEmail: string,
    receiverId: string,
    messageContent: string
) => {
    const receiverIsOffline = !userStatusStore.isUserOnline(receiverId);

    if (receiverIsOffline) {
        await rabbitMQService.notifyReceiver(
            receiverId,
            messageContent,
            senderEmail,
            senderName
        );
    }
};