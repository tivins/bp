import {createServer} from "http";
import {readFile, writeFile} from "fs/promises";
import {existsSync} from "fs";
import {join} from "path";
import {fileURLToPath} from "url";

const __dirname = fileURLToPath(new URL("..", import.meta.url));


const server = createServer(async (req, res) => {

    if (req.method === "PUT") {
        const requestedFile = join(__dirname, req.url);
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            try {
                await writeFile(requestedFile, body);
                res.writeHead(201, { "Content-Type": "text/plain" });
                res.end("File created/updated successfully.");
            } catch (error) {
                console.error(error);
                res.writeHead(500, {"Content-Type": "text/plain"});
                res.end("Internal Server Error.");
            }
        });
    } else if (req.method === "GET") {
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

        /*
         * Send existing file
         */
        if (existsSync(requestedFile)) {
            await serveFile(requestedFile);
            return;
        }

        /*
         * Support module loading without extension
         */
        if (existsSync(requestedFile + ".js")) {
            await serveFile(requestedFile + '.js');
            return;
        }

        /*
         * Support index HTML
         */
        if (existsSync(requestedFile + "/index.html")) {
            await serveFile(requestedFile + "/index.html");
            return;
        }

        /*
         * 404
         */
        res.writeHead(404, {"Content-Type": "text/plain"});
        res.end("404 Not Found.");
    }
});

server.listen(8080, "127.0.0.1", () => {
    console.log("Server running at http://127.0.0.1:8080/");
});
