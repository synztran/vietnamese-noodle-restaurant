import fs from "fs";

const envFile = fs.existsSync(".env.local")
	? fs.readFileSync(".env.local", "utf8")
	: "";

const vars = {};
for (const line of envFile.split("\n")) {
	const m = line.match(/^([^#=\s][^=]*)=(.*)$/);
	if (m) vars[m[1].trim()] = m[2].trim();
}

console.log("DATABASE_URL set:", !!vars["DATABASE_URL"]);
console.log("JWT_SECRET set:", !!vars["JWT_SECRET"]);
console.log(
	"MONGO_INIT_DB_ROOT_USERNAME set:",
	!!vars["MONGO_INIT_DB_ROOT_USERNAME"],
);
console.log(
	"MONGO_INIT_DB_ROOT_PASSWORD set:",
	!!vars["MONGO_INIT_DB_ROOT_PASSWORD"],
);
console.log("MONGO_INIT_DATABASE set:", !!vars["MONGO_INIT_DATABASE"]);
