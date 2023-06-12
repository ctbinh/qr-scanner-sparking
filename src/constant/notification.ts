export const MAX_TIME_DISPLAY = 20;
export const TIME_DISPLAY_SUCCESS = 3;
export const TIME_DISPLAY_ERROR = 3;

export enum NotifType {
    LOADING,
    FAILED,
    SUCCESS,
    RETRY,
    LICENSE_FAILED,
    QR_FAILED,
}

export enum NotifMessage {
    LOADING = 'Vui lòng chờ trong giây lát',
    FAILED = 'Có lỗi xảy ra, vui lòng quét lại',
    SUCCESS = 'Thành công',
    RETRY = 'Vui lòng điều chỉnh xe vào vị trí phù hợp',
    LICENSE_FAILED = 'Biển số xe không khớp',
    QR_FAILED = 'Quét QR thất bại, vui lòng thử lại',
}
