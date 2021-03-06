import createDomElement from '../../shared-functions/create-dom-element';
import winnerLineParams from '../params/winner-line-params';
import { Iwinner } from '../../../shared/interfaces-communicator';
import communicator from '../../../server-communication/create-communicator';
import iconCarSvg from '../../../shared/icon-car-svg';
import CONSTANTS from '../../../shared/constants';

const { iconWinnerWidth } = CONSTANTS;

export default class WinnerLine {
  winnerLineContainer: HTMLElement;

  winnerId: number;

  carIconContainer: HTMLElement;

  carNbrEl: HTMLElement;

  carName: string;

  carNameEl: HTMLElement;

  winsNumber: number;

  winsNumberEl: HTMLElement;

  bestTime: number;

  bestTimeEl: HTMLElement;

  constructor(param: Iwinner) {
    this.carName = '';
    this.winnerId = param.id;
    this.winsNumber = param.wins;
    this.bestTime = param.time;

    this.winnerLineContainer = createDomElement(winnerLineParams.container);
    this.carNbrEl = createDomElement(winnerLineParams.nbr);
    this.carIconContainer = createDomElement(winnerLineParams.carIcon);
    this.carNameEl = createDomElement(winnerLineParams.carName);
    this.winsNumberEl = createDomElement(winnerLineParams.wins);
    this.bestTimeEl = createDomElement(winnerLineParams.time);

    this.winnerLineContainer.appendChild(this.carNbrEl);
    this.winnerLineContainer.appendChild(this.carIconContainer);
    this.winnerLineContainer.appendChild(this.carNameEl);
    this.winnerLineContainer.appendChild(this.winsNumberEl);
    this.winnerLineContainer.appendChild(this.bestTimeEl);
    this.fillWinnerLine();
  }

  createCarIcon(color: string): void {
    this.carIconContainer.innerHTML = iconCarSvg;
    this.carIconContainer.firstElementChild?.firstElementChild?.setAttribute('fill', color);
    this.carIconContainer.firstElementChild?.setAttribute('width', `${iconWinnerWidth}pt`);
    this.carIconContainer.firstElementChild?.setAttribute('height', `${iconWinnerWidth}pt`);
  }

  fillWinnerLine = async (): Promise<void> => {
    const winner = await communicator.getCar(this.winnerId);
    this.carName = winner.name;
    this.createCarIcon(winner.color);
    this.carNameEl.innerText = winner.name;
    this.winsNumberEl.innerText = this.winsNumber.toString();
    this.bestTimeEl.innerText = this.bestTime.toString();
  };
}
