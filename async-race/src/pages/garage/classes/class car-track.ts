import createDomElement from '../../shared-functions/create-dom-element';
import raceModTrackParams from '../params/race-mod-track-block-params';
import iconCarSvg from '../../../shared/icon-car-svg';

export default class CarTrack {
  container: HTMLElement;

  carIconContainer: HTMLElement;

  finishPointContainer: HTMLElement;

  finishPoint: HTMLElement;

  velosityPoint: HTMLElement;

  constructor(color: string, id: number) {
    this.container = createDomElement(raceModTrackParams.trackBlock.container);
    this.carIconContainer = createDomElement(raceModTrackParams.trackBlock.carIcon);
    this.createCarIcon(color, id);
    this.finishPointContainer = createDomElement(
      raceModTrackParams.trackBlock.finishPointContainer,
    );
    this.finishPoint = createDomElement(raceModTrackParams.trackBlock.finishPoint);
    this.velosityPoint = createDomElement(raceModTrackParams.trackBlock.velocityPoint);
    this.velosityPoint.setAttribute('id', `velosity-${id}`);

    this.container.appendChild(this.carIconContainer);
    this.container.appendChild(this.finishPointContainer);
    this.finishPointContainer.appendChild(this.finishPoint);
    this.finishPointContainer.appendChild(this.velosityPoint);
  }

  createCarIcon(color: string, id: number): void {
    this.carIconContainer.innerHTML = iconCarSvg;
    this.carIconContainer.setAttribute('id', `car-icon-${id}`);
    this.carIconContainer.firstElementChild?.firstElementChild?.setAttribute('fill', color);
  }

  updateCarIconColor(color: string): void {
    this.carIconContainer.firstElementChild?.firstElementChild?.setAttribute('fill', color);
  }
}
