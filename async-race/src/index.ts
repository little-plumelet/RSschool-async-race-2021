import './styles.scss';
import header from './pages/create-header';
import footer from './pages/create-footer';
import pageGarage from './pages/garage/create-page-garage';
import pageWinners from './pages/winners/create-page-winners';
import communicator from './server-communication/create-communicator';
import router from './router/create-router';
import navToSubPage from './shared/functions/function-subpage-navigation';
import getCurrerntPageNbr from './shared/functions/function-get-current-page-number';
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
document.body.appendChild(footer.footer);
router.add('garage/1', navToSubPage(1, pageGarage)); // страница при обновлениии

window.addEventListener('popstate', () => {
  // highlightNavItem(window.location.hash);
  if (window.location.hash.includes('#garage')) {
    pageGarage.garageContainer.classList.remove('hidden');
    pageWinners.winnersContainer.classList.add('hidden');
    const pageNbr = getCurrerntPageNbr();
    router.add(`garage/${pageNbr}`, navToSubPage(pageNbr, pageGarage));
    pageGarage.pageNbrForReturn = getCurrerntPageNbr();
  } else {
    pageGarage.garageContainer.classList.add('hidden');
    pageWinners.winnersContainer.classList.remove('hidden');
    const pageNbr = getCurrerntPageNbr();
    router.add(`winners/${pageNbr}`, navToSubPage(pageNbr, pageWinners));
    pageGarage.pageNbrForReturn = getCurrerntPageNbr();
  }
});
pageWinners.sortByWinsNbr('ASC');

// let prev = performance.now();
// let times = 0;

// requestAnimationFrame(function measure(time) {
//   document.body.insertAdjacentHTML('beforeEnd', Math.floor(time - prev) + ' ');
//   prev = time;

//   times += 1;
//   if (times < 10) requestAnimationFrame(measure);
// });
