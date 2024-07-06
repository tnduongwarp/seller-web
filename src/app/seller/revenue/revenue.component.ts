import { Component, TemplateRef, ViewChild } from '@angular/core';
import { BaseComponent } from '../../base/base.component';
import { Const } from '../../const/const';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ApexYAxis,
  ApexFill
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions?: ApexPlotOptions;
  xaxis?: ApexXAxis;
  yaxis?:ApexYAxis;
  fill?: ApexFill
};
@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.scss']
})
export class RevenueComponent extends BaseComponent{
  @ViewChild('prefixTplOne') up : TemplateRef<void> | undefined;
  @ViewChild('prefixTplTwo') down : TemplateRef<void> | undefined;
  @ViewChild("chart") chart: ChartComponent | undefined;
  public chartOptions: Partial<ChartOptions> | undefined;
  public yearChartOptions: ChartOptions | undefined;
  public isLoading: boolean = false;
  public month: number = 0;
  public year: string = 'thisyear';
  public overviewData: any;
  public productStatiticData: any;
  public listProduct: any;
  public isLoadingOverviewData: boolean = true;
  public isLoadingProductStatiticData: boolean = true;
  public pageIndex = 1;
  public pageSize = 7;
  chartData: any = [];
  public total: number = 0;
  public isLoadingYearlyRevenue: boolean = true;
  public yearlyRevenueData: any;
  constructor(){
    super();
    this.month = new Date().getMonth() + 1;
   }
   public get displayYear(){
    let year;
    if(this.year === 'thisyear') year = new Date().getFullYear();
    else year = new Date().getFullYear() - 1;
    return year
   }

  public updateChart(){
    let data: any = [];
    let category: any = [];
    let index = (this.pageIndex - 1) * this.pageSize;
    for(let i = 0; i< this.pageSize; i++){
      let item = this.chartData[index+i];
      if(!item) continue;
      category.push(item.category);
      data.push(item.data)
    }
    this.chartOptions = {
      series: [
        {
          name: "Số lượng đơn hàng",
          data: data //[400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
        }
      ],
      chart: {
        type: "bar",
        height:280
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight:'20px',
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: category,
        axisBorder:{
          show: false
        },
        stepSize:1,
        labels:{
          show:false
        }
      },
      yaxis: {
        axisBorder:{
          show: false
        },
      }
    };
    this.isLoadingProductStatiticData = false;
  }
  override ngOnInit(): void {
    this.getOverviewData();
    this.isLoadingProductStatiticData = true;
    const userId = JSON.parse(localStorage.getItem('user')!)?._id;
    let filter: any = {
      type: 0
    };
    const qs = new URLSearchParams(filter).toString();
    this.api.get(`${Const.API_GET_LIST_PRODUCT}/getListForSeller/${userId}?${qs}`).then(
    (res: any) => {
      console.log(res)
      this.listProduct = res.data;
      let prdIds = this.listProduct.map((it: any) => it._id)
      this.getProductStatiticData(prdIds)
    }
    ).catch(err => console.log(err));
    this.getYearlyRevenue()

  }
  public getOverviewData(){
    this.isLoadingOverviewData = true;
    const userId = JSON.parse(localStorage.getItem('user')!)?._id;
    this.api.get(`${Const.API_SELLER}/analytic/${userId}`).then(
      (res: any) => {
        console.log(res);
        this.overviewData = res.data;
        this.isLoadingOverviewData = false;
      }
    ).catch(err => console.log(err))
  }

  public getProductStatiticData(reqProductIds: string[]){
    this.isLoadingProductStatiticData = true;
    const userId = JSON.parse(localStorage.getItem('user')!)?._id;
    // this.api.get(`${Const.API_GET_LIST_PRODUCT}/getListForSeller/${userId}`).then
    let date = new Date();
    let from = new Date(date.getFullYear(), date.getMonth(), 1);
    let to = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.api.post(`${Const.API_SELLER}/analytic-by-products/${userId}?from=${from}&to=${to}`,{reqProductIds}).then(
      (res: any) => {
        console.log(res);
        this.productStatiticData = res.data.sumary;
        this.total = Object.keys(this.productStatiticData).length;
        for(let key of Object.keys(this.productStatiticData)){
          let product = this.listProduct.find((it: any) => (it._id.toString() ===key.toString()));
          this.chartData.push({
            category: product.title,
            data: this.productStatiticData[key]
          });
        }
        // for(let i = 0;i<99;i++){
        //   this.chartData.push({category: `item${i}`, data: i*10})
        // }
        // this.total = 100;
        this.updateChart()
      }
    ).catch(err => console.log(err))

  }

  public getGrowthTemplate(x: number){
    if(x>=0) return this.up;
    else return this.down;
  }

  public renderYearChart(data: number[]){

    this.yearChartOptions = {
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
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ]
      }
    };

  };
  public getYearlyRevenue(){
    let year;
    if(this.year === 'thisyear') year = new Date().getFullYear();
    else year = new Date().getFullYear() - 1;
    this.isLoadingYearlyRevenue = true;
    const userId = JSON.parse(localStorage.getItem('user')!)?._id;
    this.api.post(`${Const.API_SELLER}/yearly-revenue/${userId}`, {year}).then(
      (res: any) => {
        console.log(res);
        this.yearlyRevenueData = res.data;
        this.isLoadingYearlyRevenue = false;
        this.renderYearChart(res.data)
      }
    ).catch(err => console.log(err))
  }

}
