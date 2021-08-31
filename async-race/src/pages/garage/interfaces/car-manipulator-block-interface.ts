import IdomElementParameters from '../../../shared/interface-dom-element-params';

interface ImanipulatorBlockInputParam {
  container: IdomElementParameters,
  nameInput: IdomElementParameters,
  colorInput: IdomElementParameters,
  button: IdomElementParameters,
}

interface ImanipulatorBlockButtonsParam {
  container: IdomElementParameters,
  buttonRace: IdomElementParameters,
  buttonReset: IdomElementParameters,
  buttonCreateBunchOfCars: IdomElementParameters,
}

export { ImanipulatorBlockInputParam, ImanipulatorBlockButtonsParam };
