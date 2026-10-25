import Echo from 'laravel-echo';

import Pusher from 'pusher-js';
window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: 'yourgate',
    wsHost: '127.0.0.1',
    wsPort:'8080',
    wssPort: '8080',
    forceTLS: 'http',
    enabledTransports: ['ws'],
});