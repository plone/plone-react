class Config {
  constructor() {
    if (!Config.instance) {
      this._data = {};
      Config.instance = this;
    }

    return Config.instance;
  }

  set(registry, item) {
    this._data[registry] = item;
  }

  get(registry) {
    return this._data[registry];
  }

  get settings() {
    return this._data.settings;
  }

  set settings(settings) {
    this._data.settings = settings;
  }

  get blocks() {
    return this._data.blocks;
  }

  set blocks(blocks) {
    this._data.blocks = blocks;
  }

  get views() {
    return this._data.views;
  }

  set views(views) {
    this._data.views = views;
  }

  get widgets() {
    return this._data.widgets;
  }

  set widgets(widgets) {
    this._data.widgets = widgets;
  }

  get addonReducers() {
    return this._data.addonReducers;
  }

  set addonReducers(addonReducers) {
    this._data.addonReducers = addonReducers;
  }

  get addonRoutes() {
    return this._data.addonRoutes;
  }

  set addonRoutes(addonRoutes) {
    this._data.addonRoutes = addonRoutes;
  }

  get appExtras() {
    return this._data.appExtras;
  }

  set appExtras(appExtras) {
    this._data.appExtras = appExtras;
  }

  get slots() {
    return this._data.slots;
  }

  set slots(slots) {
    this._data.slots = slots;
  }

  get transient() {
    return this._data.transient;
  }

  set transient(transient) {
    this._data.transient = transient;
  }

  resetTransientData() {
    this._data.transient = {};
  }
}

const instance = new Config();
Object.freeze(instance);

export default instance;
