import { Directive, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Directive({ selector: '[appRippleEffect]' })
export class RippleEffectDirective {

  constructor(private el: ElementRef) { }

  @HostListener('click') onClick() {
    const button = this.el.nativeElement;
    button.classList.add('ripple-effect');

    setTimeout(() => button.classList.remove('ripple-effect'), 300);
  }

}
