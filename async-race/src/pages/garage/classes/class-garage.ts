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
import createSubPage from '../../shared-functions/create-sub-page';
import {
  CARSPERPAGE,
  CARSBUNCHNBR,
  INPUTCOLOR,
  HEXCOLORLETTERS,
  TIMEOUTWINNER,
  CARFINISHOFFSET,
} from '../../../shared/constants';
import getWinnerName from '../../../shared/functions/function-get-winner-name';
import deleteWinnerPopUp from '../../../shared/functions/function-delete-winner-popup';
import showWinnerPopUp from '../../../shared/functions/function-show-winner-popup';
import pageWinners from '../../winners/create-page-winners';

let animationId: number;

function getRandomIntInclusive(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min; // Максимум и минимум включаются
}

function carAnimation(
  start: number, carIcon: HTMLElement, carOffset: number, endPoint: number,
): VoidFunction {
  return function res(): void {
    const timePassed = Date.now() - start;
    const position = timePassed * carOffset;
    carIcon.setAttribute('style', `left: ${position}px`);
    if (position < endPoint) {
      animationId = window.requestAnimationFrame(
        carAnimation(start, carIcon, carOffset, endPoint),
      );
    }
  };
}

// function carAnimation(target: HTMLElement, velocity: number, distance: number): NodeJS.Timeout {
//   const carIcon = target.parentElement?.nextSibling?.firstChild as HTMLElement;
//   const start = Date.now();
//   const startPoint = carIcon.getBoundingClientRect().left;
//   const endPoint = window.innerWidth - startPoint - CARFINISHOFFSET;
//   const carOffset = endPoint / ((distance / velocity));

//   const timer = setInterval(() => {
//     const timePassed = Date.now() - start;
//     const position = timePassed * carOffset;
//     carIcon.style.left = `${position}px`;
//     if (position >= endPoint) clearInterval(timer);
//   }, 20);
//   return timer;
// }

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

  pageNbrForReturn: number;

  animationId: number;

  constructor() {
    this.garageCarManipulator = new CarManipulator();
    this.raceModulesSet = [];

    // назначаем параметры по умолчанию
    this.pageName = 'garage';
    this.garagePagesNbr = 1;
    this.pageNbrForReturn = 1;
    this.garagePageTitleIndex = 1;
    this.garageCarsTotalNbr = 0;
    this.animationId = 0;

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
      const garageSubPage = createSubPage(j + 1, garageMainPageParams);
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

  animationStart = async (
    id: number, target: HTMLElement, distance: number, velocity: number,
  ): Promise<IraceResult> => {
    let carIcon;
    if (target.classList.contains('car-icon')) carIcon = target;
    else carIcon = target.parentElement?.nextSibling?.firstChild as HTMLElement;
    const start = Date.now();
    const startPoint = carIcon.getBoundingClientRect().left;
    const endPoint = window.innerWidth - startPoint - CARFINISHOFFSET;
    const carOffset = endPoint / ((distance / velocity));

    animationId = window.requestAnimationFrame(
      carAnimation(start, carIcon, carOffset, endPoint),
    );
    const res = await communicator.switchEngineDrive([{ id, status: 'drive' }]);
    if (res.success === 'false') window.cancelAnimationFrame(animationId);
    res.distance = distance;
    res.velocity = velocity;
    res.id = id;
    return res;
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
      pageWinners.removeWinner(id);
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
    const carRaceparams = await communicator.startORStopCarEngine([{ id, status: 'started' }]);
    if (carRaceparams.velocity && carRaceparams.distance) {
      this.animationStart(id, target, carRaceparams.distance, carRaceparams.velocity);
    }
  };

  buttonNextHandler = async (): Promise<void> => {
    const pageNbr = getCurrerntPageNbr() + 1;
    this.pageNbrForReturn = getCurrerntPageNbr();
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
    this.pageNbrForReturn = getCurrerntPageNbr();
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
    console.log('STARTcurrentPage = ', currentPage);
    const cars = await communicator.getCars([{ key: '_page', value: currentPage }, { key: '_limit', value: 7 }]);
    const resultsArr = [{} as IraceResult];
    let raceSuccess: IraceResult;
    console.log('cars = ', cars);
    console.log('results = ', resultsArr);
    await Promise.all(cars.map(async (element) => {
      if (element.id) {
        const commonRes = {} as IraceResult;
        commonRes.id = element.id;
        const carRaceparams = await communicator.startORStopCarEngine([{ id: element.id, status: 'started' }]);
        const carIcon = document.getElementById(`${element.id}`)?.lastElementChild?.lastElementChild?.firstElementChild as HTMLElement;
        console.log('(((()))))', element.id, carIcon);
        if (carRaceparams.velocity && carRaceparams.distance) {
          raceSuccess = await this.animationStart(
            element.id, carIcon, carRaceparams.distance, carRaceparams.velocity,
          );
          resultsArr.push(raceSuccess);
          console.log('000000', raceSuccess, raceSuccess.id, raceSuccess.distance, raceSuccess.velocity);
        }
      }
    }));
    resultsArr.splice(0, 1);
    return resultsArr;
  };

  buttonStartRaceHandler = async (): Promise<void> => {
    const resultsArr = await this.createArrRaceResult();
    const winnerCompaund = await calculateWinner(resultsArr);
    let winnerName = await getWinnerName(winnerCompaund.winner);
    if (winnerName === '') winnerName = 'Nobody';
    showWinnerPopUp(winnerName, winnerCompaund.timeWinner);
    setTimeout(deleteWinnerPopUp, TIMEOUTWINNER);

    // записать победителя в список победителей
    pageWinners.updateWinnersTable(winnerCompaund);
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
