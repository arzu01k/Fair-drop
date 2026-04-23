import type { Server as SocketIOServer } from "socket.io";
import { battleEngine } from "../services/battle/engine.js";

export const mountBattleNamespace = (io: SocketIOServer) => {
  const ns = io.of("/battle");

  ns.on("connection", socket => {
    // Send current snapshot so late-joining clients catch up.
    const snap = battleEngine.snapshot();
    socket.emit("snapshot", snap);

    socket.on("start", () => {
      battleEngine.start(ns);
    });

    socket.on("reset", () => {
      battleEngine.reset();
    });
  });
};
