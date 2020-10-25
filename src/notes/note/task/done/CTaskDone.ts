import { CNoteTask } from "../CNoteTask";
import { VTaskDone, VTaskDoneDir } from "./VTaskDone";
import { TaskStateResult } from "../TaskState";

export class CTaskDone extends CNoteTask {	
	//protected getTaskView() {return VTaskDone };
	renderDirItem(index: number): JSX.Element {
		return this.renderView(VTaskDoneDir);
	}
	showViewPage():void {this.openVPage(VTaskDone);}

	get taskStateResult(): TaskStateResult {
		return {content: '已办', isEnd: true}
	}
}
