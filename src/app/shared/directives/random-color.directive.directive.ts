import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appRandomColorDirective]',
  standalone: true
})
export class RandomColorDirectiveDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    const randomColor = this.tagColorPicker();
    this.renderer.setStyle(this.el.nativeElement, 'color', randomColor);
  }

  private tagColorPicker(): string {
    let randomColor: string[] = ["primary", "accent", "warn", "link"];
    const randomIndex = Math.floor(Math.random() * randomColor.length);
    return randomColor[randomIndex];
  }

}
