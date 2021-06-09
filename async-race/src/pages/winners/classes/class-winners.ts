import communicator from '../../../server-communication/create-communicator';
import winnersMainPageParams from '../params/winners-main-page-params';
import createDomElement from '../../shared-functions/create-dom-element';
import WinnerLine from './class-winner-line';
import { Iwinner } from '../../../shared/interfaces-communicator';
import { WINNERSPERPAGE } from '../../../shared/constants';

export default class Winners {
  winnersContainer: HTMLElement;

  setOfWinners: WinnerLine[];

  winnersTitleBlock: HTMLElement;

  winnersTitle: HTMLElement;

  winnersTotalNbr: number;

  winnersTotalNbrEl: HTMLElement;

  winnersPagesContainer: HTMLElement;

  winnersPagesNbr: number;

  pageName: string;

  constructor() {
    this.pageName = 'winners';
    this.winnersPagesNbr = 1;
    this.winnersTotalNbr = 0;
    this.setOfWinners = [];
    this.winnersContainer = createDomElement(winnersMainPageParams.container);
    this.winnersTitleBlock = createDomElement(winnersMainPageParams.titleContainer);
    this.winnersTitle = createDomElement(winnersMainPageParams.title);
    this.winnersTotalNbrEl = createDomElement(winnersMainPageParams.totalNbrWinners);
    this.winnersPagesContainer = createDomElement(winnersMainPageParams.subPagesContainer);

    this.createPagesOfWinners();

    this.winnersTitleBlock.appendChild(this.winnersTitle);
    this.winnersTitleBlock.appendChild(this.winnersTotalNbrEl);
    this.winnersContainer.appendChild(this.winnersTitleBlock);
    this.winnersContainer.appendChild(this.winnersPagesContainer);
    // this.getWinnersTotalNbr();
    this.calculatePagesNbr();
  }

  getWinnersTotalNbr = async (): Promise<void> => {
    await communicator.getWinners([{ limitOrPage: { key: '_limit', value: 10 } }]);
    console.log('winners', communicator.countXWinners);
    this.winnersTotalNbrEl.innerText = `(${communicator.countXWinners})`;
    this.winnersTotalNbr = communicator.countXWinners;
  };

  calculatePagesNbr = async (): Promise<void> => {
    await communicator.getCars([{}, { key: '_limit', value: 10 }]); // нет ясности как пользоваться данным параметром правильно
    this.winnersPagesNbr = Math.ceil(communicator.countXCars / WINNERSPERPAGE);
  };

  createSetOfWinnerLines = async (): Promise<void> => {
    const winnersArr: Iwinner[] = [];
    const winners = await communicator.getWinners([{}, {}]);
    console.log('WWWW', winners);
    winners.forEach((element) => {
      if (element) winnersArr.push(element);
    });
    console.log('WWWWARR', winnersArr);
    winnersArr.forEach((element) => {
      const winnerLine = new WinnerLine(element);
      this.setOfWinners.push(winnerLine);
    });
  };

  renderWinnersTable(): void {
    let carId = 1;
    const winnersSubPage = createDomElement(winnersMainPageParams.subPageContainer);
    winnersSubPage.setAttribute('id', `winer-page-${carId}`);
    while (this.winnersPagesContainer.firstElementChild) {
      this.winnersPagesContainer.firstElementChild.remove();
    }
    for (let i = 0; i < this.setOfWinners.length; i += 1) {
      carId += 1;
      winnersSubPage.appendChild(this.setOfWinners[i].winnerLineContainer);
    }
    this.winnersPagesContainer.appendChild(winnersSubPage);
    this.getWinnersTotalNbr();
    this.calculatePagesNbr();
  }

  createPagesOfWinners = async (): Promise<void> => {
    await this.getWinnersTotalNbr();
    await this.createSetOfWinnerLines();
    this.renderWinnersTable();
  };
}
