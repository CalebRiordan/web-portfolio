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
  sigImg = new Image();
  baseSigImgPath: string = '/assets/logos/';

  @Input() forPage!: string;

  constructor(private auth: AuthService, private themeService: ThemeService) {}

  ngOnInit(): void {
    if (this.forPage == 'dashboard' && this.auth.isLoggedIn == true) {
      this.showProfileIcon = true;
    }

    this.preloadImages();

    this.themeService.darkMode$.subscribe((val) => {
      this.sigImg.src = val
        ? `${this.baseSigImgPath}sig_white.png`
        : `${this.baseSigImgPath}sig_darkblue.png`;
    });
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
  }
  
  preloadImages() {
    this.sigImg.src = '../../../assets/images/cauldron_light_mode.png';
    this.sigImg.src = '../../../assets/images/cauldron.png';
  }
}
