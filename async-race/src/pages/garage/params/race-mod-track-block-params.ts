const raceModTrackParams = {
  container: {
    tegName: 'div',
    classNames: ['track-module'],
    attributes: [[]],
  },

  moveControlBlock: {
    container: {
      tegName: 'div',
      classNames: ['track-move-control'],
      attributes: [[]],
    },
    startButton: {
      tegName: 'button',
      classNames: ['move-control-button', 'move-control-button_start'],
      attributes: [[]],
      result: 'Start',
    },
    stopButton: {
      tegName: 'button',
      classNames: ['move-control-button', 'move-control-button_stop'],
      attributes: [[]],
      result: 'Stop',
    },
  },

  trackBlock: {
    container: {
      tegName: 'div',
      classNames: ['track-way'],
      attributes: [[]],
    },
    carIcon: {
      tegName: 'div',
      classNames: ['car-icon'],
      attributes: [[]],
    },
    finishPoint: {
      tegName: 'img',
      classNames: ['finish-point'],
      attributes: [['src', '../public/images/flag_finish_small.png'], ['alt', 'finish']],
    },
  },
};

export default raceModTrackParams;
