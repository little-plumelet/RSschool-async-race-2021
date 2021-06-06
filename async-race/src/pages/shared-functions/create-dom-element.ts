import IdomElementParameters from '../../shared/interface-dom-element-params';

export default function createDomElement(param: IdomElementParameters): HTMLElement {
  const domElement = document.createElement(param.tegName);
  for (let i = 0; i < param.classNames.length; i += 1) {
    domElement.classList.add(param.classNames[i]);
  }
  if (param.attributes[0].length) {
    for (let i = 0; i < param.attributes.length; i += 1) {
      domElement.setAttribute(param.attributes[i][0], param.attributes[i][1]);
    }
  }
  if (param.result) domElement.innerHTML = param.result;
  return domElement;
}
