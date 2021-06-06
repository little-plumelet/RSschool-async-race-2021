const navParams = {
  nav: {
    tegName: 'nav',
    classNames: ['navigation', 'header-nav'],
    attributes: [[]],
  },

  navUl: {
    tegName: 'ul',
    classNames: ['navigation-list'],
    attributes: [[]],
  },
  navLi: {
    tegName: 'li',
    classNames: ['navigation-list-item'],
    attributes: [[]],
  },
  navRefGarage: {
    tegName: 'a',
    classNames: ['item-ref'],
    attributes: [['href', './#garage']],
    result: 'TO GARAGE',
  },
  navRefWinners: {
    tegName: 'a',
    classNames: ['item-ref'],
    attributes: [['href', './#winners']],
    result: 'TO WINNERS',
  },
};

export default navParams;
