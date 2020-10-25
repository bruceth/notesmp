import { CNoteTask } from "../CNoteTask";
import { VTaskRated, VTaskRatedDir } from "./VTaskRated";
import { TaskStateResult } from "../TaskState";

export class CTaskRated extends CNoteTask {	
	showViewPage():void {this.openVPage(VTaskRated) };
	renderDirItem(index: number): JSX.Element {
		return this.renderView(VTaskRatedDir);
	}

	get taskStateResult(): TaskStateResult {
		return {content: '已评价', isEnd: true}
	}
}
