import createDomElement from '../../shared-functions/create-dom-element';
import CarManipulator from './class-car-manipulator';
import garageMainPageParams from '../params/garage-page-main-container-params';
import RaceModule from './class-race-module';
import communicator from '../../../server-communication/create-communicator';
import { Icar, IraceResult } from '../../../shared/interfaces-communicator';
import router from '../../../router/create-router';
import getCurrerntPageNbr from '../../../shared/functions/function-get-current-page-number';
import carNamesArr from '../../../shared/data-cars-names';
import carModelsArr from '../../../shared/data-cars-models';
import carColorArr from '../../../shared/data-cars-colors';
import calculateWinner from '../../../shared/functions/function-calculate-winner-of-race';
import {
  CARSPERPAGE,
  CARSBUNCHNBR,
  INPUTCOLOR,
  HEXCOLORLETTERS,
  TIMEOUTWINNER,
} from '../../../shared/constants';
import getWinnerName from '../../../shared/functions/function-get-winner-name';
import deleteWinnerPopUp from '../../../shared/functions/function-delete-winner-popup';
import showWinnerPopUp from '../../../shared/functions/function-show-winner-popup';

function getRandomIntInclusive(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min; // Максимум и минимум включаются
}

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

  renderPages = async (): Promise<void> => {
    while (this.garagePagesContainer.firstElementChild) {
      this.garagePagesContainer.firstElementChild.remove();
    }
    await this.calculatePagesNbr();
    for (let j = 0; j < this.garagePagesNbr; j += 1) {
      const garageSubPage = createSubPage(j + 1);
      for (let i = 0; i < CARSPERPAGE; i += 1) {
        if (this.raceModulesSet[j * CARSPERPAGE + i]) {
          garageSubPage.appendChild(this.raceModulesSet[j * CARSPERPAGE + i].raceModContainer);
        }
      }
      this.garagePagesContainer.appendChild(garageSubPage);
    }
    await this.getCarsTotalNbr();
    await this.calculatePagesNbr();
  };

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

  updateSetOfModules = async (car: Icar): Promise<void> => {
    const createdCar = await communicator.createCar(car);
    if (createdCar.id) {
      const raceModule = new RaceModule(createdCar.id);
      this.raceModulesSet.push(raceModule);
    }
  };

  createPagesOfCars = async (): Promise<void> => {
    await this.getCarsTotalNbr();
    await this.createSetOfModules();
    this.renderPages();
  };

  buttonCreateHandler = async (): Promise<void> => {
    const car = {} as Icar;

    car.color = (this.garageCarManipulator.createCarBlock.carColorInput as HTMLInputElement).value;
    car.name = (this.garageCarManipulator.createCarBlock.carNameInput as HTMLInputElement).value;
    await this.updateSetOfModules(car);
    this.renderPages();
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
    (this.garageCarManipulator.updateCarBlock.carColorInput as HTMLInputElement).value = INPUTCOLOR;
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

  buttonCreateCarsHandler = async (): Promise<void> => {
    const cars = [{} as Icar];

    for (let i = 0; i < CARSBUNCHNBR; i += 1) {
      const car = {} as Icar;
      car.name = carNamesArr[getRandomIntInclusive(0, carNamesArr.length - 1)];
      car.name = `${car.name} ${carModelsArr[getRandomIntInclusive(0, carModelsArr.length - 1)]}`;
      car.color = '#';
      for (let j = 0; j < HEXCOLORLETTERS; j += 1) {
        car.color += carColorArr[getRandomIntInclusive(0, carColorArr.length - 1)];
      }
      cars.push(car);
    }
    cars.splice(0, 1);
    cars.forEach(async (element) => { await this.updateSetOfModules(element); });
    this.renderPages();
  };

  createArrRaceResult = async (): Promise<IraceResult[]> => {
    const currentPage = getCurrerntPageNbr();
    console.log('currentPage = ', currentPage);
    const cars = await communicator.getCars([{ key: '_page', value: currentPage }, { key: '_limit', value: 7 }]);
    const resultsArr = [{} as IraceResult];
    console.log('cars = ', cars);
    await Promise.all(cars.map(async (element) => {
      if (element.id) {
        const commonRes = {} as IraceResult;
        commonRes.id = element.id;
        const res1 = await communicator.startORStopCarEngine([{ id: element.id, status: 'started' }]);
        const res2 = await communicator.switchEngineDrive([{ id: element.id, status: 'drive' }]);
        if (res2) {
          commonRes.distance = res1.distance;
          commonRes.velocity = res1.velocity;
          commonRes.success = res2.success;
          resultsArr.push(commonRes);
        }
      }
    }));
    resultsArr.splice(0, 1);
    return resultsArr;
  };

  buttonStartRaceHandler = async (): Promise<void> => {
    const resultsArr = await this.createArrRaceResult();
    console.log('!!!!!!resultsArr = ', resultsArr);
    const winnerCompaund = await calculateWinner(resultsArr);
    let winnerName = await getWinnerName(winnerCompaund.winner);
    if (winnerName === '') winnerName = 'Nobody';
    showWinnerPopUp(winnerName, winnerCompaund.timeWinner);
    setTimeout(deleteWinnerPopUp, TIMEOUTWINNER);
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

      if ((e.target as HTMLElement).classList.contains('manipulator-button_create-bunch')) {
        await this.buttonCreateCarsHandler();
      }

      if ((e.target as HTMLElement).classList.contains('manipulator-button_race')) {
        await this.buttonStartRaceHandler();
      }
    });
  };
}
