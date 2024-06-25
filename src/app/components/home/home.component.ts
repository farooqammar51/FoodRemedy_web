import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/authentication-service/auth.service';
import { UserService } from 'src/app/services/user-service/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  take: number = 50;
  skip: number = 0;

  username!: string | null;

  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {
    this.username = this.authService.username;
  }

  shouldRenderHomeContent() {
    const currentRoute = this.route.snapshot;
    return !currentRoute.firstChild;
  }

  onLogout() {
    this.authService.logout();
  }

  onClickUserComponent() {
    this.userService.isUserSelectedSubject.next(false);
  }

}
