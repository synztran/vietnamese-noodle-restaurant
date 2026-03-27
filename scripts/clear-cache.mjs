import { existsSync, rmSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const nextDir = join(root, ".next");

if (existsSync(nextDir)) {
	rmSync(nextDir, { recursive: true, force: true });
	console.log("Cleared .next cache");
} else {
	console.log(".next directory does not exist, nothing to clear");
}
