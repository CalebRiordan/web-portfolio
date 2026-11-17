import { ElementRef, Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, map, throttleTime } from 'rxjs/operators';
import { parseConfigFileTextToJson } from 'typescript';

export enum Anchor {
  TOP = 'top',
  CENTRE = 'centre',
  BOTTOM = 'bottom',
}

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  // Listen for scroll events using observable
  scroll$ = fromEvent(window, 'scroll');
  static readonly Anchor = Anchor;
  snapTimeout = false;

  scrollIntoView(element: ElementRef): Observable<boolean> {
    return this.scroll$.pipe(map(() => this.elementInView(element)));
  }

  elementInView(element: ElementRef): boolean {
    const windowHeight = window.innerHeight;
    const elementRect = element.nativeElement.getBoundingClientRect();
    return (
      elementRect.top <= windowHeight && elementRect.bottom >= windowHeight
    );
  }

  private elWithinScrollRange(
    elRect: any,
    offset: number,
    around: boolean = false
  ): boolean {
    const screenCenter = window.innerHeight / 2;
    const thresholdTop = screenCenter - offset;
    const thresholdBottom = screenCenter + offset;

    const topWithinProx =
      elRect.top <= thresholdBottom && elRect.top >= thresholdTop;
    const bottomWithinProx =
      around &&
      elRect.bottom <= thresholdBottom &&
      elRect.bottom >= thresholdTop;

    return topWithinProx || bottomWithinProx;
  }

  setScrollSnap(
    el: ElementRef,
    pxThresholdAroundScreenCentre: number = 100,
    anchor: Anchor | string = 'top',
    pxOffsetBelowAnchor: number = 0,
    detectAround: boolean = false
  ) {
    this.scroll$.pipe(debounceTime(100)).subscribe(() => {
      if (this.snapTimeout) return
      
      const elRect = el.nativeElement.getBoundingClientRect();
      let scrollPos = window.scrollY;

      // Check that element qualifies for scroll snap
      const elWithinProx = this.elWithinScrollRange(
        elRect,
        pxThresholdAroundScreenCentre,
        detectAround
      );

      if (elWithinProx) {
        // Calculate distance to scroll
        const initialOffset =
        window.scrollY - window.innerHeight + elRect.top - pxOffsetBelowAnchor;
        
        // Consider specified anchor in calc
        switch (anchor) {
          case Anchor.TOP:
            scrollPos = initialOffset + window.innerHeight;
            break;
          case Anchor.CENTRE:
            scrollPos = initialOffset + window.innerHeight / 2;
            break;
          case Anchor.BOTTOM:
            scrollPos = initialOffset;
            break;
          default:
            throw new Error(
              `Unknown anchor ${anchor}. Use 'Anchor' enum for predefined anchor literals`
            );
        }
        this.snapTimeout = true;

        // Finally, scroll
        window.scrollTo({
          top: scrollPos,
          behavior: 'smooth',
        });

        setTimeout(() => {
          this.snapTimeout = false;
        }, 1000);
      }
    });
  }
}
