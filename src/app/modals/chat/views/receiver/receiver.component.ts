import { Component, Input } from '@angular/core';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-receiver',
  templateUrl: './receiver.component.html',
  styleUrls: ['./receiver.component.scss']
})
export class ReceiverComponent {
  @Input() receiver: any;
  public socket: any;
  public owner: any = '';
  public latestMsg: any

  constructor(){

  }
  ngOnInit(){
    if(this.receiver) this.latestMsg = this.receiver?.firstMsg[0];
    console.log(this.receiver);
    this.owner = JSON.parse(localStorage.getItem('user')!)._id;
    this.socket = io('http://localhost:3000');
    this.socket.on('receive_message', (data: any) => {
      if((data.receiver.toString() === this.receiver?.user?._id?.toString() && data.owner.toString() === this.owner.toString()) || (data.receiver.toString() === this.owner.toString() && data.owner.toString() === this.receiver?.user?._id?.toString())){
        this.latestMsg = data;
      }
    })
  }
  getReceiverName(user: any){
    if(user.isSeller) return user.shopName;
    return user?.name || user?.firstname + ' ' + user?.lastname ;
  }

  ngOnDestroy(){
    this.socket.disconnect();
    // this.socket.off()
  }
}
