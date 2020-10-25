import { VNoteBaseDir } from '../../noteBase';
import { CNoteAssign } from './CNoteAssign';

export class VAssignDir extends VNoteBaseDir<CNoteAssign> {
	protected renderContent():JSX.Element {
		return this.controller.cContent.renderDirContent();
	}
}
