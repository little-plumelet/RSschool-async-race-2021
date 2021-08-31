const garageMainPageParams = {
  container: {
    tegName: 'div',
    classNames: ['garage-main-container'],
    attributes: [[]],
  },
  titleContainer: {
    tegName: 'div',
    classNames: ['garage-title-container'],
    attributes: [[]],
  },
  title: {
    tegName: 'h2',
    classNames: ['garage-title'],
    attributes: [[]],
    result: 'GARAGE',
  },
  totalNbrCars: {
    tegName: 'div',
    classNames: ['garage-cars-number'],
    attributes: [[]],
  },
  subPagesContainer: {
    tegName: 'div',
    classNames: ['garage-subpages-container'],
    attributes: [[]],
  },
  subPageContainer: {
    tegName: 'div',
    classNames: ['garage-subpage-container'],
    attributes: [[]],
  },
  subPageTitle: {
    tegName: 'h3',
    classNames: ['garage-subpage-title'],
    attributes: [[]],
  },
  nextPageButton: {
    tegName: 'button',
    classNames: ['garage-button', 'garage-button_next', 'disabled'],
    attributes: [['type', 'button']],
    result: 'NEXT',
  },
  prevPageButton: {
    tegName: 'button',
    classNames: ['garage-button', 'garage-button_prev', 'disabled'],
    attributes: [['type', 'button']],
    result: 'PREV',
  },
};

export default garageMainPageParams;
