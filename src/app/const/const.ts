export class Const {
  static ORIGIN = 'http://localhost:3000';
  public static readonly API_SEND_OTP = `${this.ORIGIN}/forgot-pw/send_recovery_email`;
  public static readonly API_CHANGE_PW = `${this.ORIGIN}/forgot-pw/change-pw`;
  public static readonly API_GET_LIST_CATEGORY = `${this.ORIGIN}/category/`;
  public static readonly API_GET_LIST_PRODUCT = `${this.ORIGIN}/product`;
  public static readonly API_CART_URL = `${this.ORIGIN}/cart`;
  public static readonly API_USER = `${this.ORIGIN}/user`;
  public static readonly API_ORDER = `${this.ORIGIN}/order`;
  public static readonly API_CHAT = `${this.ORIGIN}/chat`;
  public static readonly API_SELLER = `${this.ORIGIN}/seller`;
  public static readonly API_SAVE_IMAGE = `${this.ORIGIN}/upload_image`;

  public static readonly orderStatus = {
    CREATED: 'created',
    PAID: 'paid',
    IN_TRANSIT: 'inTransit',
    GETTED: 'getted',
    NEED_REVIEW: 'needReview',
    COMPLETED: 'completed'
  }
  public static readonly orderStatusText = {
    CREATED: 'Đã tạo',
    PAID: 'Đã thanh toán',
    IN_TRANSIT: 'Đang vận chuyển',
    GETTED: 'Đã nhận hàng',
    NEED_REVIEW: 'Chờ đánh giá',
    COMPLETED: 'Hoàn thành'
  }
}
