import { Component } from '@angular/core';
import { BaseComponent } from '../../base/base.component';
import { Const } from '../../const/const';
import { ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ChangeStatusComponent } from '../../modals/change-status/change-status.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ChatComponent } from '../../modals/chat/views/chat/chat.component';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent extends BaseComponent{
  public isLoading: boolean = false;
  public orderId: any;
  public order: any;
  public transitStatus: string = '';

  constructor(private activatedRoute: ActivatedRoute, private modalService: NzModalService, private message: NzMessageService){
    super()
  }
  override ngOnInit(): void {
    this.orderId = this.activatedRoute.snapshot.params['id'];
    this.getData()
  }

  private getData(){
      if (!this.orderId) {
        return
      }
      try {
        this.isLoading = true;
        this.api.get(`${Const.API_ORDER}/${this.orderId}`)
        .then((res: any) => {
          this.isLoading = false;
          this.order = res.data;
          console.log(this.order);
        })
        .catch(err => {
          this.isLoading = false;
          console.log(err)
        })

      }catch (error: any) {
        console.log(error)
      }
  }

  onEditStatus(){
    if(this.order.status === Const.orderStatus.COMPLETED) return;
    this.modalService.create({
      nzTitle:'Chỉnh sửa trạng thái đơn hàng',
      nzContent: ChangeStatusComponent,
      nzData:{
        statusHistory: this.order.statusHistory,
        orderId: this.order._id,
        refreshData: () => this.getData()
      }
    })
  }

  getStatusText(status: string){
    switch(status){
      case Const.orderStatus.CREATED: return Const.orderStatusText.CREATED;
      case Const.orderStatus.PAID: return Const.orderStatusText.PAID;
      case Const.orderStatus.IN_TRANSIT: return Const.orderStatusText.IN_TRANSIT;
      case Const.orderStatus.GETTED: return Const.orderStatusText.GETTED;
      case Const.orderStatus.NEED_REVIEW: return Const.orderStatusText.NEED_REVIEW;
      case Const.orderStatus.COMPLETED: return Const.orderStatusText.COMPLETED;
    }
  }

  updateOrder(){
    this.api.post(`${Const.API_SELLER}/order/transitStatus/${this.orderId}`, {status: this.transitStatus}).then(
      (res: any) => {
        this.order = res.data;
        this.transitStatus = ''
        this.message.success('Thêm trạng thái thành công');
      }
    ).catch(err => this.message.error(err.message))
  }

  getPaymentTypeText(paymentType: number){
    if(paymentType == 1) return 'Thanh toán bằng tiền mặt';
    if(paymentType == 2) return 'Đã thanh toán qua Paypal';
    return 'N/A'
  }

  public chatWithUser(user: any){
    let userId = JSON.parse(localStorage.getItem('user')!)._id;
    this.api.post(`${Const.API_CHAT}/add_receiver/${userId}`, {receiver: user._id})
    .then((res: any) => {
      this.modalService.create({
        nzTitle: 'Chat',
        nzFooter: null,
        nzMask: false,
        nzWidth: 850,
        nzBodyStyle:{
          padding: '0',
        },
        nzContent: ChatComponent,
        nzData: {
          presentReceiver: user._id,
        },
      })
    })
    .catch(err => console.log(err))
  }
}
