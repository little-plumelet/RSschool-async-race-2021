import createDomElement from '../../shared-functions/create-dom-element';
import headerWinnerLineParams from '../params/header-winner-line-params';

export default class HeaderWinnerLine {
  winnerLineContainer: HTMLElement;

  nbr: HTMLElement;

  carIconEl: HTMLElement;

  carNameEl: HTMLElement;

  winsNumberEl: HTMLElement;

  winsArrowUpEl: HTMLElement;

  winsArrowDownEl: HTMLElement;

  bestTimeEl: HTMLElement;

  bestTimeArrowUpEl: HTMLElement;

  bestTimeArrowDownEl: HTMLElement;

  constructor() {
    this.winnerLineContainer = createDomElement(headerWinnerLineParams.container);
    this.nbr = createDomElement(headerWinnerLineParams.Nbr);
    this.carIconEl = createDomElement(headerWinnerLineParams.carIcon);
    this.carNameEl = createDomElement(headerWinnerLineParams.carName);
    this.winsNumberEl = createDomElement(headerWinnerLineParams.wins);
    this.winsArrowUpEl = createDomElement(headerWinnerLineParams.ArrowUp);
    this.winsArrowDownEl = createDomElement(headerWinnerLineParams.ArrowDown);
    this.bestTimeEl = createDomElement(headerWinnerLineParams.time);
    this.bestTimeArrowUpEl = createDomElement(headerWinnerLineParams.ArrowUp);
    this.bestTimeArrowDownEl = createDomElement(headerWinnerLineParams.ArrowDown);

    this.winnerLineContainer.appendChild(this.nbr);
    this.winnerLineContainer.appendChild(this.carIconEl);
    this.winnerLineContainer.appendChild(this.carNameEl);
    this.winnerLineContainer.appendChild(this.winsNumberEl);
    this.winnerLineContainer.appendChild(this.bestTimeEl);
    this.winsNumberEl.appendChild(this.winsArrowUpEl);
    this.winsNumberEl.appendChild(this.winsArrowDownEl);
    this.bestTimeEl.appendChild(this.bestTimeArrowUpEl);
    this.bestTimeEl.appendChild(this.bestTimeArrowDownEl);
  }
}
