import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillsComponent } from '../skills/skills.component';
import { ThemeService } from 'app/services/theme.service';
import { RippleEffectDirective } from 'app/directives/ripple-effect.directive';
import { ScrollService } from 'app/services/scroll-service.service';

@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [CommonModule, SkillsComponent, RippleEffectDirective],
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.css'],
})
export class AboutMeComponent implements OnInit, AfterViewInit {
  inView: boolean = false;
  private lightModeImage = new Image();
  private darkModeImage = new Image();
  imageUrl = this.darkModeImage.src;

  @ViewChild('introduction') introduction!: ElementRef;
  @ViewChild('content') content!: ElementRef;

  @HostListener('window:scroll', ['$event']) onScrollIntoView(event: Event) {
    //listen for scroll event and watch 'introduction' template component
    const windowHeight = window.innerHeight;
    const elementRect = this.introduction.nativeElement.getBoundingClientRect();
    const elementCenterY = (elementRect.top + elementRect.bottom) / 2; //get middle of component
    const elementInViewport =
      elementCenterY <= windowHeight && elementCenterY >= 0;
    const elementLeavesViewport =
      elementRect.top + 300 >= windowHeight || elementRect.bottom - 300 <= 0;

    if (elementInViewport) {
      //depending on position of viewport, use [ngClass] to add or remove classes to manipulate which CSS is applied
      this.inView = true;
    } else if (elementLeavesViewport) {
      this.inView = false;
    }
  }

  constructor(
    private themeService: ThemeService,
    private scrollService: ScrollService
  ) {}

  ngOnInit(): void {
    this.preloadImages();

    // Listen for theme change
    this.themeService.darkMode$.subscribe((val) => {
      this.imageUrl = val ? this.darkModeImage.src : this.lightModeImage.src;
    });
  }

  ngAfterViewInit() {
    const contentScollOffset = -(this.content.nativeElement.offsetHeight / 2 - 35);

    this.scrollService.setScrollSnap(
      this.content,
      60,
      ScrollService.Anchor.CENTRE,
      contentScollOffset
    );
  }

  preloadImages() {
    this.lightModeImage.src = '../../../assets/images/cauldron_light_mode.png';
    this.darkModeImage.src = '../../../assets/images/cauldron.png';
  }
}
