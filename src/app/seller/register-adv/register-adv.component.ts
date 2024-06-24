import { Component } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { BaseComponent } from 'src/app/base/base.component';
import { Const } from 'src/app/const/const';
import { getBase64 } from '../product-detail/product-detail.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FileUploadService } from 'src/app/service/upload-file.service';
import { v4 as uuidv4 } from 'uuid';
import { FileUpload } from 'src/app/models/file-upload.model';
import { io } from 'socket.io-client';
interface TableData {
  id: string,
  shopName: string,
  price: number,
  expand: false,
  products: any,
  created: string
}
@Component({
  selector: 'app-register-adv',
  templateUrl: './register-adv.component.html',
  styleUrls: ['./register-adv.component.scss']
})
export class RegisterAdvComponent extends BaseComponent{
  constructor(private notification: NzNotificationService,  private uploadService: FileUploadService){
    super();
    this.owner = JSON.parse(localStorage.getItem('user')!);
    this.socket = io('http://localhost:3000');
    this.socket.on('new_bid', (data: any) => {
      if(data) this.handleData(data)
    })
  }
  expandSet = new Set<number>();
  isLoadingTable: boolean = true;
  isLoadingProduct: boolean = true;
  isLoadingHistory: boolean = true;
  onProgress: boolean = false;
  fileList: NzUploadFile[] = [];
  originalFileList: NzUploadFile[] = [];
  previewImage: string | undefined = '';
  previewVisible = false;
  owner: any;
  public listData: TableData[] = [];
  public listProd: any = [];
  public listPrdSelected: any;
  public myBid: any;
  public price: string = '';
  private socket: any;
  public fromDate: any;
  public toDate: any;
  public listHistory: any = [];

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file['preview']) {
      file['preview'] = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file['preview'];
    this.previewVisible = true;
  };
  override ngOnInit(): void {

    this.getProducts();
    this.setDate();
    setTimeout(() => {
      this.getData();
      this.getHistoryBid()
    },1)
  }
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }


  getData(){
    this.isLoadingTable = true;

    this.api.post(`${Const.API_SELLER}/bids`,{from: this.fromDate, to: this.toDate}).then(
      (res: any) => {
        this.handleData(res.data)
      }
    ).catch(err => {
      this.isLoadingTable = false;
      console.log(err)
    })
  }

  handleData(data: any){
    this.isLoadingTable = false;
    this.fileList  = [];
    this.listData = []
    this.myBid = data.find((it: any) => it.owner._id === this.owner._id);
    if(this.myBid){
      let images = this.myBid.products.map((it: any) => it.image);
      for(let item of images){
        let uploadFile : NzUploadFile = {
          uid: uuidv4(),
          name: this.getFileNameFromFileUrl(item),
          url: item,
          status: 'done'
        };
        this.fileList.push(uploadFile)
      }
      this.originalFileList = [...this.fileList];
      this.price = this.myBid.price
      this.listPrdSelected = this.myBid.products.map((it: any) => it.productId)
    }
    this.buildData(data);
  }
  getProducts(){
    let owner = JSON.parse(localStorage.getItem('user')!);
    this.isLoadingProduct = true;
    this.api.get(`${Const.API_GET_LIST_PRODUCT}/getListForSeller/${owner._id}?type=0`).then(
      (res: any) => {
        this.listProd = res.data;
        console.log(this.listProd);
        this.isLoadingProduct = false;
      }
    )
  }

  buildData(data: any){
    data.forEach((element: any) => {
      let obj: TableData = {
        id: element._id,
        shopName: element?.owner?.shopName || '',
        price: element.price,
        expand: false,
        products: element.products.map((it: any) => it.product.title),
        created: this.formatDate(element.created)
      }
      this.listData.push(obj)
    });
  }

  onSave(){
    console.log(this.listPrdSelected);
    console.log(this.fileList);
    console.log(this.originalFileList)
    if(this.listPrdSelected.length != this.fileList.length){
      this.notification.error('Có lỗi xảy ra','Số lượng sản phẩm và ảnh không khớp.');
      return;
    }
    if(!this.listPrdSelected.length || !this.fileList.length){
      this.notification.error('Có lỗi xảy ra','Ảnh hoặc sản phẩm đang bị trống.');
      return;
    }
    if(this.myBid) this.updateBid();
    else this.createBid();

  }
  createBid() {
    const fileUploads: FileUpload[] = [];
    const promises: any = [];
    for(let file of this.fileList){
      if(file?.originFileObj){
        const fileUpload = new FileUpload(file?.originFileObj);
        fileUploads.push(fileUpload);
      }
    }
    this.onProgress = true
    this.uploadService.pushFilesToStorage(fileUploads).subscribe(res => {
      //update bid
      let products: any = [];
      for(let i = 0; i< this.fileList.length; i++){

        const obj = {
          productId: this.listPrdSelected[i],
          image: fileUploads[i].url
        }
        products.push(obj);
      }
      this.api.post(`${Const.API_SELLER}/add_bid`,{products, price: this.price,owner: this.owner._id}).then(
        (res: any) => {
          console.log(res);
          this.updateData();
          this.onProgress = false;
          this.notification.success('Thành công', 'Tạo sản phẩm đấu giá thành công')
        }
      ).catch((err: any) => {
        console.log(err);
        this.onProgress = false
        this.notification.error('Có lỗi xảy ra','Hãy thử lại sau')
      })
    })
  }

  updateBid(){
    let fileUrlList = this.fileList.map(it => it.url);
    const fileUploads: FileUpload[] = [];
    const promises: any = [];
    for(let file of this.fileList){
      if(file?.originFileObj){
        const fileUpload = new FileUpload(file?.originFileObj);
        fileUploads.push(fileUpload);
      }
    }
    this.onProgress = true;
    for(let file of this.originalFileList){
      if(!fileUrlList.includes(file.url)) {
        let fileName = this.getFileNameFromFileUrl(file.url);
        console.log(fileName)
        if(fileName) this.uploadService.deleteFileStorage(fileName)
      }
    }
    if(fileUploads.length){
      this.uploadService.pushFilesToStorage(fileUploads).subscribe(res => {
        //update bid
        let products: any = [];
        for(let i = 0; i< this.fileList.length; i++){
          let url;
          if(!this.fileList[i]?.originFileObj) url = this.fileList[i].url;
          else{
            let fileUpload = fileUploads.find(it => it.file.name == this.fileList[i].originFileObj?.name);
            url = fileUpload?.url;
          }
          const obj = {
            productId: this.listPrdSelected[i],
            image: url
          }
          products.push(obj);
        }
        this.api.post(`${Const.API_SELLER}/update_bid/${this.myBid. _id}`,{products, price: this.price}).then(
          (res: any) => {
            console.log(res);
            this.notification.success('Thành công', 'Chỉnh sửa sản phẩm đấu giá thành công')
            this.updateData();
            this.onProgress = false
          }
        ).catch((err: any) => {
          console.log(err);
          this.onProgress = false;
          this.notification.error('Có lỗi xảy ra','Hãy thử lại sau')
        })
      })
    }else{
      let products: any = [];
      for(let i = 0; i< this.fileList.length; i++){
        const obj = {
          productId: this.listPrdSelected[i],
          image: this.fileList[i].url
        }
        products.push(obj);
      }
      this.api.post(`${Const.API_SELLER}/update_bid/${this.myBid. _id}`,{products, price: this.price}).then(
        (res: any) => {
          console.log(res);
          this.notification.success('Thành công', 'Chỉnh sửa sản phẩm đấu giá thành công')
          this.updateData();
          this.onProgress = false;
        }
      ).catch(err => {
        console.log(err);
        this.onProgress = false;
        this.notification.error('Có lỗi xảy ra','Hãy thử lại sau')
      })
    }
  }

  updateData(){
    // this.isLoadingTable = true;
    this.socket.emit('update_bid', {from: this.fromDate, to: this.toDate});
    this.getHistoryBid()
  }

  correctStatusFileList(){
    for(let file of this.fileList){
      file.status = 'done'
    }
    this.originalFileList = this.fileList;
  }

  setDate(){
    const date1 = new Date();
    let day1 = date1.getDay();
    date1.setDate(date1.getDate()+this.countPlusDate(day1));
    date1.setHours(0);
    date1.setMinutes(0);
    date1.setSeconds(0);
    this.fromDate = date1;
    const date2 = new Date(date1);
    date2.setDate(date2.getDate()+ 7);
    date2.setHours(23);
    date2.setMinutes(59);
    date2.setSeconds(59);
    this.toDate = date2;
  }

  countPlusDate(day: number){
    if(!day) return 1;
    else return 8-day;
  }

  public getHistoryBid(){
    this.isLoadingHistory = true;
    this.api.get(`${Const.API_SELLER}/bid_history/${this.owner._id}`)
    .then((res: any) => {
      console.log('his', res);
      this.isLoadingHistory = false;
      this.listHistory = res.data;
    })
    .catch(err => console.log(err))
  }

  getResultBid(item: any){
    let status = item.status;
    if(status === 'accepted') return 'Thành công';
    let dateCreated = new Date(item.created);
    let cloneFromDate = new Date(this.fromDate);
    cloneFromDate.setDate(cloneFromDate.getDate() - 7);
    if(dateCreated.getTime() > cloneFromDate.getTime()){
       return 'Đang chờ kết quả';
    }else{
      return 'Thất bại'
    };

  }

}
