import { fabric } from '../../editor/extendedfabric';
import { Action } from './Transformation';

export class UndoRedoState {
  objects?: fabric.Object[];
  action: Action;
}

export enum ReplayAction {
  REDO = 'redo',
  UNDO = 'undo'
}
