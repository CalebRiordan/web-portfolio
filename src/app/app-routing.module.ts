import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './pages/dashboard/login/login-page/login-page.component';
import { HomeComponent } from './pages/home/home.component';
import { DashboardMainComponent } from './pages/dashboard/dashboard-main/dashboard-main.component';
import { authGuard } from './services/auth.guard';
import { EditProjectComponent } from './pages/dashboard/edit-project/edit-project.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', component: HomeComponent },
  { path: 'admin/login', component: LoginPageComponent },
  {
    path: 'admin/dashboard',
    component: DashboardMainComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin/edit-project',
    component: EditProjectComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
