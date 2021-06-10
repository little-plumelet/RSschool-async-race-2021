import { IraceResult } from '../interfaces-communicator';

async function calculateWinner(resultsArr: IraceResult[]): Promise<{
  winner: IraceResult; timeWinner: number;
}> {
  let winner = {} as IraceResult;
  let timeWinner = 0;
  let timeCurrent = 0;
  for (let i = 0; i < resultsArr.length; i += 1) {
    if (resultsArr[i].success) {
      winner = resultsArr[i];
      if (winner.distance && winner.velocity) timeWinner = winner.distance / winner.velocity;
      break;
    }
  }
  for (let i = 0; i < resultsArr.length; i += 1) {
    if (resultsArr[i].success) {
      const tmp = resultsArr[i];
      if (tmp.distance && tmp.velocity) timeCurrent = tmp.distance / tmp.velocity;
      if (timeCurrent < timeWinner) winner = tmp;
    }
  }
  // if (winner) communicator.createWinner()
  timeWinner = Math.round(timeWinner);
  console.log('###winner#### = ', winner, timeWinner);
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
