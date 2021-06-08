import createDomElement from '../../shared-functions/create-dom-element';
import raceModCarControlBlockParams from '../params/race-mod-car-control-block-params';

export default class RaceModCarControl {
  carControlContainer: HTMLElement;

  buttonSelect: HTMLElement;

  buttonRemove: HTMLElement;

  carTitle: HTMLElement;

  constructor(name: string) {
    this.carControlContainer = createDomElement(raceModCarControlBlockParams.container);
    this.buttonSelect = createDomElement(raceModCarControlBlockParams.buttonSelect);
    this.buttonRemove = createDomElement(raceModCarControlBlockParams.buttonRemove);
    this.carTitle = createDomElement(raceModCarControlBlockParams.carTitle);
    this.carTitle.innerText = name;

    this.carControlContainer.appendChild(this.buttonSelect);
    this.carControlContainer.appendChild(this.buttonRemove);
    this.carControlContainer.appendChild(this.carTitle);
  }

  updateCarTitle(name: string): void {
    this.carTitle.innerText = name;
  }
}
