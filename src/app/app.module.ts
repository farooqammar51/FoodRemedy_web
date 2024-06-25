import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { UserManagementComponent } from './components/home/user-management/user-management.component';
import { UserDetailComponent } from './components/home/user-management/user-detail/user-detail.component';
import { AppRouting } from './app-routing-module';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditUserComponent } from './components/home/user-management/edit-user/edit-user.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthInterceptorService } from './services/authentication-service/auth-interceptor.service';
import { DatabaseManagementComponent } from './components/home/database-management/database-management.component';
import { IdleStateDetectionComponent } from './components/idle-state-detection/idle-state-detection.component';
import { EditIngredientComponent } from './components/home/database-management/edit-ingredient/edit-ingredient.component';

// Material UI modules
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSelectModule} from '@angular/material/select';
import {MatChipsModule} from '@angular/material/chips'
import { AsyncPipe } from '@angular/common';
import {MatAutocompleteSelectedEvent, MatAutocompleteModule} from '@angular/material/autocomplete';
 
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    UserManagementComponent,
    UserDetailComponent,
    PageNotFoundComponent,
    EditUserComponent,
    DatabaseManagementComponent,
    IdleStateDetectionComponent,
    EditIngredientComponent
  ],
  imports: [
    BrowserModule,
    AppRouting,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgIdleKeepaliveModule.forRoot(),
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDividerModule,
    MatCardModule,
    MatListModule,
    MatBadgeModule,
    MatSidenavModule,
    MatMenuModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatExpansionModule,
    MatSelectModule,
    MatChipsModule,
    MatAutocompleteModule,
    AsyncPipe,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
