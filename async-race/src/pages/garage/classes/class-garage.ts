import createDomElement from '../../shared-functions/create-dom-element';
import CarManipulator from './class-car-manipulator';
import garageMainPageParams from '../params/garage-page-main-container-params';
import RaceModule from './class-race-module';
import communicator from '../../../server-communication/create-communicator';
import CARSPERPAGE from '../../../shared/constants';

export default class Garage {
  garageContainer: HTMLElement;

  garageCarControl: HTMLElement;

  garageTitleBlock: HTMLElement;

  garageTitle: HTMLElement;

  garageCarsTotalNbrEl: HTMLElement;

  garagePagesContainer: HTMLElement;

  garagePagesNbr: number;

  garageCarsTotalNbr: number;

  constructor() {
    const carManipulator = new CarManipulator();

    // назначаем параметры по умолчанию
    this.garagePagesNbr = 1;
    this.garageCarsTotalNbr = 0;

    this.garageContainer = createDomElement(garageMainPageParams.container);
    this.garageCarControl = carManipulator.manipulatorContent;

    // create title block of the garage page
    this.garageTitleBlock = createDomElement(garageMainPageParams.titleContainer);
    this.garageTitle = createDomElement(garageMainPageParams.title);
    this.garageCarsTotalNbrEl = createDomElement(garageMainPageParams.totalNbrCars);
    this.getCarsTotalNbr();
    this.calculatePagesNbr();

    // create pagesContainer
    this.garagePagesContainer = createDomElement(garageMainPageParams.subPagesContainer);

    // нужно создать контейнеров из расчета garageCarsTotalNbr/7
    this.createPageOfCars();

    this.garageContainer.appendChild(this.garageCarControl);
    this.garageContainer.appendChild(this.garageTitleBlock);
    this.garageTitleBlock.appendChild(this.garageTitle);
    this.garageTitleBlock.appendChild(this.garageCarsTotalNbrEl);
    this.garageContainer.appendChild(this.garagePagesContainer);
  }

  getCarsTotalNbr = async (): Promise<Response> => {
    const nbr = await communicator.getCars([{}, { key: '_limit', value: 8 }]); // нет ясности как пользоваться данным параметром правильно
    this.garageCarsTotalNbrEl.innerText = `(${communicator.countXCars})`;
    this.garageCarsTotalNbr = communicator.countXCars;
    return nbr;
  };

  calculatePagesNbr = async (): Promise<Response> => {
    const nbr = await communicator.getCars([{}, { key: '_limit', value: 8 }]); // нет ясности как пользоваться данным параметром правильно
    this.garagePagesNbr = communicator.countXCars / CARSPERPAGE;
    return nbr;
  };

  createPageOfCars = async (): Promise<void> => {
    await this.getCarsTotalNbr();
    if (this.garageCarsTotalNbr > CARSPERPAGE) {
      let carId = 1;
      for (let i = 0; i < this.garagePagesNbr; i += 1) {
        const garageSubPage = createDomElement(garageMainPageParams.subPageContainer);
        garageSubPage.setAttribute('id', `page-${i + 1}`);
        for (let j = 0; j < CARSPERPAGE; j += 1) {
          const raceModule = new RaceModule(carId);
          carId += 1;
          garageSubPage.appendChild(raceModule.raceModContainer);
        }
        this.garagePagesContainer.appendChild(garageSubPage);
      }
    }
  };
}
