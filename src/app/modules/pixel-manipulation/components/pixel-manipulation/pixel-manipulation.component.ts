import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FileHelper} from "../../lib/helpers/file.helper";
import {CanvasHelper} from "../../lib/helpers/canvas.helper";
import {Actions} from "../../lib/enums/actions";

@Component({
  selector: 'app-pixel-manipulation',
  templateUrl: './pixel-manipulation.component.html',
  styleUrls: ['./pixel-manipulation.component.scss']
})
export class PixelManipulationComponent implements AfterViewInit {

  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('histogram') histogram!: ElementRef<HTMLCanvasElement>;

  //listen every change in canvas
  public Actions = Actions;
  public fileSelected: File | null = null;


  constructor() { }

  ngAfterViewInit(): void {
    this.canvas.nativeElement.width = 800;
    this.canvas.nativeElement.height = 600;
    CanvasHelper.paintEmptyCanvasGrid(this.canvas.nativeElement, 10, 10);
  }

  async restoreImage() {
    await CanvasHelper.paintFileOnCanvas(this.fileSelected!, this.canvas.nativeElement);
  }

  async saveImage() {
    await FileHelper.saveFile(this.canvas.nativeElement);
  }

  async multiplexAction(action: Actions, value?: any) {
    if (!this.fileSelected && action !== Actions.SELECT_FILE) {
      return window.alert('Please select a file first');
    }
    switch (action) {
      case Actions.SELECT_FILE:
        const file = await FileHelper.openFilePicker();
        await CanvasHelper.paintFileOnCanvas(file, this.canvas.nativeElement);
        this.fileSelected = file;
        break;
      case Actions.GRAYSCALE:
        CanvasHelper.grayscale(this.canvas.nativeElement);
        break;
      case Actions.INVERT:
        CanvasHelper.invert(this.canvas.nativeElement);
        break;
      case Actions.SHARPEN:
        const sharpenKernel = [
          [0, -1, 0],
          [-1, 5, -1],
          [0, -1, 0]
        ];
        CanvasHelper.convolution(this.canvas.nativeElement, sharpenKernel);
        break;
      case Actions.SEPIA:
        CanvasHelper.sepia(this.canvas.nativeElement);
        break;
      case Actions.VIGNETTE:
        CanvasHelper.vignette(this.canvas.nativeElement, value);
        break;
      case Actions.LIGHT_LEAKS:
        CanvasHelper.lightLeak(this.canvas.nativeElement, value, 50);
        break;
      case Actions.BLUR:
        CanvasHelper.gaussianBlur(this.canvas.nativeElement, value);
        break;
      case Actions.NOISE:
        CanvasHelper.filmGrain(this.canvas.nativeElement, value);
        break;
      case Actions.FRAGMENT:
        CanvasHelper.fragmentRotate(this.canvas.nativeElement, value);
        break;
      case Actions.CROP_CIRCLE:
        CanvasHelper.cropCircle(this.canvas.nativeElement);
        break;
    }
    CanvasHelper.histogramSeparate(this.canvas.nativeElement, this.histogram.nativeElement, 'all');
  }

}


