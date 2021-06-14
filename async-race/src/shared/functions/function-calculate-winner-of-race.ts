import { IraceResult } from '../interfaces-communicator';
import { MILICECINCEC } from '../constants';

async function calculateWinner(resultsArr: IraceResult[]): Promise<{
  winner: IraceResult; timeWinner: number;
}> {
  console.log('CALCULATING', resultsArr);
  let winner = {} as IraceResult;
  let timeWinner = 0;
  let timeCurrent = 0;
  // находим первого дошедшего до конца гонки
  for (let i = 0; i < resultsArr.length; i += 1) {
    console.log('%%%%', resultsArr[i].success, typeof resultsArr[i].success);
    if (resultsArr[i].success !== 'false') {
      winner = resultsArr[i];
      console.log('CALCULATING FIRSTWINNER', winner);
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
  // if (winner) communicator.createWinner()
  timeWinner = Math.round(timeWinner / MILICECINCEC);
  console.log('###CALCULATING Real winner#### = ', winner, timeWinner);
  return { winner, timeWinner };

  // if (winner) {
  //   if (winner.id) {
  //     const responce = await communicator.getCar(winner.id);
  //     const nameWinner = responce.name;
  //     timeWinner = Math.round(timeWinner);
  //     console.log('###winner#### = ', winner, timeWinner);
  //     showWinnerPopUp(nameWinner, timeWinner);
  //     const timeoutId = setTimeout(deleteWinnerPopUp, TIMEOUTWINNER);
  //     clearTimeout(timeoutId);
  //   }
  // }
}

export default calculateWinner;
