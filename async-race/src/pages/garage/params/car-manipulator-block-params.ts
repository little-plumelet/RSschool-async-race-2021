const carManipulatorBlockParams = {
  BlockContainer: {
    tegName: 'div',
    classNames: ['manipulator-container'],
    attributes: [[]],
  },

  createCarBlock: {
    container: {
      tegName: 'div',
      classNames: ['manipulator-container-block', 'manipulator-container-block_create'],
      attributes: [[]],
    },
    nameInput: {
      tegName: 'input',
      classNames: ['manipulator-input', 'manipulator-input_create-car', 'manipulator-input_create-car-name'],
      attributes: [['id', 'create-car-name'], ['name', 'create-car-name'], ['type', 'text']],
    },
    colorInput: {
      tegName: 'input',
      classNames: ['manipulator-input', 'manipulator-input_create-car', 'block-manipulator-input_create-car-color'],
      attributes: [['id', 'create-car-color'], ['name', 'create-car-color'], ['type', 'color'], ['value', '#ffffff']],
    },
    button: {
      tegName: 'button',
      classNames: ['manipulator-button', 'manipulator-button_create-car'],
      attributes: [[]],
      result: 'Create',
    },
  },

  updateCarBlock: {
    container: {
      tegName: 'div',
      classNames: ['manipulator-container-block', 'manipulator-container-block_update'],
      attributes: [[]],
    },
    nameInput: {
      tegName: 'input',
      classNames: ['manipulator-input', 'manipulator-input_update-car', 'manipulator-input-update-car-name'],
      attributes: [['id', 'update-car-name'], ['name', 'update-car-name'], ['type', 'text']],
    },
    colorInput: {
      tegName: 'input',
      classNames: ['manipulator-input', 'manipulator-input_update-car', 'block-manipulator-input_update-car-color'],
      attributes: [['id', 'update-car-color'], ['name', 'update-car-color'], ['type', 'color'], ['value', '#ffffff']],
    },
    button: {
      tegName: 'button',
      classNames: ['manipulator-button', 'manipulator-button_update-car'],
      attributes: [[]],
      result: 'Update',
    },
  },

  blockButtons: {
    container: {
      tegName: 'div',
      classNames: ['manipulator-container-block', 'manipulator-container-block_buttons'],
      attributes: [[]],
    },
    buttonRace: {
      tegName: 'button',
      classNames: ['manipulator-button', 'manipulator-button_race'],
      attributes: [[]],
      result: 'Start race',
    },
    buttonReset: {
      tegName: 'button',
      classNames: ['manipulator-button', 'manipulator-button_reset'],
      attributes: [[]],
      result: 'Reset',
    },
    buttonCreateBunchOfCars: {
      tegName: 'button',
      classNames: ['manipulator-button', 'manipulator-button_create-bunch'],
      attributes: [[]],
      result: 'Create cars',
    },
  },
};

export default carManipulatorBlockParams;
