import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CreateProjectModel, Project, emptyProject } from 'app/models/project';
import { DataService } from 'app/services/data.service';
import { ProjectsService } from 'app/services/projects.service';
import { SnackbarService } from 'app/services/snackbar.service';
import { RippleEffectDirective } from 'app/directives/ripple-effect.directive';

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, RippleEffectDirective],
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css'],
})
export class EditProjectComponent implements OnInit {
  project: Project = emptyProject;
  projNum!: number;
  editProjectForm!: FormGroup;
  pagePurpose!: string;
  imgSrc: string = '';
  selectedImg: any;
  alreadyCompleted: boolean = false;

  formProcessing: boolean = false;

  @ViewChild('thumbnail') thumbnail!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private dataService: DataService,
    private projectService: ProjectsService,
    private sbService: SnackbarService
  ) {
    this.setupForm();
  }

  ngOnInit(): void {
    //Fetch route parameters 'projNum' and 'purpose'
    //Fetch the Project object from the dataService
    this.route.queryParams
      .subscribe((params) => {
        this.pagePurpose = params['purpose'];
        this.projNum = params['projNum'];
        if (this.dataService.projData) {
          this.project = this.dataService.projData;

          //if a thumbnail already exists, the project was completed already and there is no need to update the completion date
          if (this.project.thumbnailUrl != '') {
            this.alreadyCompleted = true;
          }
        }

        this.editProjectForm.setValue({
          name: this.project.name,
          description: this.project.description,
          thumbnail: this.project.thumbnailUrl,
          githubLink: this.project.githubLink,
          demoLink: this.project.demoLink,
        });
        this.imgSrc = this.project.thumbnailUrl;
      })
      .unsubscribe();
  }

  setupForm() {
    this.editProjectForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(25)]],
      description: ['', [Validators.required, Validators.maxLength(185)]],
      thumbnail: [''],
      githubLink: [''],
      demoLink: [''],
    });
  }

  //Method to fetch the value of the form control by form group name
  fcv(controlName: string): string {
    return this.editProjectForm.controls[controlName].value;
  }

  get fc() {
    return this.editProjectForm.controls;
  }

  onImageSelected(event: any) {
    const reader = new FileReader();
    //Read the contents of the specified Blob or File
    reader.readAsDataURL(event.target.files[0]);
    //Once the data is read, the result attribute contains the data as a long URL string
    reader.onload = (e) => {
      this.imgSrc = e.target?.result as string;
      //Object of image selection data
      this.selectedImg = event.target.files[0];
    };
  }

  onSubmit() {
    this.formProcessing = true;

    let newProjectModel = {} as CreateProjectModel;
    let newThumbnail: File | undefined = undefined;
    let dateCompleted: string = '';

    if (this.selectedImg) {
      newThumbnail = this.selectedImg;
      //A thumbnail being added means the project has just been completed, and therefore the dateCompleted will be the current data unless it was already completed before
    }
    this.alreadyCompleted
      ? (dateCompleted = this.project.dateCompleted)
      : (dateCompleted = new Date().toISOString().slice(0, 10));

    newProjectModel = {
      name: this.fcv('name'),
      description: this.fcv('description'),
      thumbnail: newThumbnail,
      dateCompleted: dateCompleted,
      githubLink: this.fcv('githubLink'),
      demoLink: this.fcv('demoLink'),
    };

    if (this.pagePurpose == 'edit') {
      this.projectService
        .updateProject(newProjectModel, this.projNum)
        .subscribe((res) => {
          this.formProcessing = false;
          this.router.navigate(['admin/dashboard']);
          this.sbService.generateSnackbar('Project udpated!');
        });
    } else if (this.pagePurpose == 'add') {
      //Add new project to database using projService
      this.projectService
        .addProject(newProjectModel, this.projNum)
        .subscribe((res) => {
          this.formProcessing = false;
          //redirect
          this.router.navigate(['admin/dashboard']);
          this.sbService.generateSnackbar('Project added!');
        });
    }
  }
}
