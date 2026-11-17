import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private isDarkMode = new BehaviorSubject<boolean>(
    !!localStorage.getItem('theme')
  );

  darkMode$ = this.isDarkMode.asObservable();

  constructor() {
    const theme = localStorage.getItem('theme');
    let isDarkMode = true; //default
    if (theme === 'light') {
      isDarkMode = false;
    } else if (theme !== 'dark') {
      console.error(`Unknown theme '${theme}'`);
    }

    this.applyTheme(isDarkMode);
  }

  toggleTheme() {
    this.applyTheme(!this.isDarkMode.getValue());
  }

  applyTheme(darkMode: boolean) {
    this.isDarkMode.next(darkMode);

    if (darkMode) {
      localStorage.setItem('theme', 'dark');
      //Dark mode colours:
      this.cssVar('--primary-colour', '27, 30, 43');
      this.cssVar('--secondary-colour', '5, 16, 27');
      this.cssVar('--highlight-colour', '255, 102, 0');
      this.cssVar('--text-colour', '255, 255, 255');
    } else {
      localStorage.setItem('theme', 'light');
      //Light mode colours:
      this.cssVar('--primary-colour', '255, 255, 255');
      this.cssVar('--secondary-colour', '215, 225, 225');
      this.cssVar('--highlight-colour', '0, 200, 140');
      this.cssVar('--text-colour', '10, 10, 30');
    }
  }

  private cssVar(property: string, value: string) {
    document.documentElement.style.setProperty(property, value);
  }
}
