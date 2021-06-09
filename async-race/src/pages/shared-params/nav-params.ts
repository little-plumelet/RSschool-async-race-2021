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
    attributes: [['href', './#garage/1']],
    result: 'TO GARAGE',
  },
  navRefWinners: {
    tegName: 'a',
    classNames: ['item-ref'],
    attributes: [['href', './#winners/1']],
    result: 'TO WINNERS',
  },
};

export default navParams;
