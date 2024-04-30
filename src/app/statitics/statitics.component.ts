import { Component, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { Const } from '../const/const';
import { ChartComponent } from 'ng-apexcharts';
import { ChartOptions } from '../revenue/revenue.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';

interface NumberData{
  growth: number,
  orderThisMonth: number,
  sellerThisMonth: number,
  thisMonthRevenue: number,
  totalOrder: number,
  totalRevenue: number,
  totalSeller: number,
  totalUser: number,
  userThisMonth: number
}

@Component({
  selector: 'app-statitics',
  templateUrl: './statitics.component.html',
  styleUrls: ['./statitics.component.scss']
})
export class StatiticsComponent extends BaseComponent{
  public isLoadingNumberData: boolean = true;
  public isLoadingChartData: boolean = true;
  public isLoadingDetailData: boolean = true;
  public numberData: NumberData | undefined ;
  public chartData: any;
  public detailData: any;
  public detailMonth: string = 'thisMonth';
  public year: string = 'thisyear';
  public isSending: any = {}
  @ViewChild("chart") chart: ChartComponent | undefined;
  public chartOptions: Partial<ChartOptions> | undefined;
  constructor(private notification: NzNotificationService){
    super()
  }
  override ngOnInit(): void {
    this.getNumberData();
    this.getChartData();
    this.getDetailData();
  }

  public getNumberData(){
    this.isLoadingNumberData = true;
    this.api.get(`${Const.API_SELLER}/admin/statitic`).then(
      (data: any) => {
        this.isLoadingNumberData = false;
        console.log(data);
        this.numberData = data.data;
        console.log(this.convertNumberToCurrency(Number(this.numberData?.totalRevenue)))
      }
    ).catch(err => console.log(err))
  }
  public getChartData(){
    let year;
    if(this.year === 'thisyear') year = new Date().getFullYear();
    else year = new Date().getFullYear() - 1;
    this.isLoadingChartData = true;
    this.api.post(`${Const.API_SELLER}/admin/chart`, {year}).then(
      (data: any) => {
        this.isLoadingChartData = false;
        console.log('chart',data);
        this.chartData = data.data;
        this.renderYearChart(this.chartData)
      }
    ).catch(err => console.log(err))
  }
  public getDetailData(){
    this.isLoadingDetailData = true;
    this.api.get(`${Const.API_SELLER}/admin/detail?month=${this.detailMonth}`).then(
      (data: any) => {
        this.isLoadingDetailData = false;
        console.log('detail',data);
        this.detailData = data.data;
        this.detailData.forEach((it: any) => {
          this.isSending[it._id] = false;
        })
      }
    ).catch(err => console.log(err))
  }

  public renderYearChart(data: number[]){

    this.chartOptions = {
      chart: {
        height: 350,
        type: "area"
      },
      dataLabels: {
        enabled: false
      },
      series: [
        {
          name: "Doanh thu (VNĐ)",
          data: data
        }
      ],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 90, 100]
        }
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ]
      }
    };

  };

  sendEmail(seller: any){
    if(!seller) return;
    const lastMonth = new Date().getMonth();
    const lastMonthTime = new Date();
    lastMonthTime.setMonth(new Date().getMonth() - 1);
    const lastYear = lastMonthTime.getFullYear()
    let content = `Cảm ơn vì đã sử dụng nền tảng bán hàng trực tuyến Ecommerce, phí nền tảng trong ${this.detailMonth === 'thisMonth'? 'tháng này' : `tháng ${lastMonth}`} là ${this.convertNumberToCurrency(seller.revenue*0.03)}. Hãy thanh toán sớm để không bị dán đoạn dịch vụ.`

    let body = {
      recipient_email: seller.email,
      name: seller.name,
      subject:`Thanh toán phí nền tảng tháng ${this.detailMonth === 'thisMonth'? `${lastMonth+1}` : `${lastMonth}`} năm ${this.detailMonth === 'thisMonth'? `${new Date().getFullYear()}` : `${lastYear}`}`,
      content
    }
    this.isSending[seller._id] = true;
    this.api.post(`${Const.API_SELLER}/admin/send_mail`, body).then(
      res => {
        this.isSending[seller._id] = false
        this.notification.success('','Gửi email thành công')
      }
    ).catch(err => {
      this.isSending[seller._id] = false
      this.notification.error('', 'Đã có lỗi xảy ra, vui lòng thử lại sau')
    })
  }
}
