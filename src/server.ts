import express, { Application } from "express";
import socketIO, { Server as SocketIOServer } from "socket.io";
import { createServer, Server as HTTPServer } from "http";
import path from "path";

export class Server {
    private httpServer: HTTPServer;
    private app: Application;
    private io: SocketIOServer;

    private activeSockets: string[] = [];

    private readonly DEFAULT_PORT = 8080;

    constructor() {
        this.initialize();
    }

    private initialize(): void {
        this.app = express();
        this.httpServer = createServer(this.app);
        this.io = socketIO(this.httpServer);

        this.configureApp();
        this.configureRoutes();
        this.handleSocketConnection();
    }

    private configureApp(): void {
        this.app.use(express.static(path.join(__dirname, "../client")));
    }

    private configureRoutes(): void {
        this.app.get("/", (req, res) => {
            res.sendFile("index.html");
        });
    }

    private handleSocketConnection(): void {
        console.log("Handling socket connection");
        this.io.on("connection", socket => {
            const existingSocket = this.activeSockets.find(
                existingSocket => existingSocket === socket.id
            );
            console.log(`Socket connected. ${this.activeSockets}`);
            //console.log(activeSockets);
            if (!existingSocket) {
                this.activeSockets.push(socket.id);
                socket.emit("update-user-list", {
                    users: this.activeSockets.filter(
                        existingSocket => existingSocket !== socket.id
                    )
                });

                socket.broadcast.emit("update-user-list", {
                    users: [socket.id]
                });
            }

            socket.on("call-user", (data: any) => {
                socket.to(data.to).emit("call-made", {
                    offer: data.offer,
                    socket: socket.id
                });
                console.log("Call made...");
            });

            socket.on("make-answer", data => {
                socket.to(data.to).emit("answer-made", {
                    socket: socket.id,
                    answer: data.answer
                });
                console.log("Answer made...");
            });

            socket.on("reject-call", data => {
                socket.to(data.from).emit("call-rejected", {
                    socket: socket.id
                });
                console.log("Call rejected...");
            });

            socket.on("disconnect", () => {
                this.activeSockets = this.activeSockets.filter(
                    existingSocket => existingSocket !== socket.id
                );
                socket.broadcast.emit("remove-user", {
                    socketId: socket.id
                });
                console.log("Disconnect and remove user...");
            });
        });
    }

    public listen(callback: (port: number) => void): void {
        this.httpServer.listen(this.DEFAULT_PORT, () => {
            callback(this.DEFAULT_PORT);
        });
    }
}