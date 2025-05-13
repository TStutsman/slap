import { io } from 'socket.io-client';
const URL = process.env.NODE_ENV === 'production' ? window.location.host : 'http://localhost:8000';

export const messageSocket = io(URL + '/messages', {
    autoConnect: false
});
export const channelSocket = io(URL + '/channels', {
    autoConnect: false
});