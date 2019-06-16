import { fabric } from '../../editor/extendedfabric';
import { Action } from './Transformation';

export class UndoRedoState {
  previous?: any;
  current?: any;
  action?: Action;
}

// entspricht dem State, der gerade angezeigt wird
export class CanvasState {
  canvas: any;
  action: Action;
}

export enum ReplayAction {
  REDO = 'redo',
  UNDO = 'undo'
}
