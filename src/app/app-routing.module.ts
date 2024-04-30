import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './service/auth-guard.service';
import { ProductComponent } from './product/product.component';
import { RevenueComponent } from './revenue/revenue.component';
import { AdvertisementComponent } from './advertisement/advertisement.component';
import { ProfileComponent } from './profile/profile.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { OrderComponent } from './order/order.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { UserComponent } from './user/user.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { StatiticsComponent } from './statitics/statitics.component';
import { ConfirmProductComponent } from './confirm-product/confirm-product.component';
import { ConfirmProductDetailComponent } from './confirm-product-detail/confirm-product-detail.component';

const routes: Routes = [
  {
    path: 'register',
    component: RegistrationComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'product',
    component: ProductComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'product/:id',
    component: ProductDetailComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'revenue',
    component: RevenueComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'advertise',
    component: AdvertisementComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'order',
    component: OrderComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'order/:id',
    component: OrderDetailComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'user',
    component: UserComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'user/:id',
    component: UserDetailComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'statitics',
    component: StatiticsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'admin/product',
    component: ConfirmProductComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'admin/product/:id',
    component: ConfirmProductDetailComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: '',
    component: ProfileComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
