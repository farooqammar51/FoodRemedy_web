import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import { UserManagementComponent } from './components/home/user-management/user-management.component';
import { UserDetailComponent } from './components/home/user-management/user-detail/user-detail.component';
import { NgModule } from "@angular/core";
import { PageNotFoundComponent } from "./shared/components/page-not-found/page-not-found.component";
import { AuthGuard } from "./services/authentication-service/auth-guard.service";
import { DatabaseManagementComponent } from "./components/home/database-management/database-management.component";
import { EditIngredientComponent } from "./components/home/database-management/edit-ingredient/edit-ingredient.component";
import { EditCategoryComponent } from "./components/home/database-management/category-management/edit-category/edit-category.component";
import { CategoryManagementComponent } from "./components/home/database-management/category-management/category-management.component";
import { TagManagementComponent } from "./components/home/database-management/tag-management/tag-management.component";
import { EditTagComponent } from "./components/home/database-management/tag-management/edit-tag/edit-tag.component";

const routes: Routes = [
    { path: 'login', component: LoginComponent},
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', 
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
        { path: 'user', component: UserManagementComponent, children: [
            { path: ':id', component: UserDetailComponent }
        ] },
        { path: 'database', component: DatabaseManagementComponent, children: [
            { path: 'add', component: EditIngredientComponent },
            { path: ':id', component: EditIngredientComponent }
        ] },
        { path: 'category', component: CategoryManagementComponent, children: [
            { path: 'add', component: EditCategoryComponent },
            { path: 'id', component: EditCategoryComponent }
        ] },
        { path: 'tag', component: TagManagementComponent, children: [
            { path: 'add', component: EditTagComponent },
            { path: 'id', component: EditTagComponent }
        ] }
    ]},
    { path: 'not-found', component: PageNotFoundComponent, data: {message: 'Page not found'} },
    { path: '**', redirectTo: '/not-found' }

]

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule]
})

export class AppRouting {

}