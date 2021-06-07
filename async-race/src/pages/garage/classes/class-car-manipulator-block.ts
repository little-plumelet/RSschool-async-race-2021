import createDomElement from '../../shared-functions/create-dom-element';
import { ImanipulatorBlockInputParam } from '../interfaces/car-manipulator-block-interface';

export default class CarManipulatorBlock {
  blockContainer: HTMLElement;

  carNameInput: HTMLElement;

  carColorInput: HTMLElement;

  button: HTMLElement;

  constructor(params: ImanipulatorBlockInputParam) {
    this.blockContainer = createDomElement(params.container);
    this.carNameInput = createDomElement(params.nameInput);
    this.carColorInput = createDomElement(params.colorInput);
    this.button = createDomElement(params.button);

    this.blockContainer.appendChild(this.carNameInput);
    this.blockContainer.appendChild(this.carColorInput);
    this.blockContainer.appendChild(this.button);
  }
}
