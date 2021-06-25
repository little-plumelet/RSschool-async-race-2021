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
import getWinnerName from '../../../shared/functions/function-get-winner-name';
import deleteWinnerPopUp from '../../../shared/functions/function-delete-winner-popup';
import showWinnerPopUp from '../../../shared/functions/function-show-winner-popup';
import pageWinners from '../../winners/create-page-winners';
import Ianimation from '../interfaces/animation-interface';
import CONSTANTS from '../../../shared/constants';
import {
  getRandomIntInclusive,
  disableToggleStartButtons,
  allStopButtonDisabled,
  MoveToStartAllCarsOnSubPage,
  allCarsOfSubPageOnStartPosition,
} from '../function-utils';
import ICarAnimationProps from '../interfaces/animtion-params-interface';
import IstartRaceParams from '../interfaces/start-race-params-interface';

const {
  carsPerPage,
  carsBunchNbr,
  hexColorLetters,
  timeOutWinner,
  carFinishOffset,
} = CONSTANTS;
let animationId = [{} as Ianimation];

function carAnimation(params: ICarAnimationProps): VoidFunction {
  return function res(): void {
    const timePassed = Date.now() - params.start;
    const position = timePassed * params.carOffset;
    let isPushNeeded = true;
    params.carIcon.setAttribute('style', `left: ${position}px`);
    if (position < params.endPoint) {
      const animationMod = {
        carId: params.id,
        AnimationId: window.requestAnimationFrame(carAnimation(params)),
      };
      animationId.forEach((el) => {
        if (el.carId === animationMod.carId) {
          const i = animationId.indexOf(el);
          animationId[i] = animationMod;
          isPushNeeded = false;
        }
      });
      if (isPushNeeded) animationId.push(animationMod);
    }
  };
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

  pageNbrForReturn: number;

  constructor() {
    this.garageCarManipulator = new CarManipulator();
    this.raceModulesSet = [];

    // назначаем параметры по умолчанию
    this.pageName = 'garage';
    this.garagePagesNbr = 1;
    this.pageNbrForReturn = 1;
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
    await communicator.getCars([{}, { key: '_limit', value: carsPerPage }]);
    this.garageCarsTotalNbrEl.innerText = `(${communicator.countXCars})`;
    this.garageCarsTotalNbr = communicator.countXCars;
  };

  calculatePagesNbr = async (): Promise<void> => {
    await communicator.getCars([{}, { key: '_limit', value: carsPerPage }]);
    this.garagePagesNbr = Math.ceil(communicator.countXCars / carsPerPage);
  };

  renderPages = async (): Promise<void> => {
    await this.calculatePagesNbr();
    while (this.garagePagesContainer.firstElementChild) {
      this.garagePagesContainer.firstElementChild.remove();
    }
    for (let j = 0; j < this.garagePagesNbr; j += 1) {
      const garageSubPage = createSubPage(j + 1, garageMainPageParams);
      if ((j + 1) < this.garagePagesNbr) this.garageNextPageButton.classList.remove('disabled');
      for (let i = 0; i < carsPerPage; i += 1) {
        if (this.raceModulesSet[j * carsPerPage + i]) {
          garageSubPage.appendChild(this.raceModulesSet[j * carsPerPage + i].raceModContainer);
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

  stayOntheCurrentPage(currentPage: number): void {
    this.garagePagesContainer.childNodes.forEach((element) => {
      (element as HTMLElement).classList.add('hidden');
      if ((element as HTMLElement).getAttribute('id') === `page-${currentPage}`) {
        (element as HTMLElement).classList.remove('hidden');
        router.add(`garage/${currentPage}`, () => {});
      }
    });
  }

  animationStart = async (startParams: IstartRaceParams): Promise<IraceResult> => {
    const params = {} as ICarAnimationProps;
    const carIcon = document.getElementById(`car-icon-${startParams.id}`);

    params.id = startParams.id;
    if (startParams.carIcon.classList.contains('car-icon')) params.carIcon = startParams.carIcon;
    else if (carIcon) params.carIcon = carIcon;

    params.start = Date.now();
    const startPoint = params.carIcon.getBoundingClientRect().left;
    const halfCarIconWidth = params.carIcon.getBoundingClientRect().right - startPoint;

    params.endPoint = window.innerWidth - halfCarIconWidth * 1.3 - carFinishOffset;
    params.carOffset = params.endPoint / ((startParams.distance / startParams.velocity));

    const animationMod = {
      carId: startParams.id,
      AnimationId: window.requestAnimationFrame(carAnimation(params)),
    };

    const res = await communicator.switchEngineDrive([{ id: animationMod.carId, status: 'drive' }]);
    if (res.success === 'false') {
      animationId.forEach((el) => {
        if (el.carId === res.id) {
          window.cancelAnimationFrame(el.AnimationId);
        }
      });
    }
    res.distance = startParams.distance;
    res.velocity = startParams.velocity;
    return res;
  };

  buttonCreateHandler = async (): Promise<void> => {
    const car = {} as Icar;
    const currentPage = getCurrerntPageNbr();

    car.color = (this.garageCarManipulator.createCarBlock.carColorInput as HTMLInputElement).value;
    car.name = (this.garageCarManipulator.createCarBlock.carNameInput as HTMLInputElement).value;
    await this.updateSetOfModules(car);
    await this.renderPages();
    this.stayOntheCurrentPage(currentPage);
  };

  buttonRemoveHandler = async (target: HTMLElement): Promise<void> => {
    let module;
    const currentPage = getCurrerntPageNbr();
    const id = Number((target as HTMLElement).parentElement?.parentElement?.getAttribute('id'));
    const deletedCar = await communicator.getCar(id);
    await communicator.deleteCar(id);
    this.raceModulesSet.forEach((el) => {
      if (el.raceModId === (deletedCar as Icar).id) module = el;
    });
    if (module) {
      const index = this.raceModulesSet.indexOf(module);
      this.raceModulesSet.splice(index, 1);
      await this.renderPages();
      await pageWinners.removeWinner(id);
    }
    this.stayOntheCurrentPage(currentPage);
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
    this.garageCarManipulator.clearUpdateCarBlock();
  };

  buttonStartHandler = async (target: HTMLElement): Promise<void> => {
    const startParams = {} as IstartRaceParams;
    startParams.id = Number((target as HTMLElement).parentElement?.parentElement?.parentElement?.getAttribute('id'));
    const carRaceparams = await communicator.startORStopCarEngine([{ id: startParams.id, status: 'started' }]);
    if (carRaceparams.velocity && carRaceparams.distance) {
      target.classList.add('disabled');
      const carVelositySign = document.getElementById(`velosity-${startParams.id}`);
      if (carVelositySign) carVelositySign.innerText = `V = ${carRaceparams.velocity} m/c`;
      this.garageCarManipulator.buttonsBlock.buttonRace.classList.add('disabled');
      target.nextElementSibling?.classList.remove('disabled');
      startParams.velocity = carRaceparams.velocity;
      startParams.distance = carRaceparams.distance;
      startParams.carIcon = target;
      this.animationStart(startParams);
    }
  };

  buttonStopHandler = async (target: HTMLElement): Promise<void> => {
    const id = Number((target as HTMLElement).parentElement?.parentElement?.parentElement?.getAttribute('id'));
    const carRaceparams = await communicator.startORStopCarEngine([{ id, status: 'stopped' }]);
    if (carRaceparams.velocity === 0) {
      animationId.forEach((el) => {
        if (el.carId === id) {
          window.cancelAnimationFrame(el.AnimationId);
        }
      });
      (target.previousSibling as HTMLElement).classList.remove('disabled');
      const car = (target as HTMLElement).parentElement?.nextSibling?.firstChild as HTMLElement;
      car.setAttribute('style', 'left: 0px');
      if (car.getAttribute('style') === 'left: 0px') target.classList.add('disabled');
      if (allStopButtonDisabled()) this.garageCarManipulator.buttonsBlock.buttonRace.classList.remove('disabled');
      const carVelositySign = document.getElementById(`velosity-${id}`);
      if (carVelositySign) carVelositySign.innerText = 'V = 0 m/c';
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
        if ((pageNbr) === this.garagePagesNbr) this.garageNextPageButton.classList.add('disabled');
        this.garagePrevPageButton.classList.remove('disabled');
      }
    });
    if (allCarsOfSubPageOnStartPosition()) this.garageCarManipulator.buttonsBlock.buttonRace.classList.remove('disabled');
    else this.garageCarManipulator.buttonsBlock.buttonRace.classList.add('disabled');
  };

  buttonPrevHandler = async (): Promise<void> => {
    const pageNbr = getCurrerntPageNbr() - 1;
    this.pageNbrForReturn = getCurrerntPageNbr();
    this.garagePagesContainer.childNodes.forEach((element) => {
      (element as HTMLElement).classList.add('hidden');
      if ((element as HTMLElement).getAttribute('id') === `page-${pageNbr}`) {
        (element as HTMLElement).classList.remove('hidden');
        router.add(`garage/${pageNbr}`, () => {});
        if ((pageNbr) === 1) this.garagePrevPageButton.classList.add('disabled');
        this.garageNextPageButton.classList.remove('disabled');
      }
    });
    if (allCarsOfSubPageOnStartPosition()) this.garageCarManipulator.buttonsBlock.buttonRace.classList.remove('disabled');
    else this.garageCarManipulator.buttonsBlock.buttonRace.classList.add('disabled');
  };

  buttonCreateCarsHandler = async (): Promise<void> => {
    const cars = [{} as Icar];
    const currentPage = getCurrerntPageNbr();

    for (let i = 0; i < carsBunchNbr; i += 1) {
      const car = {} as Icar;
      car.name = carNamesArr[getRandomIntInclusive(0, carNamesArr.length - 1)];
      car.name = `${car.name} ${carModelsArr[getRandomIntInclusive(0, carModelsArr.length - 1)]}`;
      car.color = '#';
      for (let j = 0; j < hexColorLetters; j += 1) {
        car.color += carColorArr[getRandomIntInclusive(0, carColorArr.length - 1)];
      }
      cars.push(car);
    }
    cars.splice(0, 1);
    await Promise.all(cars.map(async (element) => { await this.updateSetOfModules(element); }));
    await this.renderPages();
    this.stayOntheCurrentPage(currentPage);
  };

  createArrRaceResult = async (): Promise<IraceResult[]> => {
    const currentPage = getCurrerntPageNbr();
    const cars = await communicator.getCars([{ key: '_page', value: currentPage }, { key: '_limit', value: 7 }]);
    const resultsArr = [{} as IraceResult];
    let raceSuccess: IraceResult;
    await Promise.all(cars.map(async (element) => {
      if (element.id) {
        const commonRes = {} as IraceResult;
        const raseStartParams = {} as IstartRaceParams;
        commonRes.id = element.id;
        const carRaceparams = await communicator.startORStopCarEngine([{ id: element.id, status: 'started' }]);
        const carIcon = document.getElementById(`car-icon-${element.id}`);
        const carVelositySign = document.getElementById(`velosity-${element.id}`);
        if (carIcon) raseStartParams.carIcon = carIcon;
        if (carRaceparams.velocity && carRaceparams.distance) {
          if (carVelositySign) carVelositySign.innerText = `V = ${carRaceparams.velocity} m/c`;
          raseStartParams.distance = carRaceparams.distance;
          raseStartParams.velocity = carRaceparams.velocity;
          raseStartParams.id = element.id;
          raceSuccess = await this.animationStart(raseStartParams);
          resultsArr.push(raceSuccess);
        }
      }
    }));
    resultsArr.splice(0, 1);
    animationId = [{} as Ianimation];
    return resultsArr;
  };

  buttonStartRaceHandler = async (target: HTMLElement): Promise<void> => {
    const makeDisabled = true;
    target.classList.add('disabled');
    disableToggleStartButtons(makeDisabled);
    this.garageCarManipulator.buttonsBlock.buttonReset.classList.add('disabled');
    const resultsArr = await this.createArrRaceResult();
    const winnerCompaund = await calculateWinner(resultsArr);
    let winnerName = await getWinnerName(winnerCompaund.winner);
    if (winnerName === '') winnerName = 'Nobody';
    animationId = [{} as Ianimation];
    showWinnerPopUp(winnerName, winnerCompaund.timeWinner);
    setTimeout(deleteWinnerPopUp, timeOutWinner);

    // записать победителя в список победителей
    if (winnerName !== 'Nobody') await pageWinners.updateWinnersTable(winnerCompaund);
    pageWinners.renderWinnersTable();
    this.garageCarManipulator.buttonsBlock.buttonReset.classList.remove('disabled');
  };

  buttonResetRaceHandler = async (): Promise<void> => {
    const makeDisabled = false;
    this.garageCarManipulator.buttonsBlock.buttonRace.classList.remove('disabled');
    disableToggleStartButtons(makeDisabled);
    MoveToStartAllCarsOnSubPage();
  };

  listenTOGaragePage = async (): Promise<void> => {
    let id: number;

    this.garageContainer.addEventListener('click', async (e): Promise<void> => {
      if ((e.target as HTMLElement).classList.contains('manipulator-button_create-car')) {
        this.buttonCreateHandler();
        this.garageCarManipulator.clearCreateCarBlock();
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

      if ((e.target as HTMLElement).classList.contains('move-control-button_stop')) {
        await this.buttonStopHandler(e.target as HTMLElement);
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
        await this.buttonStartRaceHandler(e.target as HTMLElement);
      }

      if ((e.target as HTMLElement).classList.contains('manipulator-button_reset')) {
        await this.buttonResetRaceHandler();
      }
    });
  };
}
