import communicator from '../../server-communication/create-communicator';
import { IraceResult } from '../interfaces-communicator';

export default async function getWinnerName(winner: IraceResult): Promise<string> {
  let nameWinner = '';
  if (winner.id) {
    const responce = await communicator.getCar(winner.id);
    nameWinner = responce.name;
  }
  return nameWinner;
}
