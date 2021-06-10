import communicator from '../../../server-communication/create-communicator';
import winnersMainPageParams from '../params/winners-main-page-params';
import createDomElement from '../../shared-functions/create-dom-element';
import WinnerLine from './class-winner-line';
import createSubPage from '../../shared-functions/create-sub-page';
import { Iwinner, IraceResult } from '../../../shared/interfaces-communicator';
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

  pageNbrForReturn: number;

  constructor() {
    this.pageName = 'winners';
    this.winnersPagesNbr = 1;
    this.winnersTotalNbr = 0;
    this.pageNbrForReturn = 1;
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
    winners.forEach((element) => {
      if (element) winnersArr.push(element);
    });
    console.log('WWWWARR', winnersArr);
    this.setOfWinners = [];
    winnersArr.forEach((element) => {
      const winnerLine = new WinnerLine(element);
      this.setOfWinners.push(winnerLine);
    });
  };

  renderWinnersTable = async (): Promise<void> => {
    while (this.winnersPagesContainer.firstElementChild) {
      this.winnersPagesContainer.firstElementChild.remove();
    }
    await this.calculatePagesNbr();
    for (let j = 0; j < this.winnersPagesNbr; j += 1) {
      const winnersSubPage = createSubPage(j + 1, winnersMainPageParams);
      for (let i = 0; i < WINNERSPERPAGE; i += 1) {
        if (this.setOfWinners[j * WINNERSPERPAGE + i]) {
          winnersSubPage.appendChild(this.setOfWinners[j * WINNERSPERPAGE + i].winnerLineContainer);
        }
      }
      this.winnersPagesContainer.appendChild(winnersSubPage);
      this.winnersPagesContainer.appendChild(winnersSubPage);
    }
    await this.getWinnersTotalNbr();
    await this.calculatePagesNbr();
  };

  createPagesOfWinners = async (): Promise<void> => {
    await this.getWinnersTotalNbr();
    await this.createSetOfWinnerLines();
    this.renderWinnersTable();
  };

  updateWinnersTable = async (winnerCompaund: {
    winner: IraceResult;
    timeWinner: number;
  }): Promise<void> => {
    let flagUpdated = false;
    const winsStartNbr = 1;

    if (winnerCompaund.winner.id) {
      const winnerParam = {
        id: winnerCompaund.winner.id,
        wins: winsStartNbr,
        time: winnerCompaund.timeWinner,
      };
      this.setOfWinners.forEach((element) => {
        if (element.winnerId === winnerCompaund.winner.id) {
          if (element.bestTime < winnerCompaund.timeWinner) {
            winnerParam.time = element.bestTime;
          }
          winnerParam.wins = element.winsNumber + 1;
          flagUpdated = true;
        }
      });
      if (flagUpdated) await communicator.updateWinner(winnerParam.id, winnerParam);
      else await communicator.createWinner(winnerParam);
      this.calculatePagesNbr();
      this.createPagesOfWinners();
    }
  };

  removeWinner = async (id: number): Promise<void> => {
    let winnerLine;
    this.setOfWinners.forEach((element) => {
      if (element.winnerId === id) {
        winnerLine = element;
      }
    });
    if (winnerLine) {
      await communicator.deleteWinner(id);
      const index = this.setOfWinners.indexOf(winnerLine);
      this.setOfWinners.splice(index, 1);
      console.log('88888', this.setOfWinners);
      this.renderWinnersTable();
    }
  };
}
