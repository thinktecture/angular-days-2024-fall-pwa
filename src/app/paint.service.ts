import { Injectable } from '@angular/core';

interface Point {
    x: number;
    y: number;
}

@Injectable({
    providedIn: 'root'
})
export class PaintService {
    toBlob(canvas: HTMLCanvasElement): Promise<Blob> {
        return new Promise((resolve, reject) => {
            try {
                canvas.toBlob(blob => {
                    if (blob !== null) {
                        resolve(blob)
                    } else {
                        reject('Unable to create image.');
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    getImage(blob: Blob): Promise<HTMLImageElement | ImageBitmap> {
        if ('createImageBitmap' in window) {
            return createImageBitmap(blob);
        }

        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => {
                URL.revokeObjectURL(image.src);
                resolve(image);
            };
            image.onerror = () => reject();
            image.src = URL.createObjectURL(blob);
        });
    }

    * bresenhamLine(point1: Point, point2: Point): Generator<Point> {
        let x0 = Math.floor(point1.x);
        let y0 = Math.floor(point1.y);
        let x1 = Math.floor(point2.x);
        let y1 = Math.floor(point2.y);

        const dx = Math.abs(x1 - x0);
        const dy = Math.abs(y1 - y0);
        const sx = (x0 < x1) ? 1 : -1;
        const sy = (y0 < y1) ? 1 : -1;
        let err = dx - dy;

        while (true) {
            yield { x: x0, y: y0 };

            if (x0 === x1 && y0 === y1) {
                break;
            }
            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x0 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y0 += sy;
            }
        }
    }
}
