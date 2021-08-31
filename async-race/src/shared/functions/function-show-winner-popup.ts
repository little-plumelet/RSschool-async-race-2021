export default function showWinnerPopUp(name: string, time: number): void {
  const cover = document.createElement('div');
  const content = document.createElement('div');
  const textName = document.createElement('span');
  const text = document.createElement('span');

  cover.setAttribute('id', 'cover-race');
  cover.classList.add('cover');
  content.classList.add('popup-winner-image');
  textName.classList.add('popup-winner-text_name');
  text.classList.add('popup-winner-text');

  textName.innerText = `${name}`;
  if (name === 'nobody') text.innerText += ' has won the race!!!';
  else text.innerText += ` has won the race for ${time}sec!!!`;

  content.appendChild(textName);
  content.appendChild(text);
  cover.appendChild(content);
  document.body?.appendChild(cover);
}
