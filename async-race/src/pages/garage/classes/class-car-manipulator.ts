import createDomElement from '../../shared-functions/create-dom-element';
import ButtonsManipulatorBlock from './class-buttons-manipulator-block';
import CarManipulatorBlock from './class-car-manipulator-block';
import carManipulatorBlockParams from '../params/car-manipulator-block-params';

export default class CarManipulator {
  manipulatorContent: HTMLElement;

  createCarBlock: HTMLElement;

  updateCarBlock: HTMLElement;

  buttonsBlock: HTMLElement;

  constructor() {
    const createCarBlock = new CarManipulatorBlock(carManipulatorBlockParams.createCarBlock);
    const updateCarBlock = new CarManipulatorBlock(carManipulatorBlockParams.updateCarBlock);
    const buttonsBlock = new ButtonsManipulatorBlock(carManipulatorBlockParams.blockButtons);

    this.manipulatorContent = createDomElement(carManipulatorBlockParams.BlockContainer);
    this.createCarBlock = createCarBlock.blockContainer;
    this.updateCarBlock = updateCarBlock.blockContainer;
    this.buttonsBlock = buttonsBlock.blockContainer;

    this.manipulatorContent.appendChild(this.createCarBlock);
    this.manipulatorContent.appendChild(this.updateCarBlock);
    this.manipulatorContent.appendChild(this.buttonsBlock);
  }
}
