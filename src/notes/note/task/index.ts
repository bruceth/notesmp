import { CNotes } from '../../CNotes';
import { NoteItem } from '../../model';
import { CNoteTask } from './CNoteTask';
import { EnumTaskState } from './TaskState';
import { CTaskStart } from './start';
import { CTaskDone } from './done';
import { CTaskCanceled } from './canceled';
import { CTaskPass } from './pass';
import { CTaskFail } from './fail';
import { CTaskRated } from './rated';
import { CTaskCheck } from './check';
import { CTaskRate } from './rate';

export function createCNoteTask(cNotes: CNotes, noteItem: NoteItem): CNoteTask {
	switch (noteItem.state) {
		default:
		case EnumTaskState.Start:
			return new CTaskStart(cNotes);
		case EnumTaskState.Done:
			if (noteItem && cNotes.isMe(noteItem.obj.checker)) {
				return new CTaskCheck(cNotes);
			}
			return new CTaskDone(cNotes);
		case EnumTaskState.Pass:
			if (noteItem && cNotes.isMe(noteItem.obj.rater)) {
				return new CTaskRate(cNotes);
			}
			return new CTaskPass(cNotes);
		case EnumTaskState.Fail:
			return new CTaskFail(cNotes);
		case EnumTaskState.Rated:
			return new CTaskRated(cNotes);
		case EnumTaskState.Canceled:
			return new CTaskCanceled(cNotes);
	}
}
