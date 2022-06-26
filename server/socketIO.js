import { Server } from "socket.io";

let io;

export function init(server) {
    io = new Server(server);
    return io;
}

export function getIO() {
    if (!io) {
        throw new Error("Error in getting io instance before calling .init()");
    }
    return io;
}