import { AfterViewInit, Component, ElementRef, inject, viewChild, ViewChild } from '@angular/core';
import { PaintService } from "./paint.service";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  private readonly paintService = inject(PaintService);

  // LAB #1
  canvas = viewChild
      .required<ElementRef<HTMLCanvasElement>>('canvas');
  // LAB #2.1
  context!: CanvasRenderingContext2D;
  // LAB #5
  previousPoint?: { x: number, y: number };
  // LAB #11
  readonly fileOptions: FilePickerOptions = {
    types: [{
      description: 'PNG files',
      accept: {'image/png': ['.png']}
    }]
  };
  // LAB #17

  ngAfterViewInit(): void {
    // LAB #2.2, 2.3 and 3
    const canvas = this.canvas().nativeElement;
    const ctx = canvas.getContext('2d', {
      desynchronized: true
    })!;
    this.context = ctx;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    // LAB #16
  }

  onPointerDown(event: PointerEvent) {
    // LAB #5
    this.previousPoint = { x: event.offsetX, y: event.offsetY };
  }

  onPointerMove(event: PointerEvent) {
    // LAB #4 and 5
    if (this.previousPoint) {
      const currentPoint = { x: event.offsetX, y: event.offsetY };
      for (const point of this.paintService.bresenhamLine(this.previousPoint, currentPoint)) {
        this.context.fillRect(point.x, point.y, 2, 2);
      }
      this.previousPoint = currentPoint;
    }
  }

  onPointerUp() {
    // LAB #5
    this.previousPoint = undefined;
  }

  onColorChange(color: HTMLInputElement) {
    // LAB #6
    this.context.fillStyle = color.value;
  }

  async open() {
    // LAB #12
    const [handle] = await window.showOpenFilePicker(this.fileOptions);
    const file = await handle.getFile();
    const image = await this.paintService.getImage(file);
    this.context.drawImage(image, 0, 0);
  }

  async save() {
    // LAB #11
    const blob = await this.paintService.toBlob(this.canvas().nativeElement);
    const handle = await window.showSaveFilePicker(this.fileOptions);
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
  }

  async copy() {
    // LAB #13
  }

  async paste() {
    // LAB #14
  }

  async share() {
    // LAB #15
  }
}
