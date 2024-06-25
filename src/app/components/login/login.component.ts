import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/authentication-service/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage!: string;
  isLoggedIn: boolean = false;
  loginProgress: boolean = false;
  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.authService.isAuthenticatedSubject.subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
    });
  }

  ngOnInit(): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/home']);
      this.loginForm = new FormGroup({
        credentials: new FormGroup({
          username: new FormControl(null),
          password: new FormControl(null),
        }),
      });
    } else {
      this.loginForm = new FormGroup({
        credentials: new FormGroup({
          username: new FormControl(null, [
            Validators.required,
            Validators.email,
          ]),
          password: new FormControl(null, Validators.required),
        }),
      });
    }
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.loginProgress = true;
      this.authService
        .login(
          this.loginForm.value.credentials.username,
          this.loginForm.value.credentials.password
        )
        .subscribe(
          (res) => {
            if (res) {
              //console.log(res);
              this.loginProgress = false;
              this.authService.username =
                this.loginForm.value.credentials.username;
              this.router.navigate(['home']);
            }
          },
          (error) => {
            this.loginProgress = false;
            this.errorMessage = error.message;
            //console.log(error.message);
          }
        );
    } else {
      this.loginForm.get('credentials.username')?.markAsTouched();
      this.loginForm.get('credentials.password')?.markAsTouched();
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
