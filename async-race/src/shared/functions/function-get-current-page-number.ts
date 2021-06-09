export default function getCurrerntPageNbr(): number {
  const regex = /\/\d+$/g;

  const page = (window.location.hash).match(regex)?.splice(0, 1).join('');
  const pageNbr = Number(page?.slice(1, page.length));
  return pageNbr;
}
