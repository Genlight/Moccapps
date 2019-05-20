import { fabric } from '../../editor/extendedfabric';
import { Action } from './Transformation';

export class UndoRedoState {
  objects: any;
  action?: Action;
}

export enum ReplayAction {
  REDO = 'redo',
  UNDO = 'undo'
}
