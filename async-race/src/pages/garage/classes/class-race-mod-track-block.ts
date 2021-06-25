import createDomElement from '../../shared-functions/create-dom-element';
import raceModTrackParams from '../params/race-mod-track-block-params';
import CarTrack from './class car-track';
import CarMoveController from './class-car-move-controller';

export default class RaceModTrackBlock {
  trackBlockContainer: HTMLElement;

  moveController: CarMoveController;

  moveControllerEl: HTMLElement;

  trackBlock: CarTrack;

  trackBlockEl: HTMLElement;

  constructor(color: string, id: number) {
    this.moveController = new CarMoveController();
    this.trackBlock = new CarTrack(color, id);

    this.trackBlockContainer = createDomElement(raceModTrackParams.container);
    this.moveControllerEl = this.moveController.container;
    this.trackBlockEl = this.trackBlock.container;

    this.trackBlockContainer.appendChild(this.moveControllerEl);
    this.trackBlockContainer.appendChild(this.trackBlockEl);
  }
}
