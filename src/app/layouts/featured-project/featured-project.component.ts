import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project, emptyProject } from 'app/models/project';
import { RippleEffectDirective } from 'app/directives/ripple-effect.directive';
import { ResizeService } from 'app/services/resize.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-featured-project',
  standalone: true,
  imports: [CommonModule, RippleEffectDirective],
  templateUrl:  './featured-project.component.html',
    styleUrls: ['./featured-project.component.css']
})
export class FeaturedProjectComponent implements OnInit, OnChanges, OnDestroy {
  private layoutSubscription!: Subscription;

  inView: boolean = false;
  projOdd: Boolean = false;
  projectData!: Project;
  projNum!: number;
  thumbnailUrl: string = '';
  completionDate!: string;

  winWidth: any;
  isMobileScreen!: boolean;

  @Input() projInfo!: any[];
  @ViewChild('projectDisplay') content!: ElementRef;
  @ViewChild('thumbnail') thumbnail!: ElementRef;

  @HostListener('window:scroll', ['$event']) onScrollIntoView(event: Event) {
    // check if content is in view and update 'inView' variable
    const windowHeight = window.innerHeight;
    const elementRect = this.content.nativeElement.getBoundingClientRect();

    const elementInView = elementRect.bottom <= windowHeight;

    if (elementInView) {
      this.inView = true;
    } else {
      this.inView = false;
    }
  }

  constructor(private renderer: Renderer2, private resizer: ResizeService) {
    this.layoutSubscription = this.resizer.isSmallLayout$.subscribe(value => this.isMobileScreen = value)
  }

  ngOnInit(): void {
    this.projNum = this.projInfo[0];
    this.projectData = emptyProject;

    if (this.projectData.name == '') {
      //Project has not been planned yet
      this.projectData.name = 'Future Project';
      this.projectData.description =
        'This project has not been planned yet. Please visit my web page in the future to view my progress!';
    }

    this.projOdd = this.projNum % 2 == 1;
    this.winWidth = window.innerWidth;
    this.winWidth <= 820
      ? (this.isMobileScreen = true)
      : (this.isMobileScreen = false);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['projInfo']) {
      if (this.projInfo[1] == undefined) {
        this.projectData = emptyProject;
      } else {
        this.projectData = this.projInfo[1];
        if (this.projectData.dateCompleted != '') {
          this.completionDate = this.formatDate(this.projectData.dateCompleted);
          this.thumbnailUrl = this.projectData.thumbnailUrl;
          this.updateThumbnail();
        }
      }
    }
  }

  updateThumbnail() {
    if (this.thumbnailUrl != '') {
      this.renderer.setStyle(
        this.thumbnail.nativeElement,
        'background-image',
        `url(${this.thumbnailUrl})`
      );
    }
  }

  formatDate(inputDate: string): string {
    if (inputDate != '') {
      const dateObject = new Date(inputDate);

      const formattedDate = dateObject.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

      return formattedDate;
    } else return '';
  }

  onOpenRepo() {
    window.open(this.projectData.githubLink, '_blank');
  }

  onOpenDemo() {
    window.open(this.projectData.demoLink, '_blank');
  }

  ngOnDestroy(): void {
    this.layoutSubscription.unsubscribe();
  }  
}
