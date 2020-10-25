import { initNoteItemObj } from "../../../notes/model";
import { CNoteTask } from "./CNoteTask";
import { TaskStateResult, getTaskItemState } from "./TaskState";
import { VTaskObserver, VTaskObserverDir } from "./VTaskObserver";

export class CTaskObserver extends CNoteTask {	
	get allowCheck() { return false; }

	showViewPage():void {this.openVPage(VTaskObserver);};
	renderDirItem(index: number): JSX.Element {
		return this.renderView(VTaskObserverDir);
	}
	get taskStateResult(): TaskStateResult {
		return getTaskItemState(this.noteItem);
	}

	initModelData() {
		if (this.noteModel === undefined || this.noteModel.flowContent === undefined)
			return;
		this.noteItem.flowContent = this.noteModel.flowContent;
		initNoteItemObj(this.noteItem);

		let {obj} = this.noteItem;
		this.initobj(obj);
	}
}
