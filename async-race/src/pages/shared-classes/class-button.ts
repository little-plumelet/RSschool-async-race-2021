export default class Button {
  button: HTMLElement;

  constructor(params: string[]) {
    this.button = document.createElement('button');
    for (let i = 0; i < params.length; i += 1) {
      this.button.classList.add(`${params[i]}`);
    }
  }
}
