import createDomElement from '../../shared-functions/create-dom-element';
import CarManipulator from './class-car-manipulator';
import garageMainPageParams from '../params/garage-page-main-container-params';
import RaceModule from './class-race-module';
import communicator from '../../../server-communication/create-communicator';
import CARSPERPAGE from '../../../shared/constants';
import raceModuleParams from '../params/race-module-params';

export default class Garage {
  garageContainer: HTMLElement;

  garageCarManipulator: CarManipulator;

  garageCarManipulatorEl: HTMLElement;

  garageTitleBlock: HTMLElement;

  garageTitle: HTMLElement;

  garageCarsTotalNbrEl: HTMLElement;

  garagePagesContainer: HTMLElement;

  garagePagesNbr: number;

  garageCarsTotalNbr: number;

  constructor() {
    this.garageCarManipulator = new CarManipulator();

    // назначаем параметры по умолчанию
    this.garagePagesNbr = 1;
    this.garageCarsTotalNbr = 0;

    this.garageContainer = createDomElement(garageMainPageParams.container);
    this.garageCarManipulatorEl = this.garageCarManipulator.manipulatorContent;

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

    this.garageContainer.appendChild(this.garageCarManipulatorEl);
    this.garageContainer.appendChild(this.garageTitleBlock);
    this.garageTitleBlock.appendChild(this.garageTitle);
    this.garageTitleBlock.appendChild(this.garageCarsTotalNbrEl);
    this.garageContainer.appendChild(this.garagePagesContainer);
    this.listenTOGaragePage();
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
          // select(): void {
          // raceModule.select();
          // }
          carId += 1;
          garageSubPage.appendChild(raceModule.raceModContainer);
        }
        this.garagePagesContainer.appendChild(garageSubPage);
      }
    }
  };

  listenTOGaragePage = async (): Promise<void> => {
    this.garageContainer.addEventListener('click', async (e): Promise<void> => {
      if ((e.target as HTMLLIElement).classList.contains('car-control-button_select')) {
        const id = Number((e.target as HTMLElement).parentElement?.parentElement?.getAttribute('id'));
        console.log('************************', id);
        const carInfo = await communicator.getCar(id);
        console.log('************************', carInfo);
        this.garageCarManipulator.fillUpdateInput(carInfo.name, carInfo.color);
      }
    });
  };
}
