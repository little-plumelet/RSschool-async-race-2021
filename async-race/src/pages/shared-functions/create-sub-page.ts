import createDomElement from './create-dom-element';
import IdomElementParameters from '../../shared/interface-dom-element-params';

function createSubPage(pageNbr: number, pageParams: {
  subPageContainer : IdomElementParameters,
  subPageTitle: IdomElementParameters,
}): HTMLElement {
  const SubPage = createDomElement(pageParams.subPageContainer);
  const SubPageTitle = createDomElement(pageParams.subPageTitle);

  SubPage.setAttribute('id', `page-${pageNbr}`);
  if (pageNbr > 1) SubPage.classList.add('hidden');
  SubPageTitle.innerText = `Page ${pageNbr}`;
  SubPage.appendChild(SubPageTitle);
  return SubPage;
}

export default createSubPage;
