import Communicator from './class-communicator';
import { BASE_PATH, ROUT_PATH } from '../shared/constants-server';

const communicator = new Communicator(BASE_PATH, ROUT_PATH);
console.log(communicator.smallPathes.garage);
export default communicator;
