import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from 'app/layouts/footer/footer.component';
import { NavbarComponent } from 'app/layouts/navbar/navbar.component';
import { AboutMeComponent } from 'app/layouts/about-me/about-me.component';
import { ProjectsComponent } from 'app/layouts/projects/projects.component';
import { ContactMeComponent } from 'app/layouts/contact-me/contact-me.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    ContactMeComponent,
    NavbarComponent,
    AboutMeComponent,
    ProjectsComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {}
