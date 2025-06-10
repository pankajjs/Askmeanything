import { OAuth2Client } from "google-auth-library";
import { config } from "./config";

export const oauth2Client = new OAuth2Client(
    config.AUTH_GOOGLE_ID,
    config.AUTH_GOOGLE_SECRET,
    config.CALLBACK_URL
)