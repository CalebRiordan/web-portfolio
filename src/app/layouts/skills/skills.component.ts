import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css'],
})
export class SkillsComponent implements AfterViewInit, OnDestroy {
  private cvUrl: string = 'assets/Caleb Riordan - Curriculum Vitae.pdf';

  // Carousel variables
  carouselWidth!: number;
  rotationOffset = 0;
  rotationInterval!: any;
  skillPadding!: number;
  skillWidth!: number;
  resizeTimeout: any;
  rotationActive = true;

  // Links
  techStack: { [key: string]: string } = {
    angular: 'https://v17.angular.io/guide/what-is-angular',
    typescript:
      'https://www.ionos.ca/digitalguide/websites/web-development/what-is-typescript',
    php: 'https://xneelo.co.za/help-centre/website/what-is-php/',
    aspnet: 'https://dotnet.microsoft.com/en-us/learn/aspnet/what-is-aspnet',
    csharp: 'https://learn.microsoft.com/en-us/dotnet/csharp/tour-of-csharp/',
    html: 'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics',
    css: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps/What_is_CSS',
    mysql: 'https://dev.mysql.com/doc/refman/8.0/en/what-is-mysql.html',
  };

  @ViewChild('gradient') gradient!: ElementRef;
  @ViewChild('skills') skillsContainer!: ElementRef;
  @ViewChildren('skill') skills!: QueryList<ElementRef>;

  onSkillsEnter() {
    if (!this.rotationActive) return;
    this.rotationActive = false;
    const skillsEl = this.skillsContainer.nativeElement;

    // Fade out
    this.renderer.addClass(skillsEl, 'fade');
    this.renderer.addClass(skillsEl, 'no-transform-transition');

    setTimeout(() => {
      // Change styles
      this.renderer.addClass(skillsEl, 'hovered');

      // Fade in
      this.renderer.removeClass(skillsEl, 'fade');
    }, 300);
  }

  onSkillsLeave() {
    const skillsEl = this.skillsContainer.nativeElement;

    // Fade out
    this.renderer.addClass(skillsEl, 'fade');

    setTimeout(() => {
      // Change styles
      this.renderer.removeClass(skillsEl, 'hovered');
      this.updateCarouselMeasurements();

      // Fade in
      this.renderer.removeClass(skillsEl, 'fade');
      setTimeout(() => {
        this.renderer.removeClass(skillsEl, 'no-transform-transition');
        this.rotationActive = true;
      }, 300);
    }, 300);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    this.resizeTimeout = setTimeout(() => {
      this.updateCarouselMeasurements();
    }, 300);
  }

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    // Carousel initial state
    this.setCarouselState(0);
    this.setCarouselTimer();
  }

  navigateToWebsite(technology: string) {
    window.open(this.techStack[technology], '_blank');
  }

  openCV() {
    window.open(this.cvUrl, '_blank');
  }

  updateCarouselMeasurements() {
    // Adjust skills measurements
    this.carouselWidth = this.skillsContainer.nativeElement.clientWidth;
    this.skillWidth = this.carouselWidth * 0.21;
    this.skillPadding = this.carouselWidth * 0.02;

    // Apply new measurements to elements
    this.skills.forEach((skill: ElementRef) => {
      this.renderer.setStyle(
        skill.nativeElement,
        'width',
        `${this.skillWidth}px`
      );
    });
  }

  setCarouselTimer() {
    this.rotationInterval = setInterval(() => {
      if (this.rotationActive) {
        this.rotateSkills();
      }
    }, 2000);
  }

  rotateSkills() {
    const skillsArray = this.skills.toArray();
    this.rotationOffset = this.rotationOffset % skillsArray.length;
    let skillsToRotate: ElementRef[] = [];

    for (let i = 1; i < 6; i++) {
      const index = (i + this.rotationOffset) % skillsArray.length;
      skillsToRotate.push(skillsArray[index]);
    }

    // Move the left-most skill back to original position
    const elapsedSkill = skillsArray[this.rotationOffset].nativeElement;    
    this.renderer.addClass(elapsedSkill, 'hide');
    this.renderer.setStyle(elapsedSkill, 'transform', `translateX(0)`);
    elapsedSkill.offsetHeight; // Trigger reflow to ensure styles are applied immediately
    this.renderer.removeClass(elapsedSkill, 'hide');
    // skillsToRotate.splice(0, 1);

    // Rotate skills
    skillsToRotate.forEach((skill: ElementRef, i: number) => {
      this.shiftSkill(skill, i-1);
    });

    // Update rotation offset
    this.rotationOffset++;
  }

  shiftSkill(skill: ElementRef, index: number) {
    const dx = -(
      this.carouselWidth -
      (index * (this.skillWidth + 2 * this.skillPadding) + this.skillPadding)
    );

    this.renderer.setStyle(
      skill.nativeElement,
      'transform',
      `translateX(${dx}px)`
    );
  }

  setCarouselState(start: number = 0) {
    this.rotationOffset = start;
    this.updateCarouselMeasurements();

    this.skills.toArray().forEach((skill: ElementRef, i: number) => {
      this.renderer.addClass(skill.nativeElement, 'no-transform-transition');

      if (i >= start && i < start + 5) {
        // Show skill
        this.shiftSkill(skill, i - start - 1);
      } else {
        // Hide skill
        this.renderer.setStyle(
          skill.nativeElement,
          'transform',
          'translateX(0)'
        );
      }

      this.renderer.removeClass(skill.nativeElement, 'no-transform-transition');
    });
  }

  ngOnDestroy(): void {
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval);
    }
  }
}
