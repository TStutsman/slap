import { Manager } from 'socket.io-client';
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:8000';
const manager = new Manager(URL, { autoConnect: false });

export const socket = manager.socket('/');
export const messageSocket = manager.socket('/messages');
export const channelSocket = manager.socket('/channels');