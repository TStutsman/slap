import { io } from 'socket.io-client';
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:8000';
export const socket = io(URL, { autoConnect: false });
export const messageSocket = io(URL + '/messages', { autoConnect: false });
export const channelSocket = io(URL + '/channels', { autoConnect: false });