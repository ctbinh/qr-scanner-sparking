export const MAX_TIME_DISPLAY = 90;
export const TIME_DISPLAY_SUCCESS = 2;
export const TIME_DISPLAY_ERROR = 2;

export enum NotifType {
    LOADING,
    ERROR,
    SUCCESS,
}

export enum NotifMessage {
    LOADING = 'Vui lòng chờ trong giây lát',
    ERROR = 'Có lỗi xảy ra, vui lòng quét lại',
    SUCCESS = 'Thành công',
}
