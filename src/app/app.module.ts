import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatDialogModule } from '@angular/material/dialog';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { AboutMeComponent } from './layouts/about-me/about-me.component';
import { ProjectsComponent } from './layouts/projects/projects.component';
import { ContactMeComponent } from './layouts/contact-me/contact-me.component';
import { SkillsComponent } from './layouts/skills/skills.component';
import { FeaturedProjectComponent } from './layouts/featured-project/featured-project.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule} from '@angular/common/http';

import { ReactiveFormsModule } from '@angular/forms';
import { RippleEffectDirective } from './directives/ripple-effect.directive';
import { LoginPageComponent } from './pages/dashboard/login/login-page/login-page.component';
import { DashboardMainComponent } from './pages/dashboard/dashboard-main/dashboard-main.component';
import { ProjectCardComponent } from './pages/dashboard/project-card/project-card.component';
import { EditProjectComponent } from './pages/dashboard/edit-project/edit-project.component';
import { ConfirmationDialogComponent } from './layouts/confirmation-dialog/confirmation-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    AboutMeComponent,
    ProjectsComponent,
    ContactMeComponent,
    SkillsComponent,
    FeaturedProjectComponent,
    RippleEffectDirective,
    LoginPageComponent,
    DashboardMainComponent,
    ProjectCardComponent,
    EditProjectComponent,
    ConfirmationDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
