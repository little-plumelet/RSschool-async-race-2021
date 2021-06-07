import createDomElement from '../../shared-functions/create-dom-element';
import raceModTrackParams from '../params/race-mod-track-block-params';

export default class CarMoveController {
  container: HTMLElement;

  buttonStart: HTMLElement;

  buttonStop: HTMLElement;

  constructor() {
    this.container = createDomElement(raceModTrackParams.moveControlBlock.container);
    this.buttonStart = createDomElement(raceModTrackParams.moveControlBlock.startButton);
    this.buttonStop = createDomElement(raceModTrackParams.moveControlBlock.stopButton);

    this.container.appendChild(this.buttonStart);
    this.container.appendChild(this.buttonStop);
  }
}
