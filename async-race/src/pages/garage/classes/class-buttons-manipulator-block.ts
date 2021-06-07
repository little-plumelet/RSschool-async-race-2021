import createDomElement from '../../shared-functions/create-dom-element';
import { ImanipulatorBlockButtonsParam } from '../interfaces/car-manipulator-block-interface';

export default class ButtonsManipulatorBlock {
  blockContainer: HTMLElement;

  buttonRace: HTMLElement;

  buttonReset: HTMLElement;

  buttonCreateCars: HTMLElement;

  constructor(params: ImanipulatorBlockButtonsParam) {
    this.blockContainer = createDomElement(params.container);
    this.buttonRace = createDomElement(params.buttonRace);
    this.buttonReset = createDomElement(params.buttonReset);
    this.buttonCreateCars = createDomElement(params.buttonCreateBunchOfCars);

    this.blockContainer.appendChild(this.buttonRace);
    this.blockContainer.appendChild(this.buttonReset);
    this.blockContainer.appendChild(this.buttonCreateCars);
  }
}
