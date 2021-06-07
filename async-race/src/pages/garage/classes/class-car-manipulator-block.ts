import createDomElement from '../../shared-functions/create-dom-element';
import { ImanipulatorBlockInputParam } from '../interfaces/car-manipulator-block-interface';

export default class CarManipulatorBlock {
  blockContainer: HTMLElement;

  carName: HTMLElement;

  carColor: HTMLElement;

  button: HTMLElement;

  constructor(params: ImanipulatorBlockInputParam) {
    this.blockContainer = createDomElement(params.container);
    this.carName = createDomElement(params.nameInput);
    this.carColor = createDomElement(params.colorInput);
    this.button = createDomElement(params.button);

    this.blockContainer.appendChild(this.carName);
    this.blockContainer.appendChild(this.carColor);
    this.blockContainer.appendChild(this.button);
  }
}
