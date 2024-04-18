import { Component } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { Const } from '../const/const';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent extends BaseComponent{
  public order: any = [];
  public shop: any;
  public selectedTime: any;
  public search: string = '';
  public selectedClient: string = '';
  public listClients: any = [];
  public selectedStatus: string = '';
  public isLoading = true;
  public listOrder: any = [];
  public pageIndex: number = 1;
  public readonly pageSize: number = 9;
  public skip: number = 0;
  public total: number = 0;
  public statusList: any;
  constructor(private message: NzMessageService){
    super();
    this.shop = JSON.parse(localStorage.getItem('user')!);
    this.statusList = Object.values(Const.orderStatus);
  };

  override ngOnInit(): void {
    this.getData()
  }

  private getData(rangeTime?: any){
    this.isLoading = true;
    const condition: any = {};
    if(rangeTime && rangeTime.length == 2){
      condition['from'] = rangeTime[0];
      condition['to'] = rangeTime[1]
    }
    if(this.search) condition['search'] = this.search;
    if(this.selectedClient) condition['client'] = this.selectedClient;
    if(this.selectedStatus && this.selectedStatus !== 'all') condition['status'] = this.selectedStatus
    condition['skip'] = (this.pageIndex -1)*this.pageSize;
    condition['limit'] = this.pageSize;
    let qs = new URLSearchParams(condition).toString();
    this.api.get(`${Const.API_SELLER}/order/${this.shop?._id}?${qs}`).then(
      (res: any) => {
        this.isLoading = false;
        console.log(res);
        this.listClients = res.clients;
        this.listOrder = res.data;
        this.skip = res.skip;
        this.total = res.total
      }
    ).catch((err: any) => {
      this.isLoading = false;
      this.message.error(err.error.message)
    })
  }


  onDateRangeChange($event: any){
   this.pageIndex = 1;
   this.getData($event)
  }

  getClientName(id: string){
    const client = this.listClients.find((c: any) => c._id.toString() === id);
    if(client) return this.getUsername(client);
    else return 'N/A'
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

  getRouterLink(order: any){
    if(order?._id) return `/order/${order._id}`;
    return '';
  }

  onSearch(event: any){
    this.pageIndex = 1;
    this.getData(this.selectedTime);
  }
  onChangePage($event: any){
    this.pageIndex = $event;
    this.getData(this.selectedTime)
  }
}
