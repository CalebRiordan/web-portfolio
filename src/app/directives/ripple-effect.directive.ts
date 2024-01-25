import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appRippleEffect]'
})
export class RippleEffectDirective {

  constructor(private el: ElementRef) { }

  @HostListener('click') onClick() {
    const button = this.el.nativeElement;
    button.classList.add('ripple-effect');

    setTimeout(() => button.classList.remove('ripple-effect'), 300);
  }

}
