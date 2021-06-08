import createDomElement from '../../shared-functions/create-dom-element';
import raceModTrackParams from '../params/race-mod-track-block-params';
import iconCarSvg from '../../../shared/icon-car-svg';

export default class CarTrack {
  container: HTMLElement;

  carIconContainer: HTMLElement;

  finishPoint: HTMLElement;

  constructor(color: string) {
    this.container = createDomElement(raceModTrackParams.trackBlock.container);
    this.carIconContainer = createDomElement(raceModTrackParams.trackBlock.carIcon);
    this.createCarIcon(color);
    this.finishPoint = createDomElement(raceModTrackParams.trackBlock.finishPoint);

    this.container.appendChild(this.carIconContainer);
    this.container.appendChild(this.finishPoint);
  }

  createCarIcon(color: string): void {
    this.carIconContainer.innerHTML = iconCarSvg;
    this.carIconContainer.firstElementChild?.firstElementChild?.setAttribute('fill', color);
  }

  updateCarIconColor(color: string): void {
    this.carIconContainer.firstElementChild?.firstElementChild?.setAttribute('fill', color);
  }
}
