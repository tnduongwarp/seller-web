import { Component, Inject } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalService } from 'ng-zorro-antd/modal';
import { BaseComponent } from 'src/app/base/base.component';
import { Const } from 'src/app/const/const';

@Component({
  selector: 'app-change-status',
  templateUrl: './change-status.component.html',
  styleUrls: ['./change-status.component.scss']
})
export class ChangeStatusComponent extends BaseComponent{
  public statusHistory: any;
  public orderStatus: any = [];
  public selectedStatus: string = '';
  public orderId: string = '';
  public refreshData: any;
  constructor(@Inject(NZ_MODAL_DATA) public  dataInput: any, private modalService: NzModalService, private message: NzMessageService){
    super();
    this.statusHistory = dataInput.statusHistory;
    this.orderId = dataInput.orderId;
    this.orderStatus = Object.values(Const.orderStatus).filter((it: string) => (it !== Const.orderStatus.COMPLETED));
    this.selectedStatus = this.statusHistory[this.statusHistory.length - 1].status;
    this.refreshData = dataInput.refreshData;
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

  checkDisable(status: string){

  }
  handleCancel(){
    this.modalService.closeAll();
  }
  handleOk(){
    console.log(this.selectedStatus);
    this.api.post(`${Const.API_SELLER}/order/status/${this.orderId}`, {status: this.selectedStatus}).then(
      res => {
        this.modalService.closeAll();
        this.message.success('Thay đổi trạng thái thành công');
        this.refreshData()
      }
    ).catch(err => this.message.error(err.message))
  }
}
