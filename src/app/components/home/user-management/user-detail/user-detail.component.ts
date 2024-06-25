import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { UserModel } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user-service/user.service';

interface User {
  id: number;
  name: string;
  email: string;
  password: string,
  status: boolean,
  apiKeys: number;
}

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  user: UserModel = {
    id: '',
    email: '',
    refreshTokenId: '',
    status: ''
  };
  userId!: string;

  constructor(private route: ActivatedRoute, 
    private userService: UserService, 
    private dialog: MatDialog) {}

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.userId = params['id'];
        this.userService.getUser(this.userId).subscribe(
          response => {
            if(response) {
              this.user.email = response.email;
              this.user.id = response.id;
              this.user.status = "Active";
            }
          },
          error => {
            console.log(error.message);
          }
        );
      }
    )
  }

  openDialog(data?: UserModel) {
    const dialogRef = this.dialog.open(UserDetailComponent, {
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
      this.userService.isUserSelectedSubject.next(false);
    });
  }

  onCloseDetails() {
    this.userService.isUserSelectedSubject.next(false);
  }
 
}
