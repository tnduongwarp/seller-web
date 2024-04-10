import { Component, Inject, Input, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { BaseComponent } from 'src/app/base/base.component';
import { Const } from 'src/app/const/const';
export interface ModalData {
  presentReceiver: string;
  receiver: any
}
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  moduleId: module.id,
})
export class ChatComponent extends BaseComponent {
  public presentReceiver: string = ''
  public listReceiver: any = [];
  public receiver: any;
  public isLoading = true;
  constructor(@Inject(NZ_MODAL_DATA) public  dataInput: ModalData) {
    super();
    // this.presentReceiver = dataInput.presentReceiver;
    // this.receiver = dataInput.receiver
  }

  leaveChat(frq: any) {
  }

  override ngOnInit() {
    const userId = JSON.parse(localStorage.getItem('user')!)._id;
    this.isLoading = true;
    this.api.get(`${Const.API_CHAT}/receivers/${userId}`).then(
      (res: any) => {
        console.log(res)
        this.listReceiver = res.data;
        this.presentReceiver = res.data[0].user._id;
        this.receiver = res.data[0].user;
        this.isLoading = false;
      }
    )
  }

  getReceiverName(user: any){
    if(user.isSeller) return user.shopName;
    return user.firstname + ' ' + user.lastname;
  }

  changeReceiver(receiver: any){
    this.receiver = receiver.user;
    this.presentReceiver = receiver.user._id
  }
  isSelected(receiver: any){
    return receiver?._id.toString() == this.presentReceiver.toString()
  }
}
