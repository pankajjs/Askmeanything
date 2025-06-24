import { OAuth2Client } from "google-auth-library";

export const oauth2Client = new OAuth2Client(
    process.env.AUTH_GOOGLE_ID,
    process.env.AUTH_GOOGLE_SECRET,
    process.env.CALLBACK_URL
)