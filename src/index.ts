import { Server } from "./server";

const server = new Server();

server.listen(port => {
    console.log(`Server is listening on http://192.168.83.1:${port}`);
});
