import { observable } from "mobx";
import { NoteItem, EnumNoteType } from '../../model';
import { renderIcon } from '../../noteBase';
import { TaskStateResult } from "./TaskState"
import { CNote } from "../CNote";
import { CTaskContent } from "./content";

export abstract class CNoteTask extends CNote {
	get type():EnumNoteType { return EnumNoteType.task }

	cContent: CTaskContent;
	get allowCheck() { return false; }

	@observable checkInfo: string;
	@observable rateInfo: string;

	protected checker: number;
	protected rater: number;
	protected checkInfoInput: string;
	protected rateInfoInput: string;
	protected rateValue: number;
	protected rateValueInput: number;
	assignhours: number;
	@observable hours: number;
	point: number;

	init(param: NoteItem):void {
		super.init(param);
		this.cContent = new CTaskContent(this.res);
		if (param) {
			let {obj} = param;
			this.initobj(obj);
		}
		this.cContent.allowCheck = this.allowCheck;
	}

	protected initobj(obj:any) {
		if (obj) {
			this.cContent.init(obj);
			this.checkInfo = obj.checkInfo;
			this.checkInfoInput = this.checkInfo;
			this.rateInfo = obj.rateInfo;
			this.rateInfoInput = this.rateInfo;
			this.rateValue = obj.rateValue;
			this.rateValueInput = this.rateValue;
			this.checker = obj.checker;
			this.rater = obj.rater;
			this.assignhours = obj.assignhours;
			this.hours = obj.hours;
			this.point = obj.point;
		}
}

	protected endContentInput():any {
		let obj = super.endContentInput();
		if (this.checkInfo) {
			obj.checkInfo = this.checkInfo;
		}
		else {
			delete obj.checkInfo;
		}
		if (this.rateInfo) {
			obj.rateInfo = this.rateInfo;
		}
		else {
			delete obj.rateInfo;
		}
		if (this.rateValue !== undefined) {
			obj.rateValue = this.rateValue;
		}
		else {
			delete obj.rateValue;
		}
		if (this.checker !== undefined) {
			obj.checker = this.checker;
		}
		if (this.rater !== undefined) {
			obj.rater = this.rater;
		}
		obj.assignhours = this.assignhours;
		obj.hours = this.hours;
		obj.point = this.point;
		this.cContent.endInput(obj);
		return obj;
	}

	updateCheckInfo(v:string) {
		this.checkInfoInput = v;
	}

	updateRateInfo(v:string) {
		this.rateInfoInput = v;
	}
	abstract get taskStateResult(): TaskStateResult;

	showAddPage() {/*CNoteTask no need to Add*/}
	showEditPage() {/*CNoteTask no need to Edit*/}

	renderIcon(): JSX.Element {
		return renderIcon('tasks', 'text-success');
	}

	async checkSaveInfo() {
		let change = false;
		if (this.rateInfo !== this.rateInfoInput) {
			this.rateInfo = this.rateInfoInput;
			change = true;
		}
		if (this.checkInfo !== this.checkInfoInput) {
			this.checkInfo = this.checkInfoInput;
			change = true;
		}
		if (this.rateValue !== this.rateValueInput) {
			this.rateValue = this.rateValueInput;
			change = true;
		}

		if (change) {
			await this.saveX();
		}
	}

	protected async saveX() {
		let { note: noteId } = this.noteItem;
		let obj = this.endContentInput();
		let flowContent = JSON.stringify(obj);
		let param = { note: noteId, content: flowContent };
		await this.uqs.notes.SetNoteX.submit(param, false);
	}
}
