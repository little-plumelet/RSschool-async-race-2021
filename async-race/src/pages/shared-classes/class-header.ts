import Nav from './class-navigation';
import pageGarage from '../garage/create-page-garage';
import pageWinners from '../winners/create-page-winners';
import router from '../../router/create-router';
import navToSubPage from '../../shared/functions/function-subpage-navigation';
import getCurrerntPageNbr from '../../shared/functions/function-get-current-page-number';

export default class Header {
  header: HTMLElement;

  navpanel: HTMLElement;

  constructor() {
    const nav = new Nav();
    this.header = document.createElement('header');
    this.navpanel = nav.nav;

    this.header.appendChild(this.navpanel);
    this.navListeners();
  }

  navListeners(): void {
    this.navpanel.addEventListener('click', (e) => {
      e.preventDefault();
      if ((e.target as HTMLElement).classList.contains('item-ref_garage')) {
        pageWinners.pageNbrForReturn = getCurrerntPageNbr();
        pageGarage.garageContainer.classList.remove('hidden');
        pageWinners.winnersContainer.classList.add('hidden');
        router.add(`garage/${pageWinners.pageNbrForReturn}`, navToSubPage(pageWinners.pageNbrForReturn, pageWinners));
      }

      if ((e.target as HTMLElement).classList.contains('item-ref_winners')) {
        pageGarage.pageNbrForReturn = getCurrerntPageNbr();
        pageGarage.garageContainer.classList.add('hidden');
        pageWinners.winnersContainer.classList.remove('hidden');
        router.add(`winners/${pageGarage.pageNbrForReturn}`, navToSubPage(pageGarage.pageNbrForReturn, pageGarage));
      }
    });
  }
}
