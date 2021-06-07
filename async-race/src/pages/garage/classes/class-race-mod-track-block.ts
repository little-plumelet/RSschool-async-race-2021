import createDomElement from '../../shared-functions/create-dom-element';
import raceModTrackParams from '../params/race-mod-track-block-params';
import CarTrack from './class car-track';
import CarMoveController from './class-car-move-controller';

export default class RaceModTrackBlock {
  trackBlockContainer: HTMLElement;

  moveController: HTMLElement;

  trackBlock: HTMLElement;

  constructor(color: string) {
    const moveController = new CarMoveController();
    const trackBlock = new CarTrack(color);

    this.trackBlockContainer = createDomElement(raceModTrackParams.container);
    this.moveController = moveController.container;
    this.trackBlock = trackBlock.container;

    this.trackBlockContainer.appendChild(this.moveController);
    this.trackBlockContainer.appendChild(this.trackBlock);
  }
}
