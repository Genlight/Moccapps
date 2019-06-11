export interface Itransformation {
  'element': object;
  'action': Action;
}
export enum Action {
  ADDED = 'element:added',
  REMOVED = 'element:removed',
  MODIFIED = 'element:modified',
  PAGECREATED = 'page:created',
  PAGEMODIFIED = 'page:modified',
  GROUP = 'group:grouped',
  UNGROUP = 'group:ungrouped',
  CANVASMODIFIED = 'canvas:modified'  
}
export enum CanvasTransmissionProperty {
  BACKGROUNDCOLOR = 'backgroundColor',
  CHANGEWIDTH = 'changewidth',
  CHANGEHEIGHT = 'changeheight'
}
