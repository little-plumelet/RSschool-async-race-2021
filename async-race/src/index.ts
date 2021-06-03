import Communicator from './server-communication/class-communicator';
import { BASE_PATH, ROUT_PATH } from './shared/constants';

console.log('Hello!!!');
const communicator = new Communicator(BASE_PATH, ROUT_PATH);

console.log(communicator.smallPathes.garage);
const main = async () => {
  const newCar = await communicator.createCar({ name: 'CITROEN', color: '#111111' });
  const deletedCar = await communicator.deleteCar(1);
  const listCars = await communicator.getCars([{ key: '_page', value: 1 }, { key: '_limit', value: 8 }]);
  // communicator.getCar(1);
  const updatedCar = await communicator.updateCar(5, { name: 'REALCAR', color: '#777777' });
  console.log('newCar = ', newCar);
  console.log('list = ', listCars);
  console.log('updated car = ', updatedCar);
  console.log('X!!!! = ', communicator.countX);
};

main();
