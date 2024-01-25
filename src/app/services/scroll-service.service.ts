import { ElementRef, Injectable } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  scrollIntoView(element: ElementRef){
    //make an observable from an event using 'fromEvent' to listen for scroll events
    const scroll$: Observable<Event> = fromEvent(window, 'scroll');

    return scroll$.pipe(
      map(() => this.isElementInView(element))
      );
  }

  isElementInView(element: ElementRef){
    const windowHeight = window.innerHeight;
    const elementRect = element.nativeElement.getBoundingClientRect();    
    return elementRect.top <= windowHeight && elementRect.bottom >= windowHeight; 
  }

}
