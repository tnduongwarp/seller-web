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
import { LoginComponent } from './general-components/login/login.component';
import { RegistrationComponent } from './general-components/registration/registration.component';
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
import { ProductComponent } from './seller/product/product.component';
import { AdvertisementComponent } from './admin/advertisement/advertisement.component';
import { RevenueComponent } from './seller/revenue/revenue.component';
import { ProfileComponent } from './general-components/profile/profile.component';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ProductDetailComponent } from './seller/product-detail/product-detail.component';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { CreateProductModal } from './modals/create-product/create-product.component';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { ChannelComponent } from './modals/chat/views/channel/channel.component';
import { ChatComponent } from './modals/chat/views/chat/chat.component';
import { ReceiverComponent } from './modals/chat/views/receiver/receiver.component';
import { OrderComponent } from './seller/order/order.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { OrderDetailComponent } from './seller/order-detail/order-detail.component';
import { ChangeStatusComponent } from './modals/change-status/change-status.component';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NgApexchartsModule } from 'ng-apexcharts';
import { UserComponent } from './admin/user/user.component';

import { AngularFireModule } from '@angular/fire/compat';
// import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { environment } from '../environments/environment';
import { UserDetailComponent } from './admin/user-detail/user-detail.component';
import { CreateUserComponent } from './modals/create-user/create-user.component';
import { StatiticsComponent } from './admin/statitics/statitics.component';
import { ConfirmProductComponent } from './admin/confirm-product/confirm-product.component';
import { ConfirmProductDetailComponent } from './admin/confirm-product-detail/confirm-product-detail.component';
import { RegisterAdvComponent } from './seller/register-adv/register-adv.component';
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
    ReceiverComponent,
    OrderComponent,
    OrderDetailComponent,
    ChangeStatusComponent,
    UserComponent,
    UserDetailComponent,
    CreateUserComponent,
    StatiticsComponent,
    ConfirmProductComponent,
    ConfirmProductDetailComponent,
    RegisterAdvComponent
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
    NzDrawerModule,
    NzToolTipModule,
    NzDescriptionsModule,
    NzStatisticModule,
    NgApexchartsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    // AngularFireDatabaseModule,
    AngularFireStorageModule
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
