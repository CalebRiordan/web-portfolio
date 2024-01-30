import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  isDarkMode: boolean = !!localStorage.getItem('dark_mode');

  constructor() {
    localStorage.setItem('dark_mode', 'true');
    this.isDarkMode = !!localStorage.getItem('dark_mode');
    this.applyTheme();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
  }

  applyTheme() {
    if (this.isDarkMode) {
      localStorage.setItem('dark_mode', 'true');
      //Dark mode colours:
      document.documentElement.style.setProperty(
        '--primary-colour',
        '27, 30, 43'
      );
      document.documentElement.style.setProperty(
        '--secondary-colour',
        '5, 16, 27'
      );
      document.documentElement.style.setProperty(
        '--highlight-colour',
        '255, 102, 0'
      );
      document.documentElement.style.setProperty(
        '--text-colour',
        '255, 255, 255'
      );
    } else {
      localStorage.removeItem('dark_mode');
      //Light mode colours:
      document.documentElement.style.setProperty(
        '--primary-colour',
        '255, 255, 255'
      );
      document.documentElement.style.setProperty(
        '--secondary-colour',
        '215, 225, 225'
      );
      document.documentElement.style.setProperty(
        '--highlight-colour',
        '0, 200, 140'
      );
      document.documentElement.style.setProperty('--text-colour', '10, 10, 30');
    }
  }
}
