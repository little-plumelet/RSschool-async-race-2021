import createDomElement from '../../shared-functions/create-dom-element';
import ButtonsManipulatorBlock from './class-buttons-manipulator-block';
import CarManipulatorBlock from './class-car-manipulator-block';
import carManipulatorBlockParams from '../params/car-manipulator-block-params';

export default class CarManipulator {
  manipulatorContent: HTMLElement;

  createCarBlock: HTMLElement;

  updateCarBlock: CarManipulatorBlock;

  updateCarBlockEl: HTMLElement;

  buttonsBlock: HTMLElement;

  constructor() {
    const createCarBlock = new CarManipulatorBlock(carManipulatorBlockParams.createCarBlock);
    this.updateCarBlock = new CarManipulatorBlock(carManipulatorBlockParams.updateCarBlock);
    const buttonsBlock = new ButtonsManipulatorBlock(carManipulatorBlockParams.blockButtons);

    this.manipulatorContent = createDomElement(carManipulatorBlockParams.BlockContainer);
    this.createCarBlock = createCarBlock.blockContainer;
    this.updateCarBlockEl = this.updateCarBlock.blockContainer;
    this.buttonsBlock = buttonsBlock.blockContainer;

    this.manipulatorContent.appendChild(this.createCarBlock);
    this.manipulatorContent.appendChild(this.updateCarBlockEl);
    this.manipulatorContent.appendChild(this.buttonsBlock);
  }

  updateCarInfo(): void {
    // this.updateCarBlock.carNameInput.addEventListener('focus')
  }

  fillUpdateInput(name: string, color: string): void {
    console.log('NEW NAME = ', name);
    (this.updateCarBlock.carNameInput as HTMLInputElement).value = name;
    (this.updateCarBlock.carColorInput as HTMLInputElement).value = color;
  }
}
