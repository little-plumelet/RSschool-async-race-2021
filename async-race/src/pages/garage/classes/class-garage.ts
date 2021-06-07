import createDomElement from '../../shared-functions/create-dom-element';
import CarManipulator from './class-car-manipulator';
import garageMainContainerParams from '../params/garage-page-main-container-params';

export default class Garage {
  garageContainer: HTMLElement;

  garageCarControl: HTMLElement;

  constructor() {
    const carManipulator = new CarManipulator();

    this.garageContainer = createDomElement(garageMainContainerParams);
    this.garageCarControl = carManipulator.manipulatorContent;

    this.garageContainer.appendChild(this.garageCarControl);
  }
}
