export const MAX_TIME_DISPLAY = 90;
export const TIME_DISPLAY_SUCCESS = 3;
export const TIME_DISPLAY_ERROR = 3;

export enum NotifType {
    LOADING,
    ERROR,
    SUCCESS,
    FIX,
}

export enum NotifMessage {
    LOADING = 'Vui lòng chờ trong giây lát',
    ERROR = 'Có lỗi xảy ra, vui lòng quét lại',
    SUCCESS = 'Thành công',
    FIX = 'Vui lòng di chuyển xe của bạn đến đúng vị trí để máy có thể lấy được biển',
}
