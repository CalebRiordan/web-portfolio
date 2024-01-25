import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  sidePanelActive: boolean = false;
  showProfileIcon: boolean = false;
  signOutDropdownActive: boolean = false;

  @Input() forPage!: string;

  constructor(private auth: AuthService){}

  ngOnInit(): void {
    if (this.forPage == "dashboard" && this.auth.isLoggedIn == true){
      this.showProfileIcon = true;
    } 
  }

  toggleSidePanel(){
    this.sidePanelActive = !this.sidePanelActive;
  }

  toggleSignOutDropdown(){
    this.signOutDropdownActive = !this.signOutDropdownActive;
  }

  onSignoutClick(){
    if (this.auth.isLoggedIn) this.auth.logOut();
  }

}
