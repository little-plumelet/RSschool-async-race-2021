export default function deleteWinnerPopUp(): void {
  const cover = document.getElementById('cover-race');
  console.log('++++++', cover);
  cover?.remove();
}
