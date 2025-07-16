import {
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

@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [CommonModule, SkillsComponent, RippleEffectDirective],
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.css'],
})
export class AboutMeComponent implements OnInit {
  inView: boolean = false;
  private lightModeImage = new Image();
  private darkModeImage = new Image();
  imageUrl = this.lightModeImage.src;

  @ViewChild('introduction') content!: ElementRef;

  @HostListener('window:scroll', ['$event']) onScrollIntoView(event: Event) {
    //listen for scroll event and watch 'introduction' template component
    const windowHeight = window.innerHeight;
    const elementRect = this.content.nativeElement.getBoundingClientRect();
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

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.preloadImages();
    this.themeService.theme$.subscribe((isDarkMode) => {
      this.imageUrl = isDarkMode
        ? this.darkModeImage.src
        : this.lightModeImage.src;
    });
  }

  preloadImages() {
    this.lightModeImage.src = '../../../assets/images/cauldron_light_mode.png';
    this.darkModeImage.src = '../../../assets/images/cauldron.png';
  }
}
