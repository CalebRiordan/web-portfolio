import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'app/services/auth.service';
import { ThemeService } from 'app/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  sidePanelActive: boolean = false;
  showProfileIcon: boolean = false;
  signOutDropdownActive: boolean = false;
  sigImg!: string;
  baseSigImgPath: string = '/assets/logos/';

  @Input() forPage!: string;

  constructor(private auth: AuthService, private themeService: ThemeService) {
    this.themeService.isDarkMode
      ? (this.sigImg = `${this.baseSigImgPath}sig_white.png`)
      : (this.sigImg = `${this.baseSigImgPath}sig_darkblue.png`);
  }

  ngOnInit(): void {
    if (this.forPage == 'dashboard' && this.auth.isLoggedIn == true) {
      this.showProfileIcon = true;
    }
  }

  toggleSidePanel() {
    this.sidePanelActive = !this.sidePanelActive;
  }

  toggleSignOutDropdown() {
    this.signOutDropdownActive = !this.signOutDropdownActive;
  }

  onSignoutClick() {
    if (this.auth.isLoggedIn) this.auth.logOut();
  }

  onToggleLightMode() {
    this.themeService.toggleTheme();
    this.themeService.isDarkMode
      ? (this.sigImg = `${this.baseSigImgPath}sig_white.png`)
      : (this.sigImg = `${this.baseSigImgPath}sig_darkblue.png`);
  }
}
