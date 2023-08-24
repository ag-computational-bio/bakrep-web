declare module "igv" {
  function createBrowser(element: HTMLElement, config: any): Promise<IGVBrowser>;
  function removeBrowser(element: IGVBrowser): void;

  interface IGVBrowser {
    visibilityChange();
  }
}
