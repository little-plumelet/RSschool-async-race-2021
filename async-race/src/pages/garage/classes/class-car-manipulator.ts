import createDomElement from '../../shared-functions/create-dom-element';
import ButtonsManipulatorBlock from './class-buttons-manipulator-block';
import CarManipulatorBlock from './class-car-manipulator-block';
import carManipulatorBlockParams from '../params/car-manipulator-block-params';
import communicator from '../../../server-communication/create-communicator';
import { Icar } from '../../../shared/interfaces-communicator';
import CONSTANTS from '../../../shared/constants';

const { inputColor } = CONSTANTS;

export default class CarManipulator {
  manipulatorContent: HTMLElement;

  createCarBlock: CarManipulatorBlock;

  createCarBlockEl: HTMLElement;

  updateCarBlock: CarManipulatorBlock;

  updateCarBlockEl: HTMLElement;

  buttonsBlock: ButtonsManipulatorBlock;

  buttonsBlockEl: HTMLElement;

  constructor() {
    this.createCarBlock = new CarManipulatorBlock(carManipulatorBlockParams.createCarBlock);
    this.updateCarBlock = new CarManipulatorBlock(carManipulatorBlockParams.updateCarBlock);
    this.buttonsBlock = new ButtonsManipulatorBlock(carManipulatorBlockParams.blockButtons);

    this.manipulatorContent = createDomElement(carManipulatorBlockParams.BlockContainer);
    this.createCarBlockEl = this.createCarBlock.blockContainer;
    this.updateCarBlockEl = this.updateCarBlock.blockContainer;
    this.buttonsBlockEl = this.buttonsBlock.blockContainer;

    this.manipulatorContent.appendChild(this.createCarBlockEl);
    this.manipulatorContent.appendChild(this.updateCarBlockEl);
    this.manipulatorContent.appendChild(this.buttonsBlockEl);
  }

  updateCarInfoInDB = async (id: number): Promise<Response | Icar | undefined> => {
    let updatedCarInfo;
    if ((this.updateCarBlock.carColorInput as HTMLInputElement).value
    && (this.updateCarBlock.carNameInput as HTMLInputElement).value) {
      const carInfo = {
        name: (this.updateCarBlock.carNameInput as HTMLInputElement).value,
        color: (this.updateCarBlock.carColorInput as HTMLInputElement).value,
        id: Number(id),
      } as Icar;
      updatedCarInfo = await communicator.updateCar(id, carInfo);
    }
    return updatedCarInfo;
  };

  fillUpdateInput(name: string, color: string): void {
    this.updateCarBlock.carNameInput.removeAttribute('disabled');
    this.updateCarBlock.carColorInput.removeAttribute('disabled');
    this.updateCarBlock.button.classList.remove('disabled');
    (this.updateCarBlock.carNameInput as HTMLInputElement).value = name;
    (this.updateCarBlock.carColorInput as HTMLInputElement).value = color;
  }

  clearCreateCarBlock(): void {
    (this.createCarBlock.carNameInput as HTMLInputElement).value = '';
    (this.createCarBlock.carColorInput as HTMLInputElement).value = inputColor;
  }

  clearUpdateCarBlock(): void {
    (this.updateCarBlock.carNameInput as HTMLInputElement).value = '';
    this.updateCarBlock.carNameInput.setAttribute('disabled', 'disabled');
    (this.updateCarBlock.carColorInput as HTMLInputElement).value = inputColor;
    this.updateCarBlock.carColorInput.setAttribute('disabled', 'disabled');
    this.updateCarBlock.button.classList.add('disabled');
  }
}
