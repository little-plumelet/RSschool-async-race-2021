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
      classNames: ['move-control-button', 'move-control-button_stop', 'disabled'],
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
      attributes: [['style', 'left: 0px']],
    },
    finishPointContainer: {
      tegName: 'div',
      classNames: ['finish-point-container'],
      attributes: [[]],
    },
    finishPoint: {
      tegName: 'img',
      classNames: ['finish-point'],
      attributes: [['src', './public/images/flag_finish_small.png'], ['alt', 'finish']],
    },
    velocityPoint: {
      tegName: 'div',
      classNames: ['car-velocity'],
      attributes: [[]],
      result: 'V = 0 m/c',
    },
  },
};

export default raceModTrackParams;
