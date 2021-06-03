import { IsmallPathes, Icar, IcarsQueryParams } from '../shared/interfaces';

export default class Communicator {
  basePath: string;

  smallPathes: {
    garage: string,
    winners: string,
  };

  countX: number;

  constructor(basePath: string, smallPathes: IsmallPathes) {
    this.basePath = basePath;
    this.smallPathes = smallPathes;
    this.countX = 0;
  }

  private generateQueryString = (queryParams: IcarsQueryParams[]): string => {
    if (queryParams.length) {
      return `?${queryParams.map((x) => `${x.key}=${x.value}`).join('&')}`;
    }
    return '';
  };

  // methods for garage
  getCars = async (queryParams: IcarsQueryParams[]): Promise<Response> => {
    const responce = await fetch(`${this.basePath}${this.smallPathes.garage}${this.generateQueryString(queryParams)}`);
    const carsList = await responce.json();
    this.countX = Number(responce.headers.get('X-Total-Count'));
    console.log('carsList = ', carsList);
    console.log('countX = ', this.countX);
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
    const car = await response.json();
    return car;
  };

  // methods for winners
}
