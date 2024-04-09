import { Component, Inject } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd/message";
import { NZ_MODAL_DATA, NzModalService } from "ng-zorro-antd/modal";
import { BaseComponent } from "src/app/base/base.component";
import { Const } from "src/app/const/const";

export interface ModalData{
  productId: string[],
  owner: string,
  orderId: string,
  onOk: any
}

@Component({
  selector: 'review-modal',
  templateUrl: './index.html',
  styleUrls: ['./index.scss'],
})

export class ReviewModal extends BaseComponent{
  public value: any = 0;
  public react: string = '';
  tooltips = ['Tệ', 'Không hài lòng', 'Bình thường', 'Hài lòng', 'Tuyệt vời'];
  constructor(private modelService : NzModalService, private messageService: NzMessageService, @Inject(NZ_MODAL_DATA) public  dataInput: ModalData){
    super()
  }

  handleCancel(){
    this.modelService.closeAll()
  }

  handleOk(){
    const body = {
      owner: this.dataInput.owner,
      productIds: this.dataInput.productId,
      description: this.react,
      rating: this.value,
      orderId: this.dataInput.orderId
    }
    this.api.post(`${Const.API_GET_LIST_PRODUCT}/add-review`,body)
    .then(
      res => {
        this.messageService.success('Thành công');
        this.dataInput.onOk();
      }
    ).catch((err: any) => {
      this.messageService.error(err.message);
    })
  }
}
