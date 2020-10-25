import { numberFromId } from "../../../model";
import { CNoteTask } from "../CNoteTask";
import { VTaskCheck, VTaskCheckDir } from "./VTaskCheck";
import { TaskStateResult, EnumTaskState } from "../TaskState";
import { TaskCheckItem } from "../model";

export class CTaskCheck extends CNoteTask {	
	showViewPage():void {this.openVPage(VTaskCheck) };
	renderDirItem(index: number): JSX.Element {
		return this.renderView(VTaskCheckDir);
	}
	
	get taskStateResult(): TaskStateResult {
		return {content: 'check', isEnd: false}
	}

	async checkTask(pass: boolean) {
		await this.checkSaveInfo();

		let { note: noteId } = this.noteItem;
		let obj = this.endContentInput();
		let content = JSON.stringify(obj);
		let data = {
			groupFolder: this.owner.currentFold.groupFolder,
			folder: this.owner.currentFold.folderId,
			note: numberFromId(noteId),
			action: pass ? 1 : 2,
			content: content
		}

		await this.uqs.notes.CheckTask.submit(data);
		this.noteItem.state = pass ? EnumTaskState.Pass : EnumTaskState.Fail;
		this.noteItem.flowContent = content;
		this.noteItem.$update = new Date();
		this.owner.currentFold.taskUpdateState(this.noteItem);
	}

	async setCheckInfo(item: TaskCheckItem, v:string) {
		if (v === undefined || v.length === 0) {
			delete item.checkInfo;
		}
		else {
			item.checkInfo = v;
		}
		await this.saveX();
	}
}
