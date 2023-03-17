import { showMessage } from 'react-native-flash-message';

interface MessageProps {
    message: string;
    type: any;
    icon?: any;
}

export const displayMessage = (params: MessageProps) => {
    const { message, type, icon } = params;
    showMessage({
        message: message,
        type: type,
        icon: icon,
    });
};
