import {ColorHelper} from "./color.helper";

export class CanvasHelper {

  //Function to paint a File on a canvas
  public static async paintFileOnCanvas(file: File, canvas: HTMLCanvasElement): Promise<void> {
    return new Promise((resolve, reject) => {
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        resolve();
      };
      img.src = URL.createObjectURL(file);
    });
  }

  //Function to paint empty canvas grid (gray and white) like photoshop
  public static paintEmptyCanvasGrid(canvas: HTMLCanvasElement, width: number, height: number): void {
    //Initialize canvas width and height 100% of the parent
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    for (let x = 0; x <= canvas.width; x += width) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
    }
    for (let y = 0; y <= canvas.height; y += height) {
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
    }
    ctx.strokeStyle = '#ccc';
    ctx.stroke();
    ctx.beginPath();
    for (let x = 0; x <= canvas.width; x += width * 5) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
    }
    for (let y = 0; y <= canvas.height; y += height * 5) {
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
    }
    ctx.strokeStyle = '#aaa';
    ctx.stroke();

  }

  //Grayscale a canvas
  public static grayscale(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg;
      data[i + 1] = avg;
      data[i + 2] = avg;
    }
    ctx.putImageData(imageData, 0, 0);
  }

  //Invert a canvas
  public static invert(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
    }
    ctx.putImageData(imageData, 0, 0);
  }

  //Perform a convolution on a canvas
  public static convolution(canvas: HTMLCanvasElement, kernel: number[][]): void {
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const newData = new Uint8ClampedArray(data.length);
    for (let i = 0; i < data.length; i += 4) {
      let r = 0, g = 0, b = 0;
      for (let j = 0; j < kernel.length; j++) {
        for (let k = 0; k < kernel[j].length; k++) {
          const index = (i + (j * canvas.width * 4) + (k * 4));
          r += data[index] * kernel[j][k];
          g += data[index + 1] * kernel[j][k];
          b += data[index + 2] * kernel[j][k];
        }
      }
      newData[i] = r;
      newData[i + 1] = g;
      newData[i + 2] = b;
      newData[i + 3] = 255;
    }
    imageData.data.set(newData);
    ctx.putImageData(imageData, 0, 0);
  }

  //Function to gaussian blur a canvas starting from a radius centered on the pixel
  public static gaussianBlur(canvas: HTMLCanvasElement, radius: number): void {
    const kernel = this.getGaussianKernel(radius);
    this.convolution(canvas, kernel);
  }

  //Function to get a gaussian kernel
  private static getGaussianKernel(radius: number): number[][] {
    const kernel = [];
    const sigma = radius / 3;
    const twoSigmaSquare = 2 * sigma * sigma;
    const sigmaRoot = Math.sqrt(twoSigmaSquare * Math.PI);
    let sum = 0;
    for (let x = -radius; x <= radius; x++) {
      const current = [];
      for (let y = -radius; y <= radius; y++) {
        const exponent = (x * x + y * y) / twoSigmaSquare;
        const value = (1 / sigmaRoot) * Math.exp(-exponent);
        current.push(value);
        sum += value;
      }
      kernel.push(current);
    }
    for (let i = 0; i < kernel.length; i++) {
      for (let j = 0; j < kernel[i].length; j++) {
        kernel[i][j] /= sum;
      }
    }
    return kernel;
  }

  //Glitch style effect
  public static glitch(canvas: HTMLCanvasElement): void {
    //conserve random part of the image
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const newData = new Uint8ClampedArray(data.length);
    for (let i = 0; i < data.length; i += 4) {
      if (Math.random() > 0.5) {
        newData[i] = data[i];
        newData[i + 1] = data[i + 1];
        newData[i + 2] = data[i + 2];
        newData[i + 3] = data[i + 3];
      }else {
        //randomize the rest
        newData[i] = Math.random() * 255;
        newData[i + 1] = Math.random() * 255;
        newData[i + 2] = Math.random() * 255;
        newData[i + 3] = Math.random() * 255;
      }
    }
    imageData.data.set(newData);
    ctx.putImageData(imageData, 0, 0);

  }

  //function to fragment a canvas in slices and then reassemble it in a random order
  public static fragment(canvas: HTMLCanvasElement, slices: number): void {
    //conserve random part of the image
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const newData = new Uint8ClampedArray(data.length);
    const sliceWidth = canvas.width / slices;
    const sliceHeight = canvas.height / slices;
    const sliceData = [];
    for (let i = 0; i < slices; i++) {
      for (let j = 0; j < slices; j++) {
        const current = ctx.getImageData(i * sliceWidth, j * sliceHeight, sliceWidth, sliceHeight);
        sliceData.push(current);
      }

    }
    //shuffle the slice data
    for (let i = sliceData.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [sliceData[i], sliceData[j]] = [sliceData[j], sliceData[i]];
    }
    //reassemble the image
    for (let i = 0; i < slices; i++) {
      for (let j = 0; j < slices; j++) {
        const current = sliceData.pop()!;
        ctx.putImageData(current, i * sliceWidth, j * sliceHeight);
      }
    }
  }

  //Slice a canvas and then reassemble it in a random order with a random rotation
  public static fragmentRotate(canvas: HTMLCanvasElement, slices: number): void {
//conserve random part of the image
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const newData = new Uint8ClampedArray(data.length);
    const sliceWidth = canvas.width / slices;
    const sliceHeight = canvas.height / slices;
    const sliceData = [];
    for (let i = 0; i < slices; i++) {
      for (let j = 0; j < slices; j++) {
        const current = ctx.getImageData(i * sliceWidth, j * sliceHeight, sliceWidth, sliceHeight);
        sliceData.push(current);
      }

    }
    //shuffle the slice data
    for (let i = sliceData.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [sliceData[i], sliceData[j]] = [sliceData[j], sliceData[i]];
    }
    //reassemble the image
    for (let i = 0; i < slices; i++) {
      for (let j = 0; j < slices; j++) {
        const current = sliceData.pop()!;
        ctx.save();
        ctx.putImageData(current, i * sliceWidth, j * sliceHeight);
        ctx.translate(i * sliceWidth + sliceWidth / 2, j * sliceHeight + sliceHeight / 2);
        //rotate the image only if it is not the last slice
        if (i !== slices - 1 || j !== slices - 1) {
          //rotate the image exactly by 90 , 180 or 270 degrees
          ctx.rotate(Math.floor(Math.random() * 4) * Math.PI / 2);
        }
        ctx.translate(-(i * sliceWidth + sliceWidth / 2), -(j * sliceHeight + sliceHeight / 2));
        ctx.drawImage(canvas, i * sliceWidth, j * sliceHeight, sliceWidth, sliceHeight, i * sliceWidth, j * sliceHeight, sliceWidth, sliceHeight);
        ctx.restore();
      }
    }
  }

  //Function to apply sepia effect to a canvas
  public static sepia(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const red = data[i];
      const green = data[i + 1];
      const blue = data[i + 2];
      data[i] = (red * 0.393) + (green * 0.769) + (blue * 0.189);
      data[i + 1] = (red * 0.349) + (green * 0.686) + (blue * 0.168);
      data[i + 2] = (red * 0.272) + (green * 0.534) + (blue * 0.131);
    }
    ctx.putImageData(imageData, 0, 0);
  }

  //Function to apply film grain effect to a canvas
  public static filmGrain(canvas: HTMLCanvasElement, strength: number): void {
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const random = Math.random() * strength;
      data[i] += random;
      data[i + 1] += random;
      data[i + 2] += random;
    }
    ctx.putImageData(imageData, 0, 0);
  }

  //Function to apply a vignette effect to a canvas
  public static vignette(canvas: HTMLCanvasElement, radius: number): void {
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % canvas.width;
      const y = Math.floor((i / 4) / canvas.width);
      const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
      const intensity = 1 - (distance / radius);
      data[i] *= intensity;
      data[i + 1] *= intensity;
      data[i + 2] *= intensity;
    }
    ctx.putImageData(imageData, 0, 0);
  }

  //Function to apply Light leak effect to a canvas
  public static lightLeak(canvas: HTMLCanvasElement, side: string, strength: number): void {
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % canvas.width;
      const y = Math.floor((i / 4) / canvas.width);
      let intensity = 0;
      if (side === 'left') {
        intensity = 1 - (x / centerX);
      } else if (side === 'right') {
        intensity = 1 - ((canvas.width - x) / centerX);
      } else if (side === 'top') {
        intensity = 1 - (y / centerY);
      } else if (side === 'bottom') {
        intensity = 1 - ((canvas.height - y) / centerY);
      }
      data[i] += intensity * strength;
      data[i + 1] += intensity * strength;
      data[i + 2] += intensity * strength;
    }
    ctx.putImageData(imageData, 0, 0);
  }

  //Function to create hexagonal grid on a canvas
  public static hexagonalGrid(canvas: HTMLCanvasElement, color: string): void {
    //calculate the size of the hexagons
    const hexagonSize = canvas.width / 10;
    const ctx = canvas.getContext('2d')!;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    //draw the hexagons
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const x = i * hexagonSize;
        const y = j * hexagonSize;
        ctx.beginPath();
        ctx.moveTo(x + hexagonSize / 2, y);
        ctx.lineTo(x + hexagonSize, y + hexagonSize / 4);
        ctx.lineTo(x + hexagonSize, y + hexagonSize * 3 / 4);
        ctx.lineTo(x + hexagonSize / 2, y + hexagonSize);
        ctx.lineTo(x, y + hexagonSize * 3 / 4);
        ctx.lineTo(x, y + hexagonSize / 4);
        ctx.closePath();
        ctx.stroke();
      }
    }
  }

  //Function change temperature of a canvas
  public static temperature(canvas: HTMLCanvasElement, temperature: number): void {
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const red = data[i];
      const green = data[i + 1];
      const blue = data[i + 2];
      data[i] = red + temperature;
      data[i + 1] = green - temperature;
      data[i + 2] = blue - temperature;
    }
    ctx.putImageData(imageData, 0, 0);
  }

  //Function to crop a canvas with a circle shape and place it in the center of another canvas
  public static cropCircle(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext('2d')!;
    const ctx2 = document.createElement('canvas').getContext('2d')!;
    ctx2.canvas.width = canvas.width;
    ctx2.canvas.height = canvas.height;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2;
    ctx2.beginPath();
    ctx2.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx2.clip();
    ctx2.drawImage(canvas, 0, 0);
    setTimeout(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      //Copy the cropped image to the original canvas
      ctx.drawImage(ctx2.canvas, 0, 0);
    }, 100);
  }

  //function to graphic histogram of a canvas
  public static histogram(canvas: HTMLCanvasElement, histogram: HTMLCanvasElement): void {
    //Histogram canvas width should be 512 and height should be 256
    histogram.width = 512;
    histogram.height = 256;
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const histogramCtx = histogram.getContext('2d')!;
    histogramCtx.clearRect(0, 0, histogram.width, histogram.height);
    const red = new Array(256).fill(0);
    const green = new Array(256).fill(0);
    const blue = new Array(256).fill(0);
    for (let i = 0; i < data.length; i += 4) {
      red[data[i]]++;
      green[data[i + 1]]++;
      blue[data[i + 2]]++;
    }
    const max = Math.max(...red, ...green, ...blue);
    for (let i = 0; i < 256; i++) {
      histogramCtx.fillStyle = 'red';
      histogramCtx.fillRect(i * 2, 256 - (red[i] / max) * 256, 2, (red[i] / max) * 256);
      histogramCtx.fillStyle = 'green';
      histogramCtx.fillRect(i * 2, 256 - (green[i] / max) * 256, 2, (green[i] / max) * 256);
      histogramCtx.fillStyle = 'blue';
      histogramCtx.fillRect(i * 2, 256 - (blue[i] / max) * 256, 2, (blue[i] / max) * 256);
    }
  }

  // Graphical histogram of a canvas separated the channels can be red, green, blue or all
  public static histogramSeparate(canvas: HTMLCanvasElement, histogram: HTMLCanvasElement, channel: string): void {
    //Histogram canvas width should be 256 and height should be 256
    histogram.width = 256;
    histogram.height = 256;
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const histogramCtx = histogram.getContext('2d')!;
    histogramCtx.clearRect(0, 0, histogram.width, histogram.height);
    const red = new Array(256).fill(0);
    const green = new Array(256).fill(0);
    const blue = new Array(256).fill(0);
    for (let i = 0; i < data.length; i += 4) {
      red[data[i]]++;
      green[data[i + 1]]++;
      blue[data[i + 2]]++;
    }
    const max = Math.max(...red, ...green, ...blue);
    if (channel === 'red') {
      for (let i = 0; i < 256; i++) {
        histogramCtx.fillStyle = 'red';
        histogramCtx.fillRect(i, 256 - (red[i] / max) * 256, 1, (red[i] / max) * 256);
      }
    }
    if (channel === 'green') {
      for (let i = 0; i < 256; i++) {
        histogramCtx.fillStyle = 'green';
        histogramCtx.fillRect(i, 256 - (green[i] / max) * 256, 1, (green[i] / max) * 256);
      }
    }
    if (channel === 'blue') {
      for (let i = 0; i < 256; i++) {
        histogramCtx.fillStyle = 'blue';
        histogramCtx.fillRect(i, 256 - (blue[i] / max) * 256, 1, (blue[i] / max) * 256);
      }
    }
    if (channel === 'all') {
      for (let i = 0; i < 256; i++) {
        histogramCtx.fillStyle = 'red';
        histogramCtx.fillRect(i, 256 - (red[i] / max) * 256, 1, (red[i] / max) * 256);
        histogramCtx.fillStyle = 'green';
        histogramCtx.fillRect(i, 256 - (green[i] / max) * 256, 1, (green[i] / max) * 256);
        histogramCtx.fillStyle = 'blue';
        histogramCtx.fillRect(i, 256 - (blue[i] / max) * 256, 1, (blue[i] / max) * 256);
      }
    }

  }

}
