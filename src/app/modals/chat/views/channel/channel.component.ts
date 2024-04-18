import { Component, ElementRef, Input, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { BaseComponent } from 'src/app/base/base.component';
import { Const } from 'src/app/const/const';
import io from 'socket.io-client';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
  moduleId: module.id,
})
export class ChannelComponent extends BaseComponent {
  @ViewChild('scrollframe', {static: false}) scrollFrame!: ElementRef;

  @Input() receiver: string = ''
  @Input() receiverDetail: any;
  currentMsg = '';
  public owner: any = '';
  public msgList: any;
  public socket: any;
  constructor(
      private activatedRoute: ActivatedRoute,
  ) {
    super();
    this.owner = JSON.parse(localStorage.getItem('user')!)._id;
    this.socket = io('http://localhost:3000')
  }

  send() {
    if (this.currentMsg.length) {
      this.socket.emit('send_message', { message: this.currentMsg, owner: this.owner, receiver: this.receiver });
      this.currentMsg = "";
    }
  }

  override ngOnChanges() {
    const body = {
      owner: this.owner,
      receiver: this.receiver
    }
    this.socket.emit('fetch-message',body)
    this.socket.on('messages', (messages: any) => {
      this.msgList = JSON.parse(messages);
      setTimeout(() => {
        this.scrollToBottom()
      },2)
    });
    this.socket.on('receive_message', (data: any) => {
      if((data.receiver.toString() === this.receiver.toString() && data.owner.toString() === this.owner.toString()) || (data.receiver.toString() === this.owner.toString() && data.owner.toString() === this.receiver.toString())){
        let exist = this.msgList.filter((it: any) => it._id.toString() === data._id.toString());
        if(!exist.length){
          this.msgList.push(data);
          setTimeout(() => {
            this.scrollToBottom()
          },2)
        }
      }
    })
  }


  private scrollToBottom(): void {
    this.scrollFrame.nativeElement.scroll({
      top: this.scrollFrame.nativeElement.scrollHeight+ 50,
      left: 0,
      behavior: 'smooth'
    });
  }

  getReceiverName(user: any){
    if(user.isSeller) return user.shopName;
    if(user?.name) return user.name;
    if(user?.firstname && user?.lastname) return user?.firstname + ' ' + user?.lastname;


  }
  override ngOnDestroy(){
    this.socket.disconnect();
  }
}
