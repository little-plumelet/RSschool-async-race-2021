import getCurrerntPageNbr from '../../shared/functions/function-get-current-page-number';
import RaceModule from './classes/class-race-module';

function getRandomIntInclusive(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min; // Максимум и минимум включаются
}

function disableToggleStartButtons(makeDisabled: boolean, raceModulesSet: RaceModule[]): void {
  const pageNbr = getCurrerntPageNbr();
  const participants = raceModulesSet.filter((element) => element.raceModContainer.parentElement?.getAttribute('id') === `page-${pageNbr}`);
  participants.forEach((element) => {
    const buttonStart = element.raceModTrackBlock?.moveController.buttonStart as HTMLElement;
    if (buttonStart.classList.contains('move-control-button_start')) {
      if (makeDisabled) buttonStart.classList.add('disabled');
      else buttonStart.classList.remove('disabled');
    }
  });
}

function allStopButtonDisabled(raceModulesSet: RaceModule[]): boolean {
  const pageNbr = getCurrerntPageNbr();
  const participants = raceModulesSet.filter((element) => element.raceModContainer.parentElement?.getAttribute('id') === `page-${pageNbr}`);
  let count = 0;

  participants.forEach((element) => {
    const buttonStop = element.raceModTrackBlock?.moveController.buttonStop as HTMLElement;
    if (buttonStop.classList.contains('move-control-button_stop')) {
      if (buttonStop.classList.contains('disabled')) count += 1;
    }
  });
  if (count === participants.length) return true;
  return false;
}

function allCarsOfSubPageOnStartPosition(raceModulesSet: RaceModule[]): boolean {
  const pageNbr = getCurrerntPageNbr();
  const participants = raceModulesSet.filter((element) => element.raceModContainer.parentElement?.getAttribute('id') === `page-${pageNbr}`);
  let count = 0;

  participants.forEach((element) => {
    const carIcon = element.raceModTrackBlock?.trackBlock.carIconContainer as HTMLElement;
    if (carIcon.classList.contains('car-icon')) {
      if (carIcon.getAttribute('style') === 'left: 0px') count += 1;
    }
  });

  if (count === participants.length) return true;
  return false;
}

function MoveToStartAllCarsOnSubPage(raceModulesSet: RaceModule[]): void {
  const pageNbr = getCurrerntPageNbr();
  const participants = raceModulesSet.filter((element) => element.raceModContainer.parentElement?.getAttribute('id') === `page-${pageNbr}`);

  participants.forEach((element) => {
    const carIcon = element.raceModTrackBlock?.trackBlock.carIconContainer as HTMLElement;
    if (carIcon.classList.contains('car-icon')) {
      carIcon.setAttribute('style', 'left: 0px');
    }
  });
}

export {
  getRandomIntInclusive,
  disableToggleStartButtons,
  allStopButtonDisabled,
  allCarsOfSubPageOnStartPosition,
  MoveToStartAllCarsOnSubPage,
};
