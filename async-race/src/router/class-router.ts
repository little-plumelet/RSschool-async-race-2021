export default class Router {
  pathName;

  constructor(options: Record<string, string>) {
    if (options.pathName) this.pathName = options.pathName;
  }

  add(path: string, callback: VoidFunction): void {
    const doc = document.body.innerHTML;
    let newUrl: string = (window.location.href);
    newUrl = newUrl.replace(/#(.*)$/, '');
    newUrl = newUrl.concat('#', path);
    window.history.pushState(doc, '', newUrl);
    // window.location.href = newUrl;
    this.pathName = path;
    callback();
  }
}
