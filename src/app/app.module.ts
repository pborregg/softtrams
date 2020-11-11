import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { AppService } from './app.service';
import { AppComponent } from './app.component';
import { BannerComponent } from './banner/banner.component';
import { MemberDetailsComponent } from './member-details/member-details.component';
import { MembersComponent } from './members/members.component';
import { LoginComponent } from './login/login.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { AuthService } from './auth/auth.service';
import { CallbackComponent } from './pages/callback/callback.component';

// We may be missing a route...
const ROUTES = [

  {
    path: 'callback',
    component: CallbackComponent
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
    data: {
      breadcrumb: 'Home'
    }
  },
  {
    path: 'members',
    component: MembersComponent,
    data: {
      breadcrumb: 'All Members'
    }
  },
  {
    path: 'member-details',
    component: MemberDetailsComponent,
    data: {
      breadcrumb: 'Member Details'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      breadcrumb: 'Login'
    }
  }
];

// Notice how both FormsModule and ReactiveFormsModule imported...choices, choices!
@NgModule({
  declarations: [
    AppComponent,
    BannerComponent,
    MemberDetailsComponent,
    MembersComponent,
    LoginComponent,
    BreadcrumbComponent,
    CallbackComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES, { useHash: true }),
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    AppService,
    HttpClient,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
