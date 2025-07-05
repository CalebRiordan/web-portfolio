import { Component } from '@angular/core';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css'],
    standalone: false
})
export class FooterComponent {

  profiles: {[key: string]: string} = {
    linkedin: "https://www.linkedin.com/in/caleb-riordan-1aa886227",
    github: "https://github.com/CalebRiordan?tab=repositories"
  };

  navigateToWebsite(profile: string){
    window.open(this.profiles[profile], '_blank'); 
  }

}
