import { numberFromId } from "../../../model";
import { CNoteTask } from "../CNoteTask";
import { VTaskRate, VTaskRateDir } from "./VRateTask";
import { TaskStateResult, EnumTaskState } from "../TaskState";
import { TaskCheckItem } from "../model";

export class CTaskRate extends CNoteTask {	
	showViewPage():void {this.openVPage(VTaskRate) };
	renderDirItem(index: number): JSX.Element {
		return this.renderView(VTaskRateDir);
	}

	get taskStateResult(): TaskStateResult {
		return {content: 'rate', isEnd: true}
	}

	async rateTask(value: number) {
		this.rateValueInput = value;
		await this.checkSaveInfo();

		let { note: noteId } = this.noteItem;
		let obj = this.endContentInput();
		let content = JSON.stringify(obj);
		let data = {
			groupFolder: this.owner.currentFold.groupFolder,
			folder: this.owner.currentFold.folderId,
			note: numberFromId(noteId),
			value: value,
			content: content
		}

		await this.uqs.notes.RateTask.submit(data);
		this.noteItem.state = EnumTaskState.Rated;
		this.noteItem.flowContent = content;
		this.noteItem.$update = new Date();
		this.owner.currentFold.taskUpdateState(this.noteItem);
	}

	async setRateInfo(item: TaskCheckItem, v:string) {
		if (v === undefined || v.length === 0) {
			delete item.rateInfo;
		}
		else {
			item.rateInfo = v;
		}
		await this.saveX();
	}
}
