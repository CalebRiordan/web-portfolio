import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.css'],
})
export class AboutMeComponent {
  inView: boolean = false;

  @ViewChild('introduction') content!: ElementRef;

  @HostListener('window:scroll', ['$event']) onScrollIntoView(event: Event) { //listen for scroll event and watch 'introduction' template component
    const windowHeight = window.innerHeight;
    const elementRect = this.content.nativeElement.getBoundingClientRect();
    const elementCenterY = (elementRect.top + elementRect.bottom) / 2;  //get middle of component
    const elementInViewport =
      elementCenterY <= windowHeight && elementCenterY >= 0;
    const elementLeavesViewport = (elementRect.top + 300) >= windowHeight || (elementRect.bottom -300) <= 0; 
      //check that content (introduction container - padding) is completely outside of viewport
    
    if (elementInViewport) {  //depending on position of viewport, use [ngClass] to add or remove classes to manipulate which CSS is applied
      this.inView = true;
    } else if (elementLeavesViewport){
      this.inView = false;
    }
  }
}
