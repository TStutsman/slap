import { io } from 'socket.io-client';
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:8000';
// const manager = new Manager(URL, { autoConnect: false });

export const socket = io(URL);
export const messageSocket = io(URL + '/messages');
export const channelSocket = io(URL + '/channels');