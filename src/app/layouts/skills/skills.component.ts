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
import { RippleEffectDirective } from 'app/directives/ripple-effect.directive';
import { ResizeService } from 'app/services/resize.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, RippleEffectDirective],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css'],
})
export class SkillsComponent implements AfterViewInit, OnDestroy {
  private cvUrl: string = 'assets/Caleb Riordan - Curriculum Vitae.pdf';

  // Carousel variables
  private resizeSubscription!: Subscription;
  private layoutSubscription!: Subscription;
  carouselWidth!: number;
  rotationOffset = 0;
  rotationInterval!: any;
  numActiveItems = 4;
  skillPadding!: number;
  skillWidth!: number;
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

  constructor(private renderer: Renderer2, private resizer: ResizeService) {}

  ngAfterViewInit(): void {
    // Set up resize observer to update carousel measurements
    this.resizeSubscription = this.resizer.resize$.subscribe(() =>
      this.updateCarouselMeasurements()
    );

    // Update number of items visible on carousel
    this.layoutSubscription = this.resizer.isSmallLayout$.subscribe(
      (isMobileLayout) => {        
        this.numActiveItems = isMobileLayout ? 3 : 4;
        this.setCarouselState(this.rotationOffset);
        this.setCarouselTimer();
      }
    );
  }

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
    }, 200);
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
      }, 200);
    }, 200);
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
    this.skillPadding = this.carouselWidth * 0.02;
    this.skillWidth =
      this.carouselWidth * (1 / this.numActiveItems - 2 * 0.02);

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
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval);
    }
    this.rotationInterval = setInterval(() => {
      if (this.rotationActive) {
        this.rotateSkills();
      }
    }, 2000);
  }

  setCarouselState(start: number = 0) {
    this.rotationOffset = start;
    this.updateCarouselMeasurements();
    const skillsArray = this.skills.toArray();

    skillsArray.forEach((skill: ElementRef, i: number) => {
      this.renderer.addClass(skill.nativeElement, 'no-transform-transition');

      for (let j = start; j <= start + this.numActiveItems; j++) {
        if (i === j % skillsArray.length) {
          // Show skill
          this.shiftSkill(skill, j - start - 1);
          break;
        } else {
          // Hide skill
          this.renderer.setStyle(
            skill.nativeElement,
            'transform',
            'translateX(0)'
          );
        }
      }
      this.renderer.removeClass(skill.nativeElement, 'no-transform-transition');
    });
  }

  rotateSkills() {
    const skillsArray = this.skills.toArray();
    this.rotationOffset = this.rotationOffset % skillsArray.length;
    let skillsToRotate: ElementRef[] = [];

    for (let i = 1; i <= this.numActiveItems + 1; i++) {
      const index = (i + this.rotationOffset) % skillsArray.length;
      skillsToRotate.push(skillsArray[index]);
    }

    // Move the left-most skill back to original position
    const elapsedSkill = skillsArray[this.rotationOffset].nativeElement;
    this.renderer.addClass(elapsedSkill, 'hide');
    this.renderer.setStyle(elapsedSkill, 'transform', `translateX(0)`);
    elapsedSkill.offsetHeight; // Trigger reflow to ensure styles are applied immediately
    this.renderer.removeClass(elapsedSkill, 'hide');

    // Rotate skills
    skillsToRotate.forEach((skill: ElementRef, i: number) => {
      this.shiftSkill(skill, i - 1);
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

  ngOnDestroy(): void {
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval);
    }
    this.resizeSubscription.unsubscribe();
    this.layoutSubscription.unsubscribe();
  }
}
