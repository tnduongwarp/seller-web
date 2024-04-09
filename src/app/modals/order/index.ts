import { Component, Inject, Input } from '@angular/core';
import { BaseComponent } from '../../base/base.component';
import { Router } from '@angular/router';
import { Const } from '../../const/const';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
export interface ModalData {
  cartItems: string;
  refreshCart: any
}
@Component({
  selector: 'order',
  templateUrl: './index.html',
  styleUrls: ['./index.scss'],
})

export class Order extends BaseComponent {
  public cartItems: any = []
  btnDisabled = false;
  handler: any;
  public orderAddress: string;
  public address: string[];
  public paymentType = 1;
  public refreshCartItem: any;
  public orderItems: any = [];
  constructor(private router: Router,private message: NzMessageService ,@Inject(NZ_MODAL_DATA) public  dataInput: ModalData) {
    super();
    this.orderAddress = JSON.parse(localStorage.getItem('user')!)?.metadata?.defaultAddress || JSON.parse(localStorage.getItem('user')!)?.address[0];
    this.address = JSON.parse(localStorage.getItem('user')!)?.address;
  }

  trackByCartItems(index: number, item: any) {
    return item._id;
  }


  get cartTotal() {
    let total = 0;
    this.cartItems.forEach((data: any, index: any) => {
      total += data.product.price * data.quantity;
    });
    return total + 20000*this.orderItems.length;
  }

  public countTotalPriceOrder(items: any){
    let total = 0;
    items.forEach((data: any, index: any) => {
      total += data.product.price * data.quantity;
    });
    return total + 20000;
  }
  override ngOnInit() {
    console.log("modal", this.dataInput)
    let userId = JSON.parse(localStorage.getItem('user')!)._id;
    if(!userId) this.cartItems = [];
    else this.cartItems = this.dataInput.cartItems;
    this.groupOrderItem()
    this.refreshCartItem = this.dataInput.refreshCart;
  }

  public groupOrderItem(){
    let owners: any = [];
    for(let item of this.cartItems){
      if(!owners.includes(item.product.owner._id)) owners.push(item.product.owner._id)
    }
    for(let shop of owners){
      let items: any = [];
      for(let item of this.cartItems){
        if(item.product.owner._id === shop) items.push(item);
      }
      this.orderItems.push({ seller: items[0].product.owner, items: items})
    }
  }

  checkout() {
    if(this.paymentType === 1){
      let promises1: any = [];
      for(let order of this.orderItems){
        let body: any = {};
        body['owner'] = JSON.parse(localStorage.getItem('user')!)._id;
        body['address'] = this.orderAddress;
        body['totalPrice'] = this.countTotalPriceOrder(order.items);
        body['products'] = order.items.map((item: any) => {
          return {
            productId: item.product._id,
            quantity: item.quantity
          }
        });
        body['paymentType'] = this.paymentType;
        promises1.push(this.api.post(Const.API_ORDER, body))
      }
      Promise.all(promises1)
      .then(datas => {
        const removeItemBody = {
          userId: JSON.parse(localStorage.getItem('user')!)._id,
          productIds: this.cartItems.map((item: any) => item.product._id)
        }
        this.api.post(Const.API_CART_URL+'/remove-item', removeItemBody).then(
          (res: any) => {
            this.message.success('Đặt hàng thành công, vui lòng kiểm tra đơn hàng trong mục đơn hàng.');
            this.refreshCartItem();

          }
        )
      })
      .catch(err => console.log(err))
    }
  }
}
