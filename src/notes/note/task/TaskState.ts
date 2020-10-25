import { EnumNoteType, NoteItem } from "../../model";

export enum EnumTaskState { Start = 0, Done = 1, Pass = 2, Fail = 3, Rated = 4, Canceled = 5 };

export interface TaskStateResult {
	content: string;
	isEnd: boolean;
}
const stateContents: {[key in EnumTaskState]: TaskStateResult} = {
	[EnumTaskState.Start]: {content: '待办', isEnd: false},
	[EnumTaskState.Done]: {content: '已办', isEnd: true},
	[EnumTaskState.Pass]: {content: '签收', isEnd: true},
	[EnumTaskState.Fail]: {content: '拒签', isEnd: true},
	[EnumTaskState.Rated]: {content: '已评价', isEnd: true},
	[EnumTaskState.Canceled]: {content: '已取消', isEnd: true}
}

export function GetTaskStateContent(type:number, state:number) {
	if (type !== EnumNoteType.task)
		return;
	return stateContents[state as EnumTaskState];
}

export function getTaskItemState(noteItem: NoteItem): TaskStateResult {
	let {type, state} = noteItem;
	if (type !== EnumNoteType.task)
		return;
	switch (state) {
		case EnumTaskState.Done:
			if (noteItem.obj.checker) {
				return {content: '待验收', isEnd: false};
			}
			else if (noteItem.obj.rater) {
				return {content: '待评分', isEnd: false};
			}
			break;
		case EnumTaskState.Pass:
			if (noteItem.obj.rater) {
				return {content: '待评分', isEnd: false};
			}
			break;
	}
	return GetTaskStateContent(type, state);
}
