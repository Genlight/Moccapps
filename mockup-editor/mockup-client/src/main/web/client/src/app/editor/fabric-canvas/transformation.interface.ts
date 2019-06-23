export interface Itransformation {
  'element': object;
  'action': Action;
}
export enum Action {
  ADDED = 'element:added',
  REMOVED = 'element:removed',
  MODIFIED = 'element:modified',
  PROJECTRENAMED = 'page:projectrenamed',
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
  SELECTIONMODIFIED = 'selection:modified', 
  COMMENTADDED = 'comment:added',
  COMMENTMODIFIED = 'comment:modified',
  COMMENTCLEARED = 'comment:cleared',
  COMMENTENTRYADDED = 'commententry:added',
  COMMENTENTRYMODIFIED = 'commententry:modified',
  COMMENTENTRYDELETED = 'commententry:deleted',
  VERSIONCREATED = 'version:created'
}
export enum CanvasTransmissionProperty {
  BACKGROUNDCOLOR = 'backgroundColor',
  CHANGEWIDTH = 'changewidth',
  CHANGEHEIGHT = 'changeheight',
  INDEX = 'index'
}
