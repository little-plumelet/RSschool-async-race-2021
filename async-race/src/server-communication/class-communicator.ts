import { SUCSESS, SUCSESS201, URLS } from '../shared/constants-server';
import { errorHandler, printErrorMessage } from './class-communicator-utils';
import {
  Icar,
  IcarsQueryParams,
  Iwinner,
  IwinnersQueryParams,
  IengineQueryParams,
  IraceResult,
} from '../shared/interfaces-communicator';

export default class Communicator {
  basePath: string;

  garagePath: string;

  winnersPath: string;

  countXCars: number;

  countXWinners: number;

  constructor() {
    this.basePath = URLS.basePath;
    this.garagePath = URLS.garagePath;
    this.winnersPath = URLS.winnersPath;
    this.countXCars = 0;
    this.countXWinners = 0;
  }

  // methods for garage
  private generateCarsQueryString = (queryParams: IcarsQueryParams[]): string => {
    if (queryParams.length) {
      const res = `?${queryParams.map((x) => `${x.key}=${x.value}`).join('&')}`;
      return res;
    }
    return '';
  };

  getCars = async (queryParams: IcarsQueryParams[]): Promise<Icar[]> => {
    let carsList;
    try {
      const response = await fetch(`${this.basePath}${this.garagePath}${this.generateCarsQueryString(queryParams)}`);
      errorHandler(response, SUCSESS);
      carsList = await response.json();
      this.countXCars = Number(response.headers.get('X-Total-Count'));
    } catch (error) { printErrorMessage(error, 'get cars'); }
    return carsList;
  };

  getCar = async (id: number): Promise<Icar> => {
    let car;
    try {
      const response = await fetch(`${this.basePath}${this.garagePath}/${id}`);
      errorHandler(response, SUCSESS);
      car = await response.json();
      // Парсим данные, если убедились, что до этого в status было 200, например
    } catch (error) { printErrorMessage(error, 'get car'); }
    return car;
  };

  createCar = async (carParam: Icar): Promise<Icar> => {
    let createdCar;
    try {
      const response = await fetch(`${this.basePath}${this.garagePath}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carParam),
      });
      errorHandler(response, SUCSESS201);
      createdCar = await response.json();
    } catch (error) { printErrorMessage(error, 'create car'); }
    return createdCar;
  };

  updateCar = async (id: number, carParam: Icar): Promise<Response> => {
    let updatedCar;
    try {
      const response = await fetch(`${this.basePath}${this.garagePath}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carParam),
      });
      errorHandler(response, SUCSESS);
      updatedCar = await response.json();
    } catch (error) { printErrorMessage(error, 'update car'); }
    return updatedCar;
  };

  deleteCar = async (id: number): Promise<Icar> => {
    let deletedCar;
    try {
      const response = await fetch(`${this.basePath}${this.garagePath}/${id}`, {
        method: 'DELETE',
      });
      errorHandler(response, SUCSESS);
      deletedCar = await response.json();
    } catch (error) {
      printErrorMessage(error, 'delete car');
    }
    return deletedCar;
  };

  // methods for winners
  private generateWinnersQueryString = (queryParams: IwinnersQueryParams[]): string => {
    if (queryParams.length) {
      return `?${queryParams.map((x) => {
        let res = '';
        if (x.limitOrPage) res = `${x.limitOrPage.key}=${x.limitOrPage.value}`;
        if (x.sort) res += `${x.sort.key}=${x.sort.value}`;
        if (x.sortOrder) res += `${x.sortOrder.key}=${x.sortOrder.value}`;
        return res;
      }).join('&')}`;
    }
    return '';
  };

  getWinners = async (queryParams: IwinnersQueryParams[]): Promise<Iwinner[]> => {
    let winnersList;
    try {
      const response = await fetch(`${this.basePath}${this.winnersPath}${this.generateWinnersQueryString(queryParams)}`);
      errorHandler(response, SUCSESS);
      winnersList = await response.json();
      this.countXWinners = Number(response.headers.get('X-Total-Count'));
    } catch (error) { printErrorMessage(error, 'get winners'); }
    return winnersList;
  };

  getWinner = async (id: number): Promise<Response> => {
    let winner;
    try {
      const response = await fetch(`${this.basePath}${this.winnersPath}/${id}`);
      errorHandler(response, SUCSESS);
      winner = await response.json();
    } catch (error) {
      printErrorMessage(error, 'get winner');
    }
    return winner;
  };

  createWinner = async (winnerParam: Iwinner): Promise<Response> => {
    let createdWinner;
    try {
      const response = await fetch(`${this.basePath}${this.winnersPath}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(winnerParam),
      });
      errorHandler(response, SUCSESS201);
      createdWinner = await response.json();
    } catch (error) { printErrorMessage(error, 'create winner'); }
    return createdWinner;
  };

  updateWinner = async (id: number, winnerParam: Iwinner): Promise<Response> => {
    let updatedWinner;
    try {
      const response = await fetch(`${this.basePath}${this.winnersPath}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(winnerParam),
      });
      errorHandler(response, SUCSESS);
      updatedWinner = await response.json();
    } catch (error) { printErrorMessage(error, 'update winner'); }
    return updatedWinner;
  };

  deleteWinner = async (id: number): Promise<Response> => {
    let deletedWinner;
    try {
      const response = await fetch(`${this.basePath}${this.winnersPath}/${id}`, {
        method: 'DELETE',
      });
      errorHandler(response, SUCSESS);
      deletedWinner = await response.json();
    } catch (error) { printErrorMessage(error, 'delete winner'); }
    return deletedWinner;
  };

  // methods for engine
  private generateEngineQueryString = (queryParams: [IengineQueryParams]): string => {
    if (queryParams.length) {
      return `?${queryParams.map((x) => {
        let res = '';
        if (x.id) res = `id=${x.id}`;
        if (x.status) res += `&status=${x.status}`;
        return res;
      })}`;
    }
    return '';
  };

  startORStopCarEngine = async (queryParams: [IengineQueryParams]): Promise<IraceResult> => {
    let result;
    try {
      const response = await fetch(`${this.basePath}/engine${this.generateEngineQueryString(queryParams)}`);
      errorHandler(response, SUCSESS);
      result = await response.json();
      // console.log('EngineResult = ', result);
    } catch (error) { printErrorMessage(error, 'start/stop engine'); }
    return result;
  };

  switchEngineDrive = async (queryParams: [IengineQueryParams]): Promise<IraceResult> => {
    let result;
    try {
      const response = await fetch(`${this.basePath}/engine${this.generateEngineQueryString(queryParams)}`);
      errorHandler(response, SUCSESS);
      result = await response.json();
      result = {
        success: 'true',
        id: queryParams[0].id,
      };
    } catch (error) {
      printErrorMessage(error, 'switch engine');
      // console.log('ERROR id = ', queryParams[0].id);
      result = {
        success: 'false',
        id: queryParams[0].id,
      };
    }
    return result;
  };
}
