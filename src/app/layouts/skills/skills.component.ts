import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';

@Component({
    selector: 'app-skills',
    templateUrl: './skills.component.html',
    styleUrls: ['./skills.component.css'],
    standalone: false
})
export class SkillsComponent{
  private cvUrl: string = "assets/Caleb Riordan - Curriculum Vitae.pdf";
  techStack : {[key: string]: string} = {
    angular: "https://angular.io/guide/what-is-angular",
    aspnet: "https://dotnet.microsoft.com/en-us/learn/aspnet/what-is-aspnet",
    csharp: "https://learn.microsoft.com/en-us/dotnet/csharp/tour-of-csharp/",
    html: "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics",
    css: "https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps/What_is_CSS",
    mysql: "https://dev.mysql.com/doc/refman/8.0/en/what-is-mysql.html"
  };

  constructor(private renderer: Renderer2) {}

  @ViewChild('gradient') gradient!: ElementRef;

  navigateToWebsite(technology: string){
    window.open(this.techStack[technology], '_blank');
  }

  openCV(){
    window.open(this.cvUrl, '_blank');
  }

}
