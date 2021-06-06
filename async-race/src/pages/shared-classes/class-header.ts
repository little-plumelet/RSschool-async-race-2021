import Nav from './class-navigation';

export default class Header {
  header: HTMLElement;

  navpanel: HTMLElement;

  constructor() {
    const nav = new Nav();
    this.header = document.createElement('header');
    this.navpanel = nav.nav;

    this.header.appendChild(this.navpanel);
  }
}
