import io from 'socket.io-client';

let socket;

if (
  typeof window !== 'undefined' &&
  ('WebSocket' in window || 'MozWebSocket' in window)
  ) {
  socket = io.connect('http://freecodecamp.duckdns.org');
} else {
  socket = false;
}

export default socket;
