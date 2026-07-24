import dotenv from "dotenv";
import path from "path";
import { execSync } from "child_process";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

if (process.env.DATABASE_URL_TEST) {
  process.env.DATABASE_URL = process.env.DATABASE_URL_TEST;
}

execSync("npx prisma migrate deploy", {
  env: { ...process.env },
  stdio: "ignore",
});
