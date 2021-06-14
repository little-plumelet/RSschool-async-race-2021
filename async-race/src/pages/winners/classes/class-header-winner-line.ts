import createDomElement from '../../shared-functions/create-dom-element';
import headerWinnerLineParams from '../params/header-winner-line-params';

export default class HeaderWinnerLine {
  winnerLineContainer: HTMLElement;

  nbr: HTMLElement;

  carIconEl: HTMLElement;

  carNameEl: HTMLElement;

  winsNumberEl: HTMLElement;

  bestTimeEl: HTMLElement;

  constructor() {
    this.winnerLineContainer = createDomElement(headerWinnerLineParams.container);
    this.nbr = createDomElement(headerWinnerLineParams.Nbr);
    this.carIconEl = createDomElement(headerWinnerLineParams.carIcon);
    this.carNameEl = createDomElement(headerWinnerLineParams.carName);
    this.winsNumberEl = createDomElement(headerWinnerLineParams.wins);
    this.bestTimeEl = createDomElement(headerWinnerLineParams.time);

    this.winnerLineContainer.appendChild(this.nbr);
    this.winnerLineContainer.appendChild(this.carIconEl);
    this.winnerLineContainer.appendChild(this.carNameEl);
    this.winnerLineContainer.appendChild(this.winsNumberEl);
    this.winnerLineContainer.appendChild(this.bestTimeEl);
  }
}
