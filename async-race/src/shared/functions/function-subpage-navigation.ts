import Garage from '../../pages/garage/classes/class-garage';
import Winners from '../../pages/winners/classes/class-winners';

export default function navToSubPage(subPageNbr: number, page: Garage | Winners): VoidFunction {
  return function res(): void {
    switch (page.pageName) {
      case 'garage':
        (page as Garage).garagePagesContainer.childNodes.forEach((element) => {
          (element as HTMLElement).classList.add('hidden');
          if ((element as HTMLElement).getAttribute('id') === `page-${subPageNbr}`) {
            (element as HTMLElement).classList.remove('hidden');
          }
        });
        break;
      case 'winners':

        break;
      default:
        break;
    }
  };
}
