export class SoundService {
  static playAlert() {
    const audio = new Audio("./alert.mp3");
    audio.play();
  }
}
