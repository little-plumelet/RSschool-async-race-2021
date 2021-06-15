const headerWinnerLineParams = {
  container: {
    tegName: 'tr',
    classNames: ['winner-line-header'],
    attributes: [[]],
  },
  Nbr: {
    tegName: 'th',
    classNames: ['winner-nbr-header'],
    attributes: [[]],
    result: '№',
  },
  carName: {
    tegName: 'th',
    classNames: ['winner-line-name-header'],
    attributes: [[]],
    result: 'Name',
  },
  wins: {
    tegName: 'th',
    classNames: ['winner-wins-number-header', 'ascended'],
    attributes: [[]],
    result: 'Wins',
  },
  time: {
    tegName: 'th',
    classNames: ['winner-best-time-header', 'ascended'],
    attributes: [[]],
    result: 'Best Time(sec)',
  },
  ArrowUp: {
    tegName: 'img',
    classNames: ['arrow', 'arrow-hidden', 'arrow-up'],
    attributes: [['src', './public/images/arrow_up.png']],
  },
  ArrowDown: {
    tegName: 'img',
    classNames: ['arrow', 'arrow-hidden', 'arrow-down'],
    attributes: [['src', './public/images/arrow_down.png']],
  },
  carIcon: {
    tegName: 'th',
    classNames: ['winner-car-icon-header'],
    attributes: [[]],
    result: 'Car icon',
  },
};

export default headerWinnerLineParams;
