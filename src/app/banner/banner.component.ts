import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {
  constructor(
    public appService: AppService,
    private router: Router,
    public auth: AuthService
  ) { }

  ngOnInit() { }

  logout() {
    this.appService.username = '';
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }
}
