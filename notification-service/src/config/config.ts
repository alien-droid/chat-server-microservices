import { config } from "dotenv";

const configFile = `./.env`;
config({ path: configFile });

const { MESSAGE_BROKER_URL, NODE_ENV, PORT } =
    process.env;

const queue = { notifications: "NOTIFICATIONS" };

export default {
    MESSAGE_BROKER_URL,
    env: NODE_ENV,
    PORT,
    queue,
}