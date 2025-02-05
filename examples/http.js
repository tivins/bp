import { createServer } from "http";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import { extname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL("..", import.meta.url));



const server = createServer(async (req, res) => {
    const requestedFile = join(__dirname, req.url);

    const serveFile = async (f) => {
        const header = {};
        if (f.endsWith(".js")) {
            header["Content-Type"] = "application/javascript";
        }
        if (f.endsWith(".html")) {
            header["Content-Type"] = "text/html";
        }

        console.log(`${req.headers.host} | ${new Date().toISOString()} | 200 | ${f}`);
        res.writeHead(200, header);
        res.end(await readFile(f));
    }

    if (existsSync(requestedFile) && extname(requestedFile)) {
        await serveFile(requestedFile);
        return;
    }

    if (existsSync(requestedFile + ".js")) {
        await serveFile(requestedFile + '.js');
        return;
    }

    if (existsSync(requestedFile + "/index.html")) {
        await serveFile(requestedFile + "/index.html");
        return;
    }


    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
});

server.listen(8080, "127.0.0.1", () => {
    console.log("Server running at http://127.0.0.1:8080/");
});
