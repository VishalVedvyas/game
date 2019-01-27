import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:8000');

function fetchGameState(cb) {
    console.log('Initial table values recieved', socket);
    socket.on('setTableValues', (obj) => cb(obj.values, obj.isXNext));
    // socket.emit('subscribeToTimer', 1000);
}

function updateServerState(obj) {
    socket.emit('updateTableValues', obj);
}

function getGameRoomsStatus(role) {
    socket.emit('getGameRoomsStatus', role);
}

function registerGameOnServer(obj) {
    socket.emit('gameSetup', obj);
}

function leaveGameEvent(obj) {
    socket.emit('leaveGame', obj);
}

function endGameEvent(fun) {
    socket.on('endGame', (key) => fun(key));
}

function leaveRoom(prevGameKey) {
    socket.emit('leaveRoom', prevGameKey);
}

function setGameRoomsStatus(handle) {   //data received should contain array and role too!
    socket.on('setGameRoomsStatus', status => handle(status));
}

export { fetchGameState, updateServerState, getGameRoomsStatus, setGameRoomsStatus, registerGameOnServer, leaveGameEvent, endGameEvent, leaveRoom };