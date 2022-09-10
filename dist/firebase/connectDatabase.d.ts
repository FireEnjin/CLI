import * as fbAdmin from "firebase-admin";
export default function connectDatabase({ emulate, host, ssl, }?: {
    emulate?: boolean;
    host?: string;
    ssl?: boolean;
}): fbAdmin.firestore.Firestore;
