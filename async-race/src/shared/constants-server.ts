import { IsmallPathes } from './interfaces-communicator';

const BASE_PATH = 'http://127.0.0.1:3000'; // путь к серверу для запросов
const SUCSESS = 200;
const SUCSESS201 = 201;
const ROUT_PATH: IsmallPathes = {
  garage: '/garage',
  winners: '/winners',
};

export {
  BASE_PATH,
  ROUT_PATH,
  SUCSESS,
  SUCSESS201,
};
