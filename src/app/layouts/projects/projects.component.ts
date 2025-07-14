import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project, emptyProject } from 'app/models/project';
import { ProjectsService } from 'app/services/projects.service';
import { ScrollService } from 'app/services/scroll-service.service';
import { FeaturedProjectComponent } from '../featured-project/featured-project.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [FeaturedProjectComponent, CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit, AfterViewInit {
  showFillerLine: boolean = false;
  projects: Project[] = [
    emptyProject,
    emptyProject,
    emptyProject,
    emptyProject,
  ];

  @ViewChild('projectsContainer') projContainer!: ElementRef;

  @HostListener('window:scroll', ['$event']) onScrollIntoSection(event: Event) {
    const projContainerRect =
      this.projContainer.nativeElement.getBoundingClientRect();

    if (projContainerRect.top <= window.innerHeight * 0.55 - 300) {
      // see if the distance between the top of the screen and the bottom of first project container is less than the height of the line-filler
      this.showFillerLine = true;
    } else {
      this.showFillerLine = false;
    }
  }

  constructor(
    private scrollService: ScrollService,
    private projService: ProjectsService,
    private ref: ChangeDetectorRef
  ) {
    this.projService.getProjects().subscribe((res) => {
      if (res) {
        //Map values of API Project model to local Project model
        this.projects = res.map((apiProject) =>
          this.projService.convertApiToLocalProject(apiProject)
        );
      }
    });
  }

  ngAfterViewInit(): void {
    this.scrollService
      .scrollIntoView(this.projContainer)
      .subscribe((isInView) => {
        if (isInView) {
          document.documentElement.style.scrollSnapType = 'Y mandatory';
        } else {
          document.documentElement.style.scrollSnapType = 'Y proximity';
        }
      });
  }

  ngOnInit(): void {}
}
