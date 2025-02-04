import { createServer } from "http";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import { extname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL("..", import.meta.url));

const server = createServer(async (req, res) => {
    const requestedFile = join(__dirname, req.url);

    if (existsSync(requestedFile) && extname(requestedFile)) {
        const header = {};
        if (requestedFile.endsWith(".js")) {
            header["Content-Type"] = "application/javascript";
        }
        res.writeHead(200, header);
        res.end(await readFile(requestedFile));
        return;
    }

    if (existsSync(requestedFile + ".js")) {
        res.writeHead(200, { "Content-Type": "application/javascript" });
        res.end(await readFile(requestedFile + ".js"));
        return;
    }

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
});

server.listen(8080, "127.0.0.1", () => {
    console.log("Server running at http://127.0.0.1:8080/");
});
