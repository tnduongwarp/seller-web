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
  constructor(@Inject(NZ_MODAL_DATA) public  dataInput: ModalData) {
    super();
    this.presentReceiver = dataInput.presentReceiver;
    this.receiver = dataInput.receiver
  }

  leaveChat(frq: any) {
  }

  override ngOnInit() {
    const userId = JSON.parse(localStorage.getItem('user')!)._id;
    this.api.get(`${Const.API_CHAT}/receivers/${userId}`).then(
      (res: any) => {
        console.log(res)
        this.listReceiver = res.data;
      }
    )
  }

  getReceiverName(user: any){
    if(user.isSeller) return user.shopName;
    return user.firstname + ' ' + user.lastname;
  }

  changeReceiver(receiver: any){
    this.receiver = receiver;
    this.presentReceiver = receiver.user
  }
}
