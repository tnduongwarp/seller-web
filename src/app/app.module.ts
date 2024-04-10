import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { RestApiService } from './service/rest-api.service';
import { AuthGuardService } from './service/auth-guard.service';
import { TokenInterceptor } from './http-interceptor';
import { TimeagoCustomFormatter, TimeagoFormatter, TimeagoIntl, TimeagoModule } from 'ngx-timeago';
import { setInjector } from './service/injector';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { RouterModule } from '@angular/router';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { ForgotPWForm } from './modals/forgot-pw';
import { ProductComponent } from './product/product.component';
import { AdvertisementComponent } from './advertisement/advertisement.component';
import { RevenueComponent } from './revenue/revenue.component';
import { ProfileComponent } from './profile/profile.component';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { CreateProductModal } from './modals/create-product/create-product.component';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { ChannelComponent } from './modals/chat/views/channel/channel.component';
import { ChatComponent } from './modals/chat/views/chat/chat.component';
import { ReceiverComponent } from './modals/chat/views/receiver/receiver.component';

registerLocaleData(en);

export class MyIntl extends TimeagoIntl {
  // do extra stuff here...
}
@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    LoginComponent,
    ForgotPWForm,
    ProductComponent,
    RevenueComponent,
    AdvertisementComponent,
    ProfileComponent,
    ProductDetailComponent,
    CreateProductModal,
    ChannelComponent,
    ChatComponent,
    ReceiverComponent
  ],
  imports: [
    TimeagoModule.forRoot({
      intl: { provide: TimeagoIntl, useClass: MyIntl },
      formatter: { provide: TimeagoFormatter, useClass: TimeagoCustomFormatter },
    }),
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzCheckboxModule,
    NzAvatarModule,
    NzNotificationModule,
    NzModalModule,
    NzRadioModule,
    NzSelectModule,
    NzPaginationModule,
    NzImageModule,
    NzCarouselModule,
    NzRateModule,
    NzDividerModule,
    NzInputNumberModule,
    NzMessageModule,
    NzPopconfirmModule,
    NzDatePickerModule,
    NzPageHeaderModule,
    NzTagModule,
    NzTabsModule,
    NzBadgeModule,
    NzResultModule,
    NzTimelineModule,
    NzDropDownModule,
    NzTableModule,
    NzUploadModule,
    NzSegmentedModule,
    NzDrawerModule
  ],
  providers: [RestApiService, AuthGuardService,
    { provide: NZ_I18N, useValue: en_US },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(injector: Injector){
    setInjector(injector)
  }
}