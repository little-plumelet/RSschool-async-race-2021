import './styles.scss';
import header from './pages/create-header';
import pageGarage from './pages/garage/create-page-garage';
import pageWinners from './pages/winners/create-page-winners';
import communicator from './server-communication/create-communicator';
// import Communicator from './server-communication/class-communicator';
// import { BASE_PATH, ROUT_PATH } from './shared/constants';

// console.log('Hello!!!');
// const communicator = new Communicator(BASE_PATH, ROUT_PATH);

// console.log(communicator.smallPathes.garage);
const main = async () => {
  // const newCar = await communicator.createCar({ name: 'CITROEN', color: '#111111' });
  // // const deletedCar = await communicator.deleteCar(1);
  const listCars = await communicator.getCars([{ key: '_page', value: 1 }, { key: '_limit', value: 8 }]);
  // const GGG = await communicator.getCar(112);
  // const updatedCar = await communicator.updateCar(5, { name: 'REALCAR', color: '#777777' });
  // // const newWinner = await communicator.createWinner({ id: 135, wins: 2, time: 28 });
  const winners = await communicator.getWinners([{ limitOrPage: { key: '_page', value: 1 } }, { limitOrPage: { key: '_limit', value: 3 } }]);
  // const winner = await communicator.getWinner(1);
  // const engine = await communicator.startORStopCarEngine([{ id: 2002, status: 'started' }]);
  // const engineDrive = await communicator.switchEngineDrive([{ id: 2, status: 'drive' }]);
  // console.log('GGGGCar = ', GGG.name);
  console.log('list = ', listCars);
  // console.log('updated car = ', updatedCar);
  // console.log('X!!!! = ', communicator.countXCars);
  // // console.log('newWinner = ', newWinner);
  // console.log('w = ', winner);
  console.log('winners = ', winners);
  // console.log('engine = ', engine);
  // console.log('engineDrive = ', engineDrive);
};

main();

//  подумать куда перенести template
document.body.appendChild(header.header);
document.body.appendChild(pageGarage.garageContainer);
document.body.appendChild(pageWinners.winnersContainer);
