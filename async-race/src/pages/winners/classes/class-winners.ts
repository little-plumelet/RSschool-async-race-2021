import communicator from '../../../server-communication/create-communicator';
import winnersMainPageParams from '../params/winners-main-page-params';
import createDomElement from '../../shared-functions/create-dom-element';
import WinnerLine from './class-winner-line';
import createSubPage from '../../shared-functions/create-sub-page';
import getCurrerntPageNbr from '../../../shared/functions/function-get-current-page-number';
import router from '../../../router/create-router';
import { IwinnersQueryParams, Iwinner, IraceResult } from '../../../shared/interfaces-communicator';
import { WINNERSPERPAGE } from '../../../shared/constants';
import headerWinnerLineParams from '../params/header-winner-line-params';
import HeaderWinnerLine from './class-header-winner-line';
import winnerLineParams from '../params/winner-line-params';

function winsSort(winners: Iwinner[], order: string): Iwinner[] {
  const res = [];
  if (order === 'ASC') {
    while (winners.length) {
      const min = winners[0].wins;
      let j = 0;
      for (let i = 1; i < winners.length; i += 1) {
        if (min > winners[i].wins) {
          j = i;
          break;
        }
      }
      res.push(winners[j]);
      winners.splice(j, 1);
    }
  }
  return res;
}

export default class Winners {
  winnersContainer: HTMLElement;

  setOfWinners: WinnerLine[];

  winnersTitleBlock: HTMLElement;

  winnersTitle: HTMLElement;

  winnersTotalNbr: number;

  winnersTotalNbrEl: HTMLElement;

  winnersPagesContainer: HTMLElement;

  winnersPagesNbr: number;

  winnersNextPageButton: HTMLElement;

  winnersPrevPageButton: HTMLElement;

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
    this.winnersNextPageButton = createDomElement(winnersMainPageParams.nextPageButton);
    this.winnersPrevPageButton = createDomElement(winnersMainPageParams.prevPageButton);

    this.winnersTitleBlock.appendChild(this.winnersTitle);
    this.winnersTitleBlock.appendChild(this.winnersTotalNbrEl);
    this.winnersContainer.appendChild(this.winnersTitleBlock);
    this.winnersContainer.appendChild(this.winnersPagesContainer);
    this.winnersContainer.appendChild(this.winnersPrevPageButton);
    this.winnersContainer.appendChild(this.winnersNextPageButton);
    this.calculatePagesNbr();
    this.listenTOWinnersPage();
  }

  getWinnersTotalNbr = async (): Promise<void> => {
    await communicator.getWinners([{ limitOrPage: { key: '_limit', value: 10 } }]);
    console.log('winners', communicator.countXWinners);
    this.winnersTotalNbrEl.innerText = `(${communicator.countXWinners})`;
    this.winnersTotalNbr = communicator.countXWinners;
  };

  calculatePagesNbr = async (): Promise<void> => {
    await communicator.getCars([{}, { key: '_limit', value: 10 }]); // нет ясности как пользоваться данным параметром правильно
    this.winnersPagesNbr = Math.ceil(communicator.countXWinners / WINNERSPERPAGE);
  };

  createSetOfWinnerLines = async (params: IwinnersQueryParams): Promise<void> => {
    const winnersArr: Iwinner[] = [];
    let winners = await communicator.getWinners([{}, {}]);
    if (params.sort?.value === 'wins' && params.sortOrder?.value) {
      winners = winsSort(winners, params.sortOrder.value);
    }
    console.log('++++', winners);
    winners.forEach((element) => {
      if (element) winnersArr.push(element);
    });
    this.setOfWinners = [];
    winnersArr.forEach((element) => {
      const winnerLine = new WinnerLine(element);
      this.setOfWinners.push(winnerLine);
    });
    console.log('$$$$$$', winners);
  };

  renderWinnersTable = async (): Promise<void> => {
    while (this.winnersPagesContainer.firstElementChild) {
      this.winnersPagesContainer.firstElementChild.remove();
    }
    await this.calculatePagesNbr();
    for (let j = 0; j < this.winnersPagesNbr; j += 1) {
      const winnersSubPage = createSubPage(j + 1, winnersMainPageParams);
      const winnersHeaderLine = new HeaderWinnerLine().winnerLineContainer;
      winnersSubPage.appendChild(winnersHeaderLine);
      if ((j + 1) < this.winnersPagesNbr) this.winnersNextPageButton.classList.remove('disabled');
      for (let i = 0; i < WINNERSPERPAGE; i += 1) {
        if (this.setOfWinners[j * WINNERSPERPAGE + i]) {
          (this.setOfWinners[j * WINNERSPERPAGE + i]).carNbrEl.innerText = `${i + 1}`;
          winnersSubPage.appendChild(this.setOfWinners[j * WINNERSPERPAGE + i].winnerLineContainer);
        }
      }
      this.winnersPagesContainer.appendChild(winnersSubPage);
    }
    await this.getWinnersTotalNbr();
    await this.calculatePagesNbr();
  };

  createPagesOfWinners = async (): Promise<void> => {
    await this.getWinnersTotalNbr();
    await this.createSetOfWinnerLines({});
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

  buttonNextHandler = async (): Promise<void> => {
    const pageNbr = getCurrerntPageNbr() + 1;
    this.pageNbrForReturn = getCurrerntPageNbr();
    this.winnersPagesContainer.childNodes.forEach((element) => {
      (element as HTMLElement).classList.add('hidden');
      if ((element as HTMLElement).getAttribute('id') === `page-${pageNbr}`) {
        (element as HTMLElement).classList.remove('hidden');
        router.add(`winners/${pageNbr}`, () => {});
        console.log('nbr = ', pageNbr);
        if ((pageNbr) === this.winnersPagesNbr) this.winnersNextPageButton.classList.add('disabled');
        this.winnersPrevPageButton.classList.remove('disabled');
      }
    });
  };

  buttonPrevHandler = async (): Promise<void> => {
    const pageNbr = getCurrerntPageNbr() - 1;
    this.pageNbrForReturn = getCurrerntPageNbr();
    this.winnersPagesContainer.childNodes.forEach((element) => {
      (element as HTMLElement).classList.add('hidden');
      if ((element as HTMLElement).getAttribute('id') === `page-${pageNbr}`) {
        (element as HTMLElement).classList.remove('hidden');
        router.add(`winners/${pageNbr}`, () => {});
        if ((pageNbr) === 1) this.winnersPrevPageButton.classList.add('disabled');
        this.winnersNextPageButton.classList.remove('disabled');
      }
    });
  };

  sortByWinsNbr = async (order: string): Promise<void> => {
    const params = {
      sort: {
        key: '_sort',
        value: 'wins',
      },
      sortOrder: {
        key: '_order',
        value: order,
      },
    } as IwinnersQueryParams;
    this.createSetOfWinnerLines(params);
    this.renderWinnersTable();
  };

  listenTOWinnersPage = async (): Promise<void> => {
    this.winnersContainer.addEventListener('click', async (e): Promise<void> => {
      if ((e.target as HTMLElement).classList.contains('winners-button_next')) {
        await this.buttonNextHandler();
      }

      if ((e.target as HTMLElement).classList.contains('winners-button_prev')) {
        await this.buttonPrevHandler();
      }

      if ((e.target as HTMLElement).classList.contains('winners-button_prev')) {
        // await this.buttonPrevHandler();
      }
    });
    // 'ASC' | 'DESC',
  };
}
