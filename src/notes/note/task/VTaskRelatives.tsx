import { TabRelative } from '../../noteBase';
import { CNoteTask } from "./CNoteTask";
import { VRelativesNoteBase } from '../views';

export class VTaskRelatives extends VRelativesNoteBase<CNoteTask> {
	protected get tabs():TabRelative[] { return [this.tabComment] };
}
