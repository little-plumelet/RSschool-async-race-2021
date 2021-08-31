function errorHandler(response: Response, successNbr: number): void {
  const { ok, status } = response;
  if (status !== successNbr && !ok) throw new Error(`${status}`);
}

function printErrorMessage(error: Error, definer: string): void {
  switch (definer) {
    case 'create winner':
      if (error.message === '500') console.log('Error: Insert failed, duplicate id');
      else console.log(`Caught Error ${error.message} in ${definer} method!`);
      break;
    case 'switch engine':
      if (error.message === '400') console.log('Wrong parameters: "id" should be any positive number, "status" should be "started", "stopped" or "drive"');
      else if (error.message === '404') console.log('Engine parameters for car with such id was not found in the garage. Have you tried to set engine status to "started" before?');
      else if (error.message === '429') console.log('Drive already in progress. You can\'t run drive for the same car twice while it\'s not stopped.');
      else if (error.message === '500') console.log('Car has been stopped suddenly. It\'s engine was broken down.');
      else console.log(`Caught Error ${error.message} in ${definer} method!`);
      break;
    case 'start/stop engine':
      if (error.message === '404') console.log('Car with such id was not found in the garage.');
      else if (error.message === '400') console.log('Wrong parameters: "id" should be any positive number, "status" should be "started", "stopped" or "drive"');
      else console.log(`Caught Error ${error.message} in ${definer} method!`);
      break;
    default: console.log(`Caught Error ${error.message} in ${definer} method!`);
  }
}

export { errorHandler, printErrorMessage };
