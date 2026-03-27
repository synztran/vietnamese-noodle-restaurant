import http from "http";

const PORTS = [3000, 3001, 3002, 3003];

async function testPort(port) {
	return new Promise((resolve) => {
		const req = http.request(
			{
				hostname: "localhost",
				port,
				path: "/api/users",
				method: "GET",
				headers: { "Content-Type": "application/json" },
			},
			(res) => {
				let data = "";
				res.on("data", (c) => (data += c));
				res.on("end", () =>
					resolve({ port, status: res.statusCode, ok: true }),
				);
			},
		);
		req.on("error", () => resolve({ port, ok: false }));
		req.setTimeout(2000, () => {
			req.destroy();
			resolve({ port, ok: false });
		});
		req.end();
	});
}

const results = await Promise.all(PORTS.map(testPort));
for (const r of results) {
	if (r.ok) console.log(`Port ${r.port}: HTTP ${r.status} ✓`);
}
