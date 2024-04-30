import { Component } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Const } from '../const/const';
import { CreateProductModal } from '../modals/create-product/create-product.component';

@Component({
  selector: 'app-confirm-product',
  templateUrl: './confirm-product.component.html',
  styleUrls: ['./confirm-product.component.scss']
})
export class ConfirmProductComponent extends BaseComponent{
  public listData: any = [];
  searchValue: string = '';
  listOfDisplayData: any = [];
  amountSort: any = null;
  soldSort: any = null;
  createdSort: any = null;
  isLoading: boolean = false;
  createProductModalInstance: any = null;
  productType = '0';
  constructor(private modalService: NzModalService){
    super();
  }

  override ngOnInit(): void {
    this.getData();
  }
  getData() {
    if(this.createProductModalInstance) this.createProductModalInstance.close();
    this.isLoading = true;
    let filter: any = {
      type: this.productType
    };
    const qs = new URLSearchParams(filter).toString();
    this.api.get(`${Const.API_SELLER}/admin/product?${qs}`).then(
      (res: any) => {
        this.listData = res.data;
        this.listOfDisplayData = res.data;
        this.isLoading = false
        console.log(this.listData)
      }
    ).catch(err => {
      console.log(err);
      this.isLoading = false
    })
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.listOfDisplayData = this.listData.filter((item: any) => item.title.indexOf(this.searchValue) !== -1);
  }

  sortAmount(a: any, b: any){
    return a.amount - b.amount
  };
  sortSold(a: any, b: any){
    return a.sold - b.sold
  }
  sortCreated(a: any, b: any){
    let d1 = new Date(a.created).getTime();
    let d2 = new Date(b.created).getTime();
    return  d1 - d2;
  }

  getRouterLink(item: any){
    return `/admin/product/${item._id}`
  }

  deleteProduct(id: string){
    this.api.post(`${Const.API_SELLER}/delete-product/${id}`, {})
    .then(res => this.getData())
    .catch(err => console.log(err))
  }

  createProduct(){
    this.createProductModalInstance = this.modalService.create({
      nzContent: CreateProductModal,
      nzWidth: '100vw',
      nzTitle:'Thông tin sản phẩm',
      nzFooter: null,
      nzStyle:{
        top:'20px'

      },
      nzData: {
        refreshData: () => this.getData()
      }
    })
  }
}
