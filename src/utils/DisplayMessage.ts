import { MessageOptions, showMessage } from 'react-native-flash-message';

export const displayMessage = (params: MessageOptions) => {
    const { message, type, icon } = params;
    showMessage({
        message: message,
        type: type,
        icon: icon,
    });
};
