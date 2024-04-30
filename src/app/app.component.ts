import { Component } from '@angular/core';
import { BaseComponent } from './base/base.component';
import { Router } from '@angular/router';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ChatComponent } from './modals/chat/views/chat/chat.component';
import { TimeagoIntl } from 'ngx-timeago';
import { strings as vnStrings } from "ngx-timeago/language-strings/vi";
import { io } from 'socket.io-client';
import { Const } from './const/const';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseComponent{
  isCollapsed = false;
  public titleComponent: string = '';
  private socket: any;
  public messageModal: any;
  public get authUser(){
    return JSON.parse(localStorage.getItem('user')!)
  };
  constructor(private router: Router,private modalService: NzModalService,intl: TimeagoIntl, private message: NzNotificationService){
    super();
    intl.strings = vnStrings;
    intl.changes.next();
    this.socket = io('http://localhost:3000');
    this.socket.on('receive_message', (data: any) => {
      if(data.receiver.toString() === this.authUser?._id?.toString() && !this.messageModal){
        this.api.get(`${Const.API_USER}/${data.owner}`).then(
          (data: any) => {
            const user= data.data
            this.message.info('Tin nhắn mới',`Bạn có tin nhắn mới từ ${user?.name || user?.firstname + ' ' + user?.lastname}`, {
              nzDuration: 1500
            })
          }
        )
      }
    })
    let url = window.location.pathname;
    for(let item of this.sidebar){
      if(item.children && item.children.length){
        for(let child of item.children){
          if(child.link === url) {
            this.titleComponent = child.name;
            return;
          }
        }
      }else{
        if(item.link === url){
          this.titleComponent = item.name;
          return;
        }
      }
    }
  }

  public get title(){
    if(this.authUser?.role === 'seller') return 'Seller';
    if(this.authUser?.role === 'admin') return 'Admin';
    return '';
  }

  public sidebar = [
    {
      name: 'Quản lí cửa hàng',
      icon: 'shop',
      link:'',
      requireRole:['seller'],
      children: [
        {
          name: 'Quản lí sản phẩm',
          link: '/product',

        },
        {
          name: 'Quản lí đơn hàng',
          link: '/order'
        },
        {
          name: 'Thống kê doanh số',
          link: '/revenue'
        },
        {
          name: 'Đăng kí quảng cáo',
          link: '/advertise'
        },
      ]
    },
    {
      name: 'Hồ sơ',
      icon: 'user',
      link: '/profile',
      requireRole:['seller','admin']
    },
    {
      name: 'Quản lí tài khoản',
      icon: 'team',
      link: '/user',
      requireRole:['admin']
    },
    {
      name: 'Thống kê',
      icon: 'stock',
      link: '/statitics',
      requireRole:['admin']
    },
    {
      name: 'Quản lí sản phẩm',
      icon: 'shopping',
      link: '/admin/product',
      requireRole:['admin']
    }
  ];
  logOut(){
    let bodyLogout = {
      refreshToken: localStorage.getItem('refreshToken')
    }
    this.api.post(this.apiUrl(this.authApiUrl)+'logout',bodyLogout)
    .then((res: any) => {
      if(!res.error){
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    })
    .catch(err => console.log(err))
  }

  public setTitleComponent(name: string){
    this.titleComponent = name;
  }

  public deleteMessageModal(){
    this.messageModal = null;
  }

  public openChat(){
    if(this.messageModal) return;
    this.messageModal = this.modalService.create({
      nzTitle: 'Chat',
      nzFooter: null,
      nzMask: false,
      nzWidth: 850,
      nzBodyStyle:{
        padding: '0',
      },
      nzOnCancel:() => this.deleteMessageModal() ,
      nzContent: ChatComponent,
    })
  }

  hasRequireRole(item: any){
    return item?.requireRole?.includes(this.authUser?.role)
  }

}
