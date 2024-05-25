import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationComponent } from './general-components/registration/registration.component';
import { LoginComponent } from './general-components/login/login.component';
import { AuthGuardService } from './service/auth-guard.service';
import { ProductComponent } from './seller/product/product.component';
import { RevenueComponent } from './seller/revenue/revenue.component';
import { AdvertisementComponent } from './admin/advertisement/advertisement.component';
import { ProfileComponent } from './general-components/profile/profile.component';
import { ProductDetailComponent } from './seller/product-detail/product-detail.component';
import { OrderComponent } from './seller/order/order.component';
import { OrderDetailComponent } from './seller/order-detail/order-detail.component';
import { UserComponent } from './admin/user/user.component';
import { UserDetailComponent } from './admin/user-detail/user-detail.component';
import { StatiticsComponent } from './admin/statitics/statitics.component';
import { ConfirmProductComponent } from './admin/confirm-product/confirm-product.component';
import { ConfirmProductDetailComponent } from './admin/confirm-product-detail/confirm-product-detail.component';
import { RegisterAdvComponent } from './seller/register-adv/register-adv.component';

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
    path: 'seller/advertisement',
    component: RegisterAdvComponent,
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
    path: 'admin/advertisement',
    component: AdvertisementComponent,
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
