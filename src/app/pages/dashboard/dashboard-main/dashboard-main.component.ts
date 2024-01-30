import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/layouts/confirmation-dialog/confirmation-dialog.component';
import { Message } from 'src/app/models/message';
import { Project, emptyProject } from 'src/app/models/project';
import { MessagesService } from 'src/app/services/messages.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-dashboard-main',
  templateUrl: './dashboard-main.component.html',
  styleUrls: ['./dashboard-main.component.css']
})
export class DashboardMainComponent implements OnInit{
  projects: Project[] = [];
  messages: Message[] = [];
  fetchProjectsApiFailed: boolean = false;
  fetchMessagesApiFailed: boolean = false;
  noMessages: boolean = false;

  constructor(private projService: ProjectsService, private messageService: MessagesService, private dialog: MatDialog, private sbService: SnackbarService){}

  ngOnInit(): void {
    //fetch an array of projects and messagtes from API
    this.fetchAllProjects();
    this.fetchAllMessages();
  }

  fetchAllProjects(){
    this.projService.getProjects().subscribe({
      next: (res) => {
        //Map values of API Project model to local Project model
        this.projects = res.map(apiProject => this.projService.convertApiToLocalProject(apiProject));
        
        if (this.projects.length < 4){
          this.projects = [...this.projects, emptyProject];
        }
      }, error: (e) => {
        this.fetchProjectsApiFailed = true;
      }
    });    
  }

  fetchAllMessages(){
    this.messageService.getMessages().subscribe({
      next: (res) => {
        this.messages = res;
        if (this.messages.length == 0) this.noMessages = true;
      },
      error: (e) => {
        this.fetchMessagesApiFailed = true;        
      }
    });
  }

  onDeleteMessage(id: string, name: string){
    this.openConfirmationDialog(name).subscribe(result => {
      if (result){
        //'Yes' 
        this.messageService.deleteMessage(id).subscribe(res => {
          if (res.status == 200){
            window.location.reload();

            this.sbService.generateSnackbar("Message deleted");
          }
        }
        );
      }
    });
  }

  openConfirmationDialog(name: string): Observable<any> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: "dialog-background",
      width: '700px',
      height: '300px',
      data: { message: `Are you sure you want to delete this message from ${name}?` }
    });

    return dialogRef.afterClosed();
  }

}
