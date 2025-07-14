import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ApiProject, CreateProjectModel, Project } from '../models/project';
import {
  Observable,
  catchError,
  map,
  throwError,
} from 'rxjs';
import { env } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  // =======================================================================================
  // ===  This service retrieves project data from the database through the backend API  ===
  // =======================================================================================

  constructor(private http: HttpClient) {}

  baseApiUrl: string = env.baseApiUrl;

  getProjects(): Observable<ApiProject[]> {
    return this.http.get<ApiProject[]>(`${this.baseApiUrl}/api/projects`).pipe(
      catchError((err) => { return throwError(() => err)})
    );
  }

  addProject(project: CreateProjectModel, projNum: number): Observable<Project> {

    // Put data in form for API to receive using [FromForm]
    const formData: FormData = new FormData();
    formData.append('Name', project.name);
    formData.append('Description', project.description);
    formData.append('DateCompleted', project.dateCompleted);
    formData.append('Thumbnail', project.thumbnail as Blob);
    formData.append('GithubUrl', project.githubLink);
    formData.append('DemoUrl', project.demoLink);
    
    let response = this.http.post<ApiProject>(
      `${this.baseApiUrl}/api/projects/${projNum}`,
      formData
    ).pipe(map(apiProject => this.convertApiToLocalProject(apiProject)));
    
    return response; //returns ProjectDto of created project
  }

  updateProject(project: CreateProjectModel, projNum: number): Observable<Project> {

    //Put data in form for API to receive using [FromForm]
    const formData: FormData = new FormData();
    formData.append('Name', project.name);
    formData.append('Description', project.description);
    formData.append('DateCompleted', project.dateCompleted);
    formData.append('Thumbnail', project.thumbnail as Blob);
    formData.append('GithubUrl', project.githubLink);
    formData.append('DemoUrl', project.demoLink);   

    let response = this.http.put<Project>(
      `${this.baseApiUrl}/api/Projects/${projNum}`,
      formData
    );
    return response; //returns ProjectDto of updated project
  }

  deleteProject(projNum: number): Observable<HttpResponse<any>> {
    return this.http
      .delete<any>(`${this.baseApiUrl}/api/projects/${projNum}`, {
        observe: 'response',
      })
  }


  convertApiToLocalProject(apiProject: ApiProject): Project{
    const project: Project = {
      name: apiProject.name,
      description: apiProject.description,
      dateCompleted: apiProject.dateCompleted,
      thumbnailUrl: apiProject.thumbnailUrl,
      githubLink: apiProject.githubUrl,
      demoLink: apiProject.demoUrl
    };

    return project
  }
}
