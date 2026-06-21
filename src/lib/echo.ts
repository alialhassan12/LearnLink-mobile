import Echo from 'laravel-echo';
const Pusher = require('pusher-js/react-native').Pusher;
import axiosInstance from './axios';

// Declare Pusher globally for laravel-echo
(global as any).Pusher = Pusher;

// Parse the WebSocket host IP address from EXPO_PUBLIC_API_URL
const getWsHost = () => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL || '';
    const match = apiUrl.match(/https?:\/\/([^:/]+)/);
    return match ? match[1] : '127.0.0.1';
};

const echo = new Echo({
    broadcaster: 'reverb',
    key: process.env.EXPO_PUBLIC_REVERB_APP_KEY,
    wsHost: getWsHost(),
    wsPort: Number(process.env.EXPO_PUBLIC_REVERB_PORT),
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
    authorizer: (channel: any, options: any) => {
        return {
            authorize: (socketId: string, callback: Function) => {
                axiosInstance.post('/broadcasting/auth', {
                    socket_id: socketId,
                    channel_name: channel.name
                })
                .then(response => {
                    callback(false, response.data);
                })
                .catch(error => {
                    console.error("Broadcasting auth error:", error);
                    callback(true, error);
                });
            }
        };
    },
});

export default echo;
