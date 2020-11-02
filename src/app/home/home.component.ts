import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OS } from './home.enum';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  redirectToOS() {
    const os = this.getMobileOperatingSystem();
    console.log(os);
    if (os === OS.unknown) {
      this.router.navigate(['ios']);
    } else {
      this.router.navigate([os]);
    }
  }

  getMobileOperatingSystem() {
    const userAgent = navigator.userAgent || navigator.vendor;

    if (/android/i.test(userAgent)) {
      return OS.Android;
    }

    if (/iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return OS.iOS;
    }

    return OS.unknown;
  }
}
