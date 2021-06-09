import createDomElement from '../../shared-functions/create-dom-element';
import CarManipulator from './class-car-manipulator';
import garageMainPageParams from '../params/garage-page-main-container-params';
import RaceModule from './class-race-module';
import communicator from '../../../server-communication/create-communicator';
import { CARSPERPAGE } from '../../../shared/constants';
import { Icar } from '../../../shared/interfaces-communicator';
import router from '../../../router/create-router';
import getCurrerntPageNbr from '../../../shared/functions/function-get-current-page-number';

function createSubPage(pageNbr: number): HTMLElement {
  const garageSubPage = createDomElement(garageMainPageParams.subPageContainer);
  const garageSubPageTitle = createDomElement(garageMainPageParams.subPageTitle);
  garageSubPage.setAttribute('id', `page-${pageNbr}`);
  if (pageNbr > 1) garageSubPage.classList.add('hidden');
  garageSubPageTitle.innerText = `Page ${pageNbr}`;
  garageSubPage.appendChild(garageSubPageTitle);
  return garageSubPage;
}

export default class Garage {
  garageContainer: HTMLElement;

  garageCarManipulator: CarManipulator;

  garageCarManipulatorEl: HTMLElement;

  garageTitleBlock: HTMLElement;

  garageTitle: HTMLElement;

  garageCarsTotalNbrEl: HTMLElement;

  raceModulesSet: RaceModule[];

  garagePagesContainer: HTMLElement;

  garagePageTitleIndex: number;

  garagePagesNbr: number;

  garageCarsTotalNbr: number;

  garageNextPageButton: HTMLElement;

  garagePrevPageButton: HTMLElement;

  pageName: string;

  constructor() {
    this.garageCarManipulator = new CarManipulator();
    this.raceModulesSet = [];

    // назначаем параметры по умолчанию
    this.pageName = 'garage';
    this.garagePagesNbr = 1;
    this.garagePageTitleIndex = 1;
    this.garageCarsTotalNbr = 0;

    this.garageContainer = createDomElement(garageMainPageParams.container);
    this.garageCarManipulatorEl = this.garageCarManipulator.manipulatorContent;

    // create title block of the garage page
    this.garageTitleBlock = createDomElement(garageMainPageParams.titleContainer);
    this.garageTitle = createDomElement(garageMainPageParams.title);
    this.garageCarsTotalNbrEl = createDomElement(garageMainPageParams.totalNbrCars);
    this.calculatePagesNbr();

    // create pagesContainer
    this.garagePagesContainer = createDomElement(garageMainPageParams.subPagesContainer);

    // нужно создать контейнеров из расчета garageCarsTotalNbr/7
    this.createPagesOfCars();

    this.garageNextPageButton = createDomElement(garageMainPageParams.nextPageButton);
    this.garagePrevPageButton = createDomElement(garageMainPageParams.prevPageButton);

    this.garageContainer.appendChild(this.garageCarManipulatorEl);
    this.garageContainer.appendChild(this.garageTitleBlock);
    this.garageTitleBlock.appendChild(this.garageTitle);
    this.garageTitleBlock.appendChild(this.garageCarsTotalNbrEl);
    this.garageContainer.appendChild(this.garagePagesContainer);
    this.garageContainer.appendChild(this.garagePrevPageButton);
    this.garageContainer.appendChild(this.garageNextPageButton);
    this.listenTOGaragePage();
  }

  getCarsTotalNbr = async (): Promise<void> => {
    await communicator.getCars([{}, { key: '_limit', value: 8 }]); // нет ясности как пользоваться данным параметром правильно
    this.garageCarsTotalNbrEl.innerText = `(${communicator.countXCars})`;
    this.garageCarsTotalNbr = communicator.countXCars;
  };

  calculatePagesNbr = async (): Promise<void> => {
    await communicator.getCars([{}, { key: '_limit', value: 8 }]); // нет ясности как пользоваться данным параметром правильно
    this.garagePagesNbr = Math.ceil(communicator.countXCars / CARSPERPAGE);
  };

  renderPages(): void {
    while (this.garagePagesContainer.firstElementChild) {
      this.garagePagesContainer.firstElementChild.remove();
    }
    for (let j = 0; j < this.garagePagesNbr; j += 1) {
      const garageSubPage = createSubPage(j + 1);
      for (let i = 0; i < CARSPERPAGE; i += 1) {
        if (this.raceModulesSet[j * CARSPERPAGE + i]) {
          garageSubPage.appendChild(this.raceModulesSet[j * CARSPERPAGE + i].raceModContainer);
        }
      }
      this.garagePagesContainer.appendChild(garageSubPage);
    }
    this.getCarsTotalNbr();
    this.calculatePagesNbr();
  }

  createSetOfModules = async (): Promise<void> => {
    const cardIdArr: number[] = [];
    const cars = await communicator.getCars([{}, {}]);
    cars.forEach((element) => {
      if (element.id) cardIdArr.push(element.id);
    });
    this.raceModulesSet = [];
    cardIdArr.forEach((element) => {
      const raceModule = new RaceModule(element);
      this.raceModulesSet.push(raceModule);
    });
  };

  createPagesOfCars = async (): Promise<void> => {
    await this.getCarsTotalNbr();
    await this.createSetOfModules();
    this.renderPages();
  };

  buttonCreateHandler = async (): Promise<void> => {
    const car = {} as Icar;
    let carId;

    car.color = (this.garageCarManipulator.createCarBlock.carColorInput as HTMLInputElement).value;
    car.name = (this.garageCarManipulator.createCarBlock.carNameInput as HTMLInputElement).value;
    const createdCar = await communicator.createCar(car);
    if (createdCar.id) { carId = createdCar.id; } else carId = 0;

    if (carId) {
      const raceModule = new RaceModule(carId);
      this.raceModulesSet.push(raceModule);
      const garageSubPage = document.getElementById(`page-${this.garagePagesNbr}`);
      if (garageSubPage?.childNodes.length === (CARSPERPAGE + 1)) {
        const newGarageSubPage = createSubPage(this.garagePagesNbr + 1);
        newGarageSubPage.appendChild(raceModule.raceModContainer);
        this.garagePagesContainer.appendChild(newGarageSubPage);
      } else garageSubPage?.appendChild(raceModule.raceModContainer);
    }

    (this.garageCarManipulator.createCarBlock.carColorInput as HTMLInputElement).value = '#ffffff';
    (this.garageCarManipulator.createCarBlock.carNameInput as HTMLInputElement).value = '';

    this.getCarsTotalNbr();
    this.calculatePagesNbr();
  };

  buttonRemoveHandler = async (target: HTMLElement): Promise<void> => {
    let module;
    const id = Number((target as HTMLElement).parentElement?.parentElement?.getAttribute('id'));
    const deletedCar = await communicator.getCar(id);
    await communicator.deleteCar(id);
    this.raceModulesSet.forEach((el) => {
      if (el.raceModId === (deletedCar as Icar).id) module = el;
    });
    if (module) {
      const index = this.raceModulesSet.indexOf(module);
      this.raceModulesSet.splice(index, 1);
      this.renderPages();
    }
  };

  buttonSelectHandler = async (target: HTMLElement): Promise<number> => {
    const id = Number((target as HTMLElement).parentElement?.parentElement?.getAttribute('id'));
    const carInfo = await communicator.getCar(id);
    this.garageCarManipulator.fillUpdateInput(carInfo.name, carInfo.color);
    return id;
  };

  buttonUpdateHandler = async (id: number): Promise<void> => {
    const updatedCarInfo = await this.garageCarManipulator.updateCarInfoInDB(id);
    this.raceModulesSet?.forEach((el) => {
      if (el.raceModId === id) {
        el.raceModCarControl?.updateCarTitle((updatedCarInfo as Icar)?.name);
        el.raceModTrackBlock?.trackBlock.updateCarIconColor((updatedCarInfo as Icar)?.color);
      }
    });
    (this.garageCarManipulator.updateCarBlock.carColorInput as HTMLInputElement).value = '#ffffff';
    (this.garageCarManipulator.updateCarBlock.carNameInput as HTMLInputElement).value = '';
  };

  buttonStartHandler = async (target: HTMLElement): Promise<void> => {
    const id = Number((target as HTMLElement).parentElement?.parentElement?.parentElement?.getAttribute('id'));
    await communicator.startORStopCarEngine([{ id, status: 'started' }]);
    await communicator.switchEngineDrive([{ id, status: 'drive' }]);
  };

  buttonNextHandler = async (): Promise<void> => {
    const pageNbr = getCurrerntPageNbr() + 1;
    this.garagePagesContainer.childNodes.forEach((element) => {
      (element as HTMLElement).classList.add('hidden');
      if ((element as HTMLElement).getAttribute('id') === `page-${pageNbr}`) {
        (element as HTMLElement).classList.remove('hidden');
        router.add(`garage/${pageNbr}`, () => {});
      }
    });
  };

  buttonPrevHandler = async (): Promise<void> => {
    const pageNbr = getCurrerntPageNbr() - 1;
    this.garagePagesContainer.childNodes.forEach((element) => {
      (element as HTMLElement).classList.add('hidden');
      if ((element as HTMLElement).getAttribute('id') === `page-${pageNbr}`) {
        (element as HTMLElement).classList.remove('hidden');
        router.add(`garage/${pageNbr}`, () => {});
      }
    });
  };

  listenTOGaragePage = async (): Promise<void> => {
    let id: number;

    this.garageContainer.addEventListener('click', async (e): Promise<void> => {
      if ((e.target as HTMLElement).classList.contains('manipulator-button_create-car')) {
        this.buttonCreateHandler();
      }

      if ((e.target as HTMLElement).classList.contains('car-control-button_select')) {
        id = await this.buttonSelectHandler(e.target as HTMLElement);
      }

      if ((e.target as HTMLElement).classList.contains('car-control-button_remove')) {
        await this.buttonRemoveHandler(e.target as HTMLElement);
      }

      if ((e.target as HTMLElement).classList.contains('manipulator-button_update-car') && id) {
        await this.buttonUpdateHandler(id);
      }

      if ((e.target as HTMLElement).classList.contains('move-control-button_start')) {
        await this.buttonStartHandler(e.target as HTMLElement);
      }

      if ((e.target as HTMLElement).classList.contains('garage-button_next')) {
        await this.buttonNextHandler();
      }

      if ((e.target as HTMLElement).classList.contains('garage-button_prev')) {
        await this.buttonPrevHandler();
      }
    });
  };
}
