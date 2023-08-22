declare module "igv" {
  function createBrowser(
    element: HTMLElement,
    config: any
  ): Promise<IGVBrowser>;

  interface IGVBrowser {
    visibilityChange();
  }
}
