import { IraceResult } from '../interfaces-communicator';
import { MILICECINCEC } from '../constants';

async function calculateWinner(resultsArr: IraceResult[]): Promise<{
  winner: IraceResult; timeWinner: number;
}> {
  let winner = {} as IraceResult;
  let timeWinner = 0;
  let timeCurrent = 0;
  // находим первого дошедшего до конца гонки
  for (let i = 0; i < resultsArr.length; i += 1) {
    if (resultsArr[i].success !== 'false') {
      winner = resultsArr[i];
      if (winner.distance && winner.velocity) timeWinner = winner.distance / winner.velocity;
      break;
    }
  }
  // выбираем лучшего среди дошедших до конца
  for (let i = 0; i < resultsArr.length; i += 1) {
    if (resultsArr[i].success !== 'false') {
      const tmp = resultsArr[i];
      if (tmp.distance && tmp.velocity) timeCurrent = tmp.distance / tmp.velocity;
      if (timeCurrent < timeWinner) winner = tmp;
    }
  }
  timeWinner = Math.round(timeWinner / MILICECINCEC);
  return { winner, timeWinner };
}

export default calculateWinner;
