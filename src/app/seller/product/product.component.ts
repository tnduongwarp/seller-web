import { Component } from '@angular/core';
import { BaseComponent } from '../../base/base.component';
import { Const } from '../../const/const';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CreateProductModal } from '../../modals/create-product/create-product.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent extends BaseComponent{
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
    let owner = JSON.parse(localStorage.getItem('user')!);
    this.isLoading = true;
    let filter: any = {
      type: this.productType
    };
    const qs = new URLSearchParams(filter).toString();
    this.api.get(`${Const.API_GET_LIST_PRODUCT}/getListForSeller/${owner._id}?${qs}`).then(
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
    return `/product/${item._id}`
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
