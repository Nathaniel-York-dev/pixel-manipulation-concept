export class FileHelper {

  public static async openFilePicker(): Promise<File> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.multiple = false;
      input.onchange = (event: any) => {
        resolve(event.target.files[0]);
      };
      input.click();
    });
  }

  public static async saveFile(canvas: HTMLCanvasElement): Promise<void> {
    const link = document.createElement('a');
    link.download = 'image.png';
    link.href = canvas.toDataURL();
    link.click();
  }

}
