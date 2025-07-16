import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, fromEvent, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResizeService {
  isRegularLayout$ = new BehaviorSubject<boolean>(this.isRegularScreen());
  isMediumLayout$ = new BehaviorSubject<boolean>(this.isMediumScreen());
  isSmallLayout$ = new BehaviorSubject<boolean>(this.isSmallScreen());

  resize$!: Observable<Event>;

  constructor() {
    this.resize$ = fromEvent(window, 'resize').pipe(debounceTime(300));
    this.resize$.subscribe(() => this.evaluateLayout());
  }

  private evaluateLayout() {
    this.isRegularLayout$.next(this.isRegularScreen());
    this.isMediumLayout$.next(this.isMediumScreen());
    this.isSmallLayout$.next(this.isSmallScreen());
  }

  private isSmallScreen() {
    return window.innerWidth <= 820;
  }

  private isMediumScreen() {
    return window.innerWidth > 820 && window.innerWidth <= 1300;
  }

  private isRegularScreen() {
    return window.innerWidth > 1300;
  }
}
