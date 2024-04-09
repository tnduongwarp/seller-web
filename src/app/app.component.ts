import { Component } from '@angular/core';
import { BaseComponent } from './base/base.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseComponent{
  isCollapsed = false;
  public titleComponent: string = '';
  public get authUser(){
    return JSON.parse(localStorage.getItem('user')!)
  };
  constructor(private router: Router){
    super();
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
      children: [
        {
          name: 'Quản lí sản phẩm',
          link: '/product'
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
      link: '/profile'
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
}
