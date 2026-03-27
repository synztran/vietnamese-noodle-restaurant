import http from "http";

const BASE = "http://localhost:3002";

function request(path, method, body, cookie) {
	return new Promise((resolve) => {
		const payload = body ? JSON.stringify(body) : null;
		const headers = { "Content-Type": "application/json" };
		if (payload) headers["Content-Length"] = Buffer.byteLength(payload);
		if (cookie) headers["Cookie"] = cookie;

		const req = http.request(
			{
				hostname: "localhost",
				port: 3002,
				path,
				method,
				headers,
			},
			(res) => {
				let data = "";
				res.on("data", (c) => (data += c));
				res.on("end", () => {
					let json;
					try {
						json = JSON.parse(data);
					} catch {
						json = { raw: data.substring(0, 200) };
					}
					resolve({
						status: res.statusCode,
						body: json,
						headers: res.headers,
					});
				});
			},
		);
		req.on("error", (e) => resolve({ error: e.message }));
		req.setTimeout(10000, () => {
			req.destroy();
			resolve({ error: "timeout" });
		});
		if (payload) req.write(payload);
		req.end();
	});
}

async function main() {
	console.log("\n=== Step 1: Login as ngocmai ===");
	const login = await request("/api/auth/login", "POST", {
		username: "ngocmai",
		password: "123456",
	});
	console.log("Status:", login.status);
	console.log("Body:", JSON.stringify(login.body));

	if (login.status === 200) {
		const setCookie = login.headers["set-cookie"]?.[0];
		const token = setCookie?.match(/auth_token=([^;]+)/)?.[1];
		console.log("Got token:", !!token);

		if (token) {
			console.log("\n=== Step 2: Create owner account ===");
			const create = await request(
				"/api/users",
				"POST",
				{ userName: "ngocmai", passWord: "123456", role: "Admin" },
				`auth_token=${token}`,
			);
			console.log("Status:", create.status);
			console.log("Body:", JSON.stringify(create.body));
		}
	} else {
		console.log("\nLogin failed — cannot proceed to create user.");
		console.log(
			"Possible cause: MongoDB not connected or no seed account yet.",
		);

		console.log("\n=== Checking if MongoDB is reachable ===");
		const mongoCheck = await request("/api/users", "GET", null, null);
		console.log(
			"GET /api/users (no auth) status:",
			mongoCheck.status,
			"— expected 403 if server is healthy",
		);
	}
}

main();
