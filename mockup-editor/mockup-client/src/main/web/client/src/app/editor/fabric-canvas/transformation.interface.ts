export interface Itransformation {
  'element': object;
  'action': Action;
}
export enum Action {
  ADDED = 'element:added',
  REMOVED = 'element:removed',
  MODIFIED = 'element:modified',
  PAGECREATED = 'page:created',
  PAGEREMOVED = 'page:removed',
  PAGERENAMED = 'page:renamed',
  PAGELOAD = 'page:load',
  PAGEMODIFIED = 'page:modified',
  GROUP = 'group:grouped',
  UNGROUP = 'group:ungrouped',
  PAGEDIMENSIONCHANGE = 'page:dimensionchange',
  LOCK = 'element:locked',
  UNLOCK = 'element:unlocked',
  SELECTIONMODIFIED = 'selection:modified' 
}
export enum CanvasTransmissionProperty {
  BACKGROUNDCOLOR = 'backgroundColor',
  CHANGEWIDTH = 'changewidth',
  CHANGEHEIGHT = 'changeheight',
  INDEX = 'index'
}
