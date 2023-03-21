import { Client } from '@stomp/stompjs';

const stompClient = new Client({
    brokerURL: 'wss://a07b-42-112-152-17.ap.ngrok.io/mrc/scanner',
    debug: function (str) {
        console.log('STOMP: ' + str);
    },
    reconnectDelay: 500,
    onConnect: function () {
        console.log('connected');
        stompClient.subscribe('/room/mock', function (message) {
            console.log(JSON.parse(message.body));
        });
    },
    onStompError: (frame) => {
        console.log('Additional details: ' + frame.body);
    },
    forceBinaryWSFrames: true,
    appendMissingNULLonIncoming: true,
});

export const connectSocket = () => {
    stompClient.activate();
};

export const sendMessage = (message: string) => {
    stompClient.publish({ destination: '/mrc/message/qr-scan', body: JSON.stringify({ message: message }) });
};
