import createDomElement from '../shared-functions/create-dom-element';
import navParams from '../shared-params/nav-params';

export default class Nav {
  nav: HTMLElement;

  navUl: HTMLElement;

  navLiFirst: HTMLElement;

  navLiSecond: HTMLElement;

  navRefGarage: HTMLElement;

  navRefWinners: HTMLElement;

  constructor() {
    this.nav = createDomElement(navParams.nav);
    this.navUl = createDomElement(navParams.navUl);
    this.navLiFirst = createDomElement(navParams.navLi);
    this.navLiSecond = createDomElement(navParams.navLi);
    this.navRefGarage = createDomElement(navParams.navRefGarage);
    this.navRefWinners = createDomElement(navParams.navRefWinners);

    this.navLiFirst.appendChild(this.navRefGarage);
    this.navLiSecond.appendChild(this.navRefWinners);
    this.navUl.appendChild(this.navLiFirst);
    this.navUl.appendChild(this.navLiSecond);
    this.nav.appendChild(this.navUl);
  }
}
