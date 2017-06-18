import io from 'socket.io-client';

const socket = io.connect('http://freecodecamp.duckdns.org');

export default socket;
