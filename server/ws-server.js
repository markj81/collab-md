/**
 * Y.js WebSocket Server
 * Run this separately or with concurrently to enable real-time collaboration
 */

const WebSocket = require('ws');
const http = require('http');
const Y = require('yjs');

const port = process.env.WS_PORT || 1234;
const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('Y.js WebSocket Server');
});

const wss = new WebSocket.Server({ server });

// Store for Y.js documents
const docs = new Map();

// Y.js WebSocket server utility functions
const messageSync = 0;
const messageAwareness = 1;

function getYDoc(docName, gc = true) {
  let doc = docs.get(docName);
  if (doc === undefined) {
    doc = new Y.Doc({ gc });
    doc.name = docName;
    docs.set(docName, doc);
  }
  return doc;
}

function setupWSConnection(conn, req, { docName = 'default' } = {}) {
  const doc = getYDoc(docName);
  conn.docName = docName;

  conn.on('message', (message) => {
    const encoder = new Y.encodeStateAsUpdate(doc);
    conn.send(encoder);

    // Handle awareness updates
    if (message[0] === messageAwareness) {
      // Broadcast awareness to all other connections
      wss.clients.forEach((client) => {
        if (client !== conn && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    }
  });

  conn.on('close', () => {
    // Clean up if needed
  });

  // Send initial state
  const encoder = new Y.encodeStateAsUpdate(doc);
  conn.send(encoder);
}

wss.on('connection', (conn, req) => {
  const docName = req.url.slice(1).split('?')[0] || 'default';
  setupWSConnection(conn, req, { docName });
});

server.listen(port, () => {
  console.log(`Y.js WebSocket server running on port ${port}`);
});