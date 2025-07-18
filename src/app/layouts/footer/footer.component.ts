import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl:  './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  profiles: { [key: string]: string } = {
    linkedin: 'https://www.linkedin.com/in/caleb-riordan-1aa886227',
    github: 'https://github.com/CalebRiordan?tab=repositories',
  };

  navigateToWebsite(profile: string) {
    window.open(this.profiles[profile], '_blank');
  }
}
