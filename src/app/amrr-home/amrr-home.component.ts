import { Component } from '@angular/core';
import { AuthService } from '../auth/amrr-login/auth.service';

@Component({
  selector: 'app-amrr-home',
  templateUrl: './amrr-home.component.html',
  styleUrls: ['./amrr-home.component.css'],
})
export class AmrrHomeComponent {
  data: any;
  showFiller = false;
  username = 'Arunjunai Rajavel';
  panelOpenState = false;

  constructor(private readonly authService: AuthService) {}

  logOut() {
    this.authService.logOut();
  }
}