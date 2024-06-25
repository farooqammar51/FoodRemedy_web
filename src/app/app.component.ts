import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from './services/authentication-service/auth.service';
import { IdleStateDetectionComponent } from './components/idle-state-detection/idle-state-detection.component';
import { UserModel } from './models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  isAuthenticated!: boolean;

  constructor(
    private authService: AuthService) {}

  ngOnInit(): void {

    this.authService.isAuthenticatedSubject.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });

    this.authService.reCalculateTokenExpirationTimeAfterReload();
  }

}
