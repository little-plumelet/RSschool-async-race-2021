import {
  IsmallPathes,
  Icar,
  IcarsQueryParams,
  Iwinner,
  IwinnersQueryParams,
  IengineQueryParams,
} from '../shared/interfaces';

export default class Communicator {
  basePath: string;

  smallPathes: {
    garage: string,
    winners: string,
  };

  countXCars: number;

  countXWinners: number;

  constructor(basePath: string, smallPathes: IsmallPathes) {
    this.basePath = basePath;
    this.smallPathes = smallPathes;
    this.countXCars = 0;
    this.countXWinners = 0;
  }

  // methods for garage
  private generateCarsQueryString = (queryParams: IcarsQueryParams[]): string => {
    if (queryParams.length) {
      return `?${queryParams.map((x) => `${x.key}=${x.value}`).join('&')}`;
    }
    return '';
  };

  getCars = async (queryParams: IcarsQueryParams[]): Promise<Response> => {
    const responce = await fetch(`${this.basePath}${this.smallPathes.garage}${this.generateCarsQueryString(queryParams)}`);
    const carsList = await responce.json();
    this.countXCars = Number(responce.headers.get('X-Total-Count'));
    console.log('request = ', `${this.basePath}${this.smallPathes.garage}${this.generateCarsQueryString(queryParams)}`);
    console.log('carsList = ', carsList);
    console.log('countXCARS = ', this.countXCars);
    return carsList;
  };

  getCar = async (id: number): Promise<Response> => {
    const response = await fetch(`${this.basePath}${this.smallPathes.garage}/${id}`);
    const car = await response.json();
    console.log('car = ', car);
    return car;
  };

  createCar = async (carParam: Icar): Promise<Response> => {
    const response = await fetch(`${this.basePath}${this.smallPathes.garage}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(carParam),
    });
    const car = await response.json();
    return car;
  };

  updateCar = async (id: number, carParam: Icar): Promise<Response> => {
    const response = await fetch(`${this.basePath}${this.smallPathes.garage}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(carParam),
    });
    const car = await response.json();
    return car;
  };

  deleteCar = async (id: number): Promise<Response> => {
    const response = await fetch(`${this.basePath}${this.smallPathes.garage}/${id}`, {
      method: 'DELETE',
    });
    const deletedCar = await response.json();
    return deletedCar;
  };

  // methods for winners
  private generateWinnersQueryString = (queryParams: IwinnersQueryParams[]): string => {
    if (queryParams.length) {
      return `?${queryParams.map((x) => {
        let res = '';
        if (x.limitOrPage) {
          res = `${x.limitOrPage.key}=${x.limitOrPage.value}`;
        }
        if (x.sort) {
          res += `${x.sort.key}=${x.sort.value}`;
        }
        if (x.sortOrder) {
          res += `${x.sortOrder.key}=${x.sortOrder.value}`;
        }
        return res;
      }).join('&')}`;
    }
    return '';
  };

  getWinners = async (queryParams: IwinnersQueryParams[]): Promise<Response> => {
    const responce = await fetch(`${this.basePath}${this.smallPathes.winners}${this.generateWinnersQueryString(queryParams)}`);
    const winnersList = await responce.json();
    this.countXWinners = Number(responce.headers.get('X-Total-Count'));
    console.log('winnersList = ', winnersList);
    console.log('countXWINNERS = ', this.countXWinners);
    return winnersList;
  };

  getWinner = async (id: number): Promise<Response> => {
    const response = await fetch(`${this.basePath}${this.smallPathes.winners}/${id}`);
    const winner = await response.json();
    console.log('winner = ', winner);
    return winner;
  };

  createWinner = async (winnerParam: Iwinner): Promise<Response> => {
    const response = await fetch(`${this.basePath}${this.smallPathes.winners}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(winnerParam),
    });
    const winner = await response.json();
    return winner;
  };

  updateWinner = async (id: number, winnerParam: Iwinner): Promise<Response> => {
    const response = await fetch(`${this.basePath}${this.smallPathes.winners}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(winnerParam),
    });
    const winner = await response.json();
    return winner;
  };

  deleteWinner = async (id: number): Promise<Response> => {
    const response = await fetch(`${this.basePath}${this.smallPathes.winners}/${id}`, {
      method: 'DELETE',
    });
    const deletedWinner = await response.json();
    return deletedWinner;
  };

  // methods for engine
  private generateEngineQueryString = (queryParams: [IengineQueryParams]): string => {
    if (queryParams.length) {
      return `?${queryParams.map((x) => {
        let res = '';
        if (x.id) {
          res = `id=${x.id}`;
        }
        if (x.status) {
          res += `&status=${x.status}`;
        }
        return res;
      })}`;
    }
    return '';
  };

  startORStopCarEngine = async (queryParams: [IengineQueryParams]): Promise<Response> => {
    const response = await fetch(`${this.basePath}/engine${this.generateEngineQueryString(queryParams)}`);
    const result = await response.json();
    console.log('EngineResult = ', result);
    return result;
  };

  switchEngineDrive = async (queryParams: [IengineQueryParams]): Promise<Response> => {
    const response = await fetch(`${this.basePath}/engine${this.generateEngineQueryString(queryParams)}`);
    const result = await response.json();
    console.log('EngineDriveResult = ', result);
    return result;
  };
}
