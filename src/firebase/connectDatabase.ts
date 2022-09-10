import * as fbAdmin from "firebase-admin";
import * as fs from "fs";

export default function connectDatabase({
  emulate,
  host,
  ssl,
}: {
  emulate?: boolean;
  host?: string;
  ssl?: boolean;
} = {}) {
  const serviceAccountKey = JSON.parse(
    fs.readFileSync(`${process.cwd()}/service-account.json`, "utf8")
  );
  const project = serviceAccountKey.project_id;
  fbAdmin.initializeApp({
    credential: fbAdmin.credential.cert(serviceAccountKey),
    databaseURL: `https://${project}.firebaseio.com`,
    storageBucket: `${project}.appspot.com`,
  });

  const firestore = fbAdmin.firestore();

  if (emulate) {
    firestore.settings({
      host: host || "localhost:8080",
      ssl,
    });
  }

  return firestore;
}
