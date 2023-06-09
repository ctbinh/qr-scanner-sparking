import { Client } from '@stomp/stompjs';
// import { SOCKET_URL } from '@env';
import { IDataSocket } from '../interfaces/socket';

class Stompjs {
    private stompClient: Client;

    constructor(destination: string, callback: (data: IDataSocket) => void) {
        const stompClient = new Client({
            brokerURL: `wss://sparking.ngrok.app/mrc/scanner`,
            // debug: function (str) {
            //     console.log('STOMP: ' + str);
            // },
            reconnectDelay: 500,
            onConnect: function () {
                console.log('connected');
                stompClient.subscribe('/room/mock', async function (message) {
                    const data: IDataSocket = JSON.parse(message.body);
                    callback(data);
                });
            },
            onStompError: (frame) => {
                console.log('Additional details: ' + frame.body);
            },
            forceBinaryWSFrames: true,
            appendMissingNULLonIncoming: true,
        });
        this.stompClient = stompClient;
        this.connectSocket();
    }

    connectSocket() {
        this.stompClient.activate();
    }

    disconectSocket() {
        this.stompClient.deactivate();
    }

    publishQrMessage(qrToken: string) {
        if (!this.stompClient.connected) {
            return false;
        }
        if (qrToken.length > 0) {
            const payLoad = {
                status: 'init',
                qrToken: qrToken,
            };

            // You can additionally pass headers
            this.stompClient.publish({ destination: '/mrc/message/qr-scan', body: JSON.stringify(payLoad) });
        }
        return true;
    }

    publishLicensePlateMessage(data: IDataSocket) {
        // trying to publish a message when the broker is not connected will throw an exception
        if (!this.stompClient.connected) {
            return false;
        }

        // scan to get license-plate then input below

        const payLoad = {
            status: 'submit',
            qrToken: data.qrToken,
            licensePlate: data.licensePlate,
        };

        // You can additionally pass headers
        this.stompClient.publish({ destination: '/mrc/message/license-plate', body: JSON.stringify(payLoad) });

        return true;
    }

    publishLicensePlateMessageError(data: IDataSocket) {
        // trying to publish a message when the broker is not connected will throw an exception
        if (!this.stompClient.connected) {
            return false;
        }

        // scan to get license-plate then input below

        const payLoad = {
            status: 'license-error',
            qrToken: data.qrToken,
            licensePlate: data.licensePlate,
        };

        // You can additionally pass headers
        this.stompClient.publish({ destination: '/mrc/message/license-plate', body: JSON.stringify(payLoad) });

        return true;
    }

    publishLicensePlateMessageErrorQr(data: IDataSocket) {
        // trying to publish a message when the broker is not connected will throw an exception
        if (!this.stompClient.connected) {
            return false;
        }

        // scan to get license-plate then input below

        const payLoad = {
            status: 'qr-error',
            qrToken: data.qrToken,
            licensePlate: data.licensePlate,
        };

        // You can additionally pass headers
        this.stompClient.publish({ destination: '/mrc/message/license-plate', body: JSON.stringify(payLoad) });

        return true;
    }
}

export default Stompjs;
