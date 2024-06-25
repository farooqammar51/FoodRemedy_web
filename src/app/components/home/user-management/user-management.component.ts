import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user-service/user.service';
import { EditUserComponent } from './edit-user/edit-user.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { UserModel } from 'src/app/models/user.model';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit, AfterViewInit, OnDestroy {

  users: UserModel[] = [];
  dataSource: any = undefined;
  displayedColumns: string[] = ["index", "email", "status"];
  take: number = 20;
  skip: number = 0;
  userId!: string;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isUserSelected: boolean = false;

  getUserSubscription!: Subscription;

  constructor(private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      (queryParams) => {
        this.take = queryParams['take'] !== undefined ? queryParams['take'] : 50;
        this.skip = queryParams['skip'] !== undefined ? queryParams['skip'] : 0;
      }
    );
    this.getUsers();
  }

  ngAfterViewInit(): void {
    this.userService.refreshUsersSubject.subscribe(
      (res: boolean) => {
        if(res) {
          this.getUsers();
        }
      }
    )
    this.userService.isUserSelectedSubject.subscribe(
      (isUserSelected: boolean) => {
        this.isUserSelected = isUserSelected;
      }
    )
  }

  getUsers() {
    this.getUserSubscription = this.userService.getUsers(this.skip, this.take).subscribe(
      response => {
        if (response) {
          let index = 0;
          for(let i = 0; i < response.count; i++) {
            index++;
            const newUser: UserModel = {
              id: response.results[i].id,
              email: response.results[i].email,
              index: index,
              status: 'Active'
            }
            this.users.push(newUser);
          }
          //console.log(this.users);
          this.dataSource = new MatTableDataSource<UserModel>(this.users);
          if(this.dataSource!=undefined) {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          } 
        }
      },
      error => {
        console.log(error.message);
      }
    )
  }

  onClickUser(userId: string) {
    this.isUserSelected = true;
    this.userService.isUserSelectedSubject.next(true);
    this.userId = userId
    this.router.navigate([userId], { relativeTo: this.route });
  }

  openDialog(data?: UserModel) {
    const dialogRef = this.dialog.open(EditUserComponent, {
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
      this.isUserSelected = false;
      this.userService.isUserSelectedSubject.next(false);
    });
  }

  filterchange(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  onAddUpdateUser(action: number) {
    if (action === 1) {
      if (this.userId) {
        this.userService.getUser(this.userId).subscribe(
          response => {
            this.openDialog(response);
          },
          error => {
            console.log(error.message);
          }
        )
        //this.router.navigate(['edit'], { relativeTo: this.route, queryParamsHandling: 'merge' });
      }
    } else {
      //this.router.navigate(['add'], { relativeTo: this.route })
      this.openDialog();
    }
  }

  ngOnDestroy(): void {
    this.getUserSubscription.unsubscribe();
  }

}
