import { Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../models/project';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly localStorageKey = 'projData';

  get projData(): Project | null {
    const storedData = localStorage.getItem(this.localStorageKey);
    return storedData ? JSON.parse(storedData) : null;
  }

  set projData(data: Project | null) {
    localStorage.setItem(this.localStorageKey, JSON.stringify(data));
  }
}
