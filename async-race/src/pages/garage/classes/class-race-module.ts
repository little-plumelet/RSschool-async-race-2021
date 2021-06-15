import createDomElement from '../../shared-functions/create-dom-element';
import raceModuleParams from '../params/race-module-params';
import RaceModCarControl from './class-race-mod-car-control';
import RaceModTrackBlock from './class-race-mod-track-block';
import communicator from '../../../server-communication/create-communicator';

export default class RaceModule {
  raceModContainer: HTMLElement;

  raceModCarControl: null | RaceModCarControl;

  raceModCarControlEl: null | HTMLElement;

  raceModTrackBlock: null | RaceModTrackBlock;

  raceModTrackBlockEl: null | HTMLElement;

  raceModId: number;

  raceModName: string;

  raceModColor: string;

  constructor(id: number) {
    this.raceModId = id;
    this.raceModColor = '';
    this.raceModName = '';
    this.raceModCarControl = null;
    this.raceModCarControlEl = null;
    this.raceModTrackBlock = null;
    this.raceModTrackBlockEl = null;
    this.raceModContainer = createDomElement(raceModuleParams);
    this.raceModContainer.setAttribute('id', `${id}`);
    this.createModeBlocks();
  }

  getCarinfo = async (): Promise<void> => {
    const carInfo = await communicator.getCar(this.raceModId);
    this.raceModName = carInfo?.name;
    this.raceModColor = carInfo?.color;
  };

  createModeBlocks = async (): Promise<void> => {
    await this.getCarinfo();
    this.raceModCarControl = new RaceModCarControl(this.raceModName);
    this.raceModTrackBlock = new RaceModTrackBlock(this.raceModColor);

    this.raceModCarControlEl = this.raceModCarControl.carControlContainer;
    this.raceModTrackBlockEl = this.raceModTrackBlock.trackBlockContainer;

    this.raceModContainer.appendChild(this.raceModCarControlEl);
    this.raceModContainer.appendChild(this.raceModTrackBlockEl);
  };
}
