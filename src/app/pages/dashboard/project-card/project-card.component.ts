import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Project } from 'app/models/project';
import { DataService } from 'app/services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'app/layouts/confirmation-dialog/confirmation-dialog.component';
import { Observable } from 'rxjs';
import { ProjectsService } from 'app/services/projects.service';
import { SnackbarService } from 'app/services/snackbar.service';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css'],
})
export class ProjectCardComponent implements OnInit, AfterViewInit {
  thumbnailUrl: string = '';
  completionDate: string = '';
  desc!: string;

  // Process projectData.description to see if it is over a certain character count. If so, truncate it and add '...' to the end

  @Input() projNum!: number;
  @Input() project!: Project;
  @ViewChild('thumbnail') thumbnail!: ElementRef;

  constructor(
    private projService: ProjectsService,
    private renderer: Renderer2,
    private router: Router,
    private dataService: DataService,
    private dialog: MatDialog,
    private sbService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.thumbnailUrl = this.project.thumbnailUrl;
    this.completionDate = this.formatDate(this.project.dateCompleted);
    this.desc = this.truncateDescription(this.project.description);
  }

  ngAfterViewInit(): void {
    if (this.thumbnailUrl != '') {
      this.renderer.setStyle(
        this.thumbnail.nativeElement,
        'background-image',
        `url(${this.thumbnailUrl})`
      );
    }
  }

  onAddProject() {
    this.router.navigate(['admin/edit-project'], {
      queryParams: { purpose: 'add', projNum: this.projNum },
    });
    this.dataService.projData = this.project;
  }

  onEditProject() {
    this.router.navigate(['admin/edit-project'], {
      queryParams: { purpose: 'edit', projNum: this.projNum },
    });
    this.dataService.projData = this.project;
  }

  onDeleteProject() {
    this.openConfirmationDialog().subscribe((result) => {
      if (result) {
        //'Yes'
        this.projService.deleteProject(this.projNum).subscribe((res) => {
          if (res.status == 200) {
            window.location.reload();
            this.sbService.generateSnackbar('Project deleted!');
          }
        });
      }
    });
  }

  openConfirmationDialog(): Observable<any> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'dialog-background',
      width: '700px',
      height: '300px',
      data: {
        message: `Are you sure you want to delete project ${this.projNum}?`,
      },
    });

    return dialogRef.afterClosed();
  }

  //Convert date from string 'yyyy-MM-dd' to 'dd MMM yyyy'
  formatDate(inputDate: string): string {
    const dateObject = new Date(inputDate);

    const formattedDate = dateObject.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    return formattedDate;
  }

  truncateDescription(desc: string) {
    if (desc.length > 120) {
      desc = desc.substring(0, 120) + '...';
      return desc;
    }
    return desc;
  }
}
