import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserModel } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user-service/user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})

export class EditUserComponent implements OnInit {

  @Output() itemAdded = new EventEmitter<void>();

  registerUser!: FormGroup;
  isAccountCreated: boolean = false;
  showPassword: boolean = false;
  displayMessage!: string;
  importedData: UserModel = {
    id: '',
    email: '',
    refreshTokenId: ''
  };
  isUpdateData: boolean = false;
  username: string = '';
  password: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: UserModel, private userService: UserService) { }

  ngOnInit() {
    if (this.data) {
      this.isUpdateData = true;
      this.importedData = this.data;
      this.username = this.importedData.email;
    }

    this.registerUser = new FormGroup({
      'userDetails': new FormGroup({
        'username': new FormControl(null, [Validators.required, Validators.email]),
        'password': new FormControl(null, Validators.required)
      })
    });
  }

  onSubmit(action: number) {
    if (this.registerUser.valid) {
      if (action === 0) {
        this.userService.registerUser(this.registerUser.value.userDetails.username, this.registerUser.value.userDetails.password).
          subscribe(
            res => {
              if(res == null) {
                this.displayMessage = "User added!";
                this.userService.refreshUsersSubject.next(true);
                this.isAccountCreated = true;
              } else {
                this.displayMessage = res.message;
                this.userService.refreshUsersSubject.next(true);
              }
            },
            error => {
              this.displayMessage = error.message;
              //console.log(error.message);
            }
          );
      } else {
        console.log('Update called');
        //TODO: call to update service here
        //have ID as optional parameter and check based on ID wether add or update
      }
    } else {
      this.registerUser.get('userDetails.username')?.markAsTouched();
      this.registerUser.get('userDetails.password')?.markAsTouched();
    }
    this.resetForm();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  resetForm() {
    this.registerUser.reset(
      this.registerUser =  this.registerUser = new FormGroup({
        'userDetails': new FormGroup({
          'username': new FormControl(null, [Validators.required, Validators.email]),
          'password': new FormControl(null, Validators.required)
        })
      })
      );
  }

}

