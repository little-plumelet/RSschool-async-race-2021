import getCurrerntPageNbr from '../../shared/functions/function-get-current-page-number';

function getRandomIntInclusive(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min; // Максимум и минимум включаются
}

function disableToggleStartButtons(makeDisabled: boolean): void {
  const pageNbr = getCurrerntPageNbr();
  const participants = document.getElementById(`page-${pageNbr}`)?.childNodes;
  participants?.forEach((elements) => {
    if (elements.childNodes.length) {
      elements.childNodes.forEach((elem) => {
        if (elem.childNodes.length) {
          elem.childNodes.forEach((el) => {
            if (el.childNodes.length) {
              el.childNodes.forEach((e) => {
                if (e.nodeName !== '#text') {
                  if ((e as HTMLElement).classList.contains('move-control-button_start')) {
                    if (makeDisabled) (e as HTMLElement).classList.add('disabled');
                    else (e as HTMLElement).classList.remove('disabled');
                  }
                }
              });
            }
          });
        }
      });
    }
  });
}

function allStopButtonDisabled(): boolean {
  const pageNbr = getCurrerntPageNbr();
  const stopButtons = document.getElementById(`page-${pageNbr}`)?.childNodes;
  const stopButtonsArr = [] as HTMLElement[];
  let count = 0;

  stopButtons?.forEach((elements) => {
    if (elements.childNodes.length) {
      elements.childNodes.forEach((elem) => {
        if (elem.childNodes.length) {
          elem.childNodes.forEach((el) => {
            if (el.childNodes.length) {
              el.childNodes.forEach((e) => {
                if (e.nodeName !== '#text') {
                  if ((e as HTMLElement).classList.contains('move-control-button_stop')) {
                    stopButtonsArr.push(e as HTMLElement);
                  }
                }
              });
            }
          });
        }
      });
    }
  });
  stopButtonsArr.forEach((el) => {
    if (el.classList.contains('disabled')) count += 1;
  });
  if (count === stopButtonsArr.length) return true;
  return false;
}

function allCarsOfSubPageOnStartPosition(): boolean {
  const pageNbr = getCurrerntPageNbr();
  const stopButtons = document.getElementById(`page-${pageNbr}`)?.childNodes;
  const carsArr = [] as HTMLElement[];
  let count = 0;

  stopButtons?.forEach((elements) => {
    if (elements.childNodes.length) {
      elements.childNodes.forEach((elem) => {
        if (elem.childNodes.length) {
          elem.childNodes.forEach((el) => {
            if (el.childNodes.length) {
              el.childNodes.forEach((e) => {
                if (e.nodeName !== '#text') {
                  if ((e as HTMLElement).classList.contains('car-icon')) {
                    carsArr.push(e as HTMLElement);
                  }
                }
              });
            }
          });
        }
      });
    }
  });
  carsArr.forEach((el) => {
    if (el.getAttribute('style') === 'left: 0px') count += 1;
  });
  if (count === carsArr.length) return true;
  return false;
}

function MoveToStartAllCarsOnSubPage(): void {
  const pageNbr = getCurrerntPageNbr();
  const stopButtons = document.getElementById(`page-${pageNbr}`)?.childNodes;
  const carsArr = [] as HTMLElement[];

  stopButtons?.forEach((elements) => {
    if (elements.childNodes.length) {
      elements.childNodes.forEach((elem) => {
        if (elem.childNodes.length) {
          elem.childNodes.forEach((el) => {
            if (el.childNodes.length) {
              el.childNodes.forEach((e) => {
                if (e.nodeName !== '#text') {
                  if ((e as HTMLElement).classList.contains('car-icon')) {
                    carsArr.push(e as HTMLElement);
                  }
                }
              });
            }
          });
        }
      });
    }
  });
  carsArr.forEach((el) => {
    el.setAttribute('style', 'left: 0px');
  });
}

export {
  getRandomIntInclusive,
  disableToggleStartButtons,
  allStopButtonDisabled,
  allCarsOfSubPageOnStartPosition,
  MoveToStartAllCarsOnSubPage,
};
