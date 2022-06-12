declare interface Window {
  plausible: (
    name: string,
    options?: { callback?: () => void; props?: { [key: string]: any } }
  ) => void;
}
