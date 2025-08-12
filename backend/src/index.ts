import { WebSocketServer, WebSocket } from 'ws';

export interface User {
  ws: WebSocket;
  room: string;
}

const wss = new WebSocketServer({ port: 8080 });

 export let allSockets: User[] = [];
export let alltokens: Array<number> = [] ;

wss.on('connection', function connection(ws) {

function createRoom(ws: WebSocket, token: number) {
  const tokenStr = token.toString();

  if (alltokens.includes(token)) {
    // Room already exists, cannot create again
    ws.send(JSON.stringify({
      type: "error",
      message: `Room ${tokenStr} already exists. Try joining it instead.`,
    }));
    return;
  }

  // Create new room
  alltokens.push(token);
  allSockets.push({ ws, room: tokenStr });

  ws.send(JSON.stringify({
    type: "roomCreated",
    roomId: tokenStr,
  }));

  console.log(`Room ${tokenStr} created`);
}

function joinRoom(ws: WebSocket, token: number) {
  const tokenStr = token.toString();

  if (!alltokens.includes(token)) {
    // Room does not exist, cannot join
    ws.send(JSON.stringify({
      type: "error",
      message: `Room ${tokenStr} does not exist. Try creating it first.`,
    }));
    return;
  }

  // Join existing room
  allSockets.push({ ws, room: tokenStr });

  ws.send(JSON.stringify({
    type: "roomJoined",
    roomId: tokenStr,
  }));

  console.log(`Joined existing room ${tokenStr}`);
}

  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg.toString());
      let token = data.token;
      if (typeof token === "string") token = Number(token);
      if (data.type === "createRoom" && typeof token === "number" && !isNaN(token)) {
        createRoom(ws, token);
      } else if (data.type === "joinRoom" && typeof token === "number" && !isNaN(token)) {
        joinRoom(ws, token);
      } else if (data.type === "chat" && typeof token === "number" && !isNaN(token) && typeof data.message === "string") {
        // Broadcast to all users in the same room
        allSockets
          .filter(user => user.room === token.toString())
          .forEach(user => {
            user.ws.send(JSON.stringify({ message: data.message }));
          });
      } else {
        ws.send(JSON.stringify({
          type: "error",
          message: "Invalid message type or missing token."
        }));
      }
    } catch (err) {
      ws.send(JSON.stringify({
        type: "error",
        message: "Malformed message."
      }));
    }
  });

  ws.on("close", () => {
    allSockets = allSockets.filter(user => user.ws !== ws);
  });
});


