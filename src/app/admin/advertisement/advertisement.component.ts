import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BaseComponent } from 'src/app/base/base.component';
import { Const } from 'src/app/const/const';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.component.html',
  styleUrls: ['./advertisement.component.scss']
})
export class AdvertisementComponent extends BaseComponent{

  public fromDate: any;
  public toDate: any;
  public listBid: any = [];
  public isLoading: boolean = true;
  public expandSet = new Set<number>();
  public countWeek: number = 0;
  private socket: any;
  constructor(private message: NzMessageService){
    super();
    this.socket = io('http://localhost:3000');
  }
  override ngOnInit(): void {
    this.setDate(0);
    this.getData();
  }

  getData(){
    this.isLoading = true;
    this.api.post(`${Const.API_SELLER}/bids`,{from: this.fromDate, to: this.toDate}).then(
      (res: any) => {
        this.buildData(res.data);
       this.isLoading = false;
       console.log(this.listBid)
      }
    ).catch(err => {
      this.isLoading = false;
      console.log(err)
    })
  }

  setDate(x: number){
    const date1 = x == 0 ? new Date() : new Date(this.fromDate);
    const date2 = x == 0 ? new Date() : new Date(this.toDate);
    if(x == -1 || x == 1){
      date2.setDate(date2.getDate() + 7*x)
      date1.setDate(date1.getDate() + 7*x);
      this.fromDate = date1;
      this.toDate = date2;
      return;
    }
    //from date
    let day1 = date1.getDay();
    date1.setDate(date1.getDate()+this.countPlusDate(day1));
    date1.setHours(0);
    date1.setMinutes(0);
    date1.setSeconds(0);
    date1.setMilliseconds(0);
    this.fromDate = date1;
    // to date
    date2.setDate(date1.getDate()+ 7);
    date2.setHours(23);
    date2.setMinutes(59);
    date2.setSeconds(59);
    this.toDate = date2;
    console.log(this.fromDate);
    console.log(this.toDate)
  }

  countPlusDate(day: number){
    if(!day) return 1;
    else return 8-day;
  }
  handleButton(x: number){
    if(x == -1) this.countWeek -=1
    else this.countWeek += 1;
    this.setDate(x);
    this.getData();
  }
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  buildData(data: any){
    this.listBid = [];
    data.forEach((element: any) => {
      let obj = {
        id: element._id,
        shopName: element?.owner?.shopName || '',
        price: element.price,
        expand: false,
        products: element.products.map((it: any) => {
          return {
            title: it.product.title,
            image: it.image
          }
        }),
        status: element.status,
        created: element.created
      }
      this.listBid.push(obj)
    });
  }
  getResultBid(item: any){
    let status = item.status;
    if(status === 'accepted') return 'Thành công';
    let dateCreated = new Date(item.created);
    let cloneFromDate = new Date();
    let day1 = cloneFromDate.getDay();
    cloneFromDate.setDate(cloneFromDate.getDate()+this.countPlusDate(day1));
    cloneFromDate.setHours(0);
    cloneFromDate.setMinutes(0);
    cloneFromDate.setSeconds(0);
    cloneFromDate.setMilliseconds(0);
    cloneFromDate.setDate(cloneFromDate.getDate() - 7);
    if(dateCreated.getTime() > cloneFromDate.getTime()){
       return 'Đang chờ kết quả';
    }else{
      return 'Thất bại'
    };

  };
  acceptedBid(id: string){
    this.api.post(`${Const.API_SELLER}/update_bid/${id}`, {status: 'accepted'})
    .then(res => {
      this.message.success('Thành công');
      this.setDate(0)
      this.socket.emit('update_bid', {from: this.fromDate, to: this.toDate});
      this.getData();
    })
    .catch(err => this.message.error('Đã có lỗi xảy ra, hãy thử lại sau'))
  }
}
