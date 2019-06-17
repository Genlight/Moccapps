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
  COMMENTADDED = 'comment:added',
  COMMENTMODIFIED = 'comment:modified',
  COMMENTCLEARED = 'comment:cleared',
  COMMENTENTRYADDED = 'commententry:added',
  COMMENTENTRYMODIFIED = 'commententry:modified',
  COMMENTENTRYDELETED = 'commententry:deleted'
}
export enum CanvasTransmissionProperty {
  BACKGROUNDCOLOR = 'backgroundColor',
  CHANGEWIDTH = 'changewidth',
  CHANGEHEIGHT = 'changeheight',
  INDEX = 'index'
}
