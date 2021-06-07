import createDomElement from '../../shared-functions/create-dom-element';
import raceModuleParams from '../params/race-module-params';
import RaceModCarControl from './class-race-mod-car-control';
import RaceModTrackBlock from './class-race-mod-track-block';
import communicator from '../../../server-communication/create-communicator';

export default class RaceModule {
  raceModContainer: HTMLElement;

  raceModCarControl: null | HTMLElement;

  raceModTrackBlock: null | HTMLElement;

  raceModId: number;

  raceModName: string;

  raceModColor: string;

  constructor(id: number) {
    this.raceModId = id;
    this.raceModColor = '';
    this.raceModName = '';
    this.raceModCarControl = null;
    this.raceModTrackBlock = null;
    this.raceModContainer = createDomElement(raceModuleParams);
    this.raceModContainer.setAttribute('id', `${id}`);
    this.createModeBlocks();
  }

  getCarinfo = async (): Promise<void> => {
    // нет ясности как пользоваться данным параметром правильно
    const carInfo = await communicator.getCar(this.raceModId);
    this.raceModName = carInfo.name;
    this.raceModColor = carInfo.color;
  };

  createModeBlocks = async (): Promise<void> => {
    await this.getCarinfo();
    const raceModCarControl = new RaceModCarControl(this.raceModName);
    const raceModTrackBlock = new RaceModTrackBlock(this.raceModColor);

    this.raceModCarControl = raceModCarControl.carControlContainer;
    this.raceModTrackBlock = raceModTrackBlock.trackBlockContainer;

    this.raceModContainer.appendChild(this.raceModCarControl);
    this.raceModContainer.appendChild(this.raceModTrackBlock);
  };
}
