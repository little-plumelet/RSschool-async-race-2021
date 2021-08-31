import './styles.scss';
import header from './pages/create-header';
import footer from './pages/create-footer';
import pageGarage from './pages/garage/create-page-garage';
import pageWinners from './pages/winners/create-page-winners';
import router from './router/create-router';
import navToSubPage from './shared/functions/function-subpage-navigation';
import getCurrerntPageNbr from './shared/functions/function-get-current-page-number';

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
    pageGarage.garagePrevPageButton.classList.remove('disabled');
    if ((pageNbr) === pageGarage.garagePagesNbr) pageGarage.garageNextPageButton.classList.add('disabled');
    pageGarage.garagePrevPageButton.classList.remove('disabled');
    if ((pageNbr) === 1) pageGarage.garagePrevPageButton.classList.add('disabled');
  } else {
    pageGarage.garageContainer.classList.add('hidden');
    pageWinners.winnersContainer.classList.remove('hidden');
    const pageNbr = getCurrerntPageNbr();
    router.add(`winners/${pageNbr}`, navToSubPage(pageNbr, pageWinners));
    pageWinners.winnersNextPageButton.classList.remove('disabled');
    pageGarage.pageNbrForReturn = getCurrerntPageNbr();
    if ((pageNbr) === pageWinners.winnersPagesNbr) pageWinners.winnersNextPageButton.classList.add('disabled');
    pageGarage.garagePrevPageButton.classList.add('disabled');
    if ((pageNbr) === 1) pageWinners.winnersPrevPageButton.classList.add('disabled');
  }
});
