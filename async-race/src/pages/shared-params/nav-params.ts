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
    classNames: ['item-ref', 'item-ref_garage'],
    attributes: [['href', '#']],
    result: 'TO GARAGE',
  },
  navRefWinners: {
    tegName: 'a',
    classNames: ['item-ref', 'item-ref_winners'],
    attributes: [['href', '#']],
    result: 'TO WINNERS',
  },
};

export default navParams;
