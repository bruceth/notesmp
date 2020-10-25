import { CNoteTask } from "../CNoteTask";
import { VTaskFail, VTaskFailDir } from "./VTaskFail";
import { TaskStateResult } from "../TaskState";

export class CTaskFail extends CNoteTask {	
	showViewPage():void {this.openVPage(VTaskFail) };
	renderDirItem(index: number): JSX.Element {
		return this.renderView(VTaskFailDir);
	}

	get taskStateResult(): TaskStateResult {
		return {content: '拒签', isEnd: true}
	}
}
