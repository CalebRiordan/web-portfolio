import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project, emptyProject } from 'app/models/project';
import { ProjectsService } from 'app/services/projects.service';
import { ScrollService } from 'app/services/scroll-service.service';
import { FeaturedProjectComponent } from '../featured-project/featured-project.component';
import { EMPTY, mergeMap, timer } from 'rxjs';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [FeaturedProjectComponent, CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements AfterViewInit {
  private currentProjectInView = 0;
  private scrollDebounce = false;
  showFillerLine: boolean = false;
  projects: Project[] = [
    emptyProject,
    emptyProject,
    emptyProject,
    emptyProject,
  ];

  @ViewChild('projectsContainer') projContainer!: ElementRef;
  @ViewChild('lineFiller') lineFiller!: ElementRef;
  @ViewChildren('linePanel') linePanels!: QueryList<ElementRef>;
  @ViewChildren('project') projectSections!: QueryList<ElementRef>;

  constructor(
    private scrollService: ScrollService,
    private projService: ProjectsService,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef
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
    this.determineCurrentProject();

    // Subscribe to scroll$ event observable
    this.scrollService.scroll$
      .pipe(
        mergeMap(() => {
          return !this.scrollDebounce &&
            this.projectsInView() &&
            this.moveToAdjacentProject()
            ? timer(300)
            : EMPTY;
        })
      )
      .subscribe(() => {
        this.scrollDebounce = false;
      });
  }

  private determineCurrentProject() {
    if (this.projectsInView()) {
      const linePanels = this.linePanels.toArray();
      let i = this.currentProjectInView;

      while (i < 3 && this.passedProjectThreshold(linePanels[i])) {
        this.currentProjectInView++;
        i++;
      }
      this.moveToProject(i);
    }
  }

  private moveToAdjacentProject() {
    const linePanels = this.linePanels.toArray();
    const i = this.currentProjectInView;

    // Should move to next project?
    if (i < 3 && this.passedProjectThreshold(linePanels[i])) {
      this.currentProjectInView++;
      this.moveToProject(i + 1);
      this.scrollDebounce = true;
      return true;
    } 
    
    // Should move to previous project?
    if (i > 0 && !this.passedProjectThreshold(linePanels[i - 1])) {
      this.currentProjectInView--;
      this.moveToProject(i - 1);
      this.scrollDebounce = true;
      return true;
    }

    return false;
  }

  private passedProjectThreshold(linePanel: ElementRef): boolean {
    // Determine if threshold of linePanel is below the centre of the screen
    const threshold =
      linePanel.nativeElement.getBoundingClientRect().top +
      linePanel.nativeElement.offsetHeight / 4;

    return threshold < window.innerHeight / 2;
  }

  private moveToProject(index: number) {
    // Calculate new height of line filler element
    const containerRect =
      this.projContainer.nativeElement.getBoundingClientRect();
    const currentProjSectionRect = this.projectSections
      .toArray()
      [index].nativeElement.getBoundingClientRect();
    const line = this.lineFiller.nativeElement;
    const newHeight = currentProjSectionRect.top - containerRect.top;

    // Apply new height
    this.renderer.setStyle(line, 'height', `${newHeight}px`);
  }

  projectsInView() {
    const projContainerRect =
      this.projContainer.nativeElement.getBoundingClientRect();
    const showFillerLinePrevious = this.showFillerLine;
    this.showFillerLine = projContainerRect.top <= window.innerHeight * 0.5;

    if (this.showFillerLine != showFillerLinePrevious) {
      this.cdr.detectChanges(); // Trigger change detection if showFillerLine changed
    }

    return this.showFillerLine;
  }
}
