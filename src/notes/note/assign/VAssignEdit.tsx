import React from 'react';
import { FA } from "../../../tonva";
import { CNoteAssign } from "./CNoteAssign";
import { VNoteBaseEdit } from '../../../notes/noteBase';
import { none } from '../../../tool';
import { taskTimeToString } from '../../../notes/model';
import { CInputHours } from '../../../notes/components';

interface TaskParam {
	label: string;
	values?: any;
	onClick?: () => void;
}

export class VAssignEdit extends VNoteBaseEdit<CNoteAssign> { // VNoteForm<CNoteAssign> {
	header() {
		return this.t('noteTask');
	}

	protected renderTopCaptionContent():JSX.Element {
		return <div className="">
			{this.renderCaptionInput()}
			<div className="mx-1 py-1 bg-white">
				{this.renderContent()}
			</div>
			{this.renderTaskAdditions()}
		</div>;
	}

	protected renderContent():JSX.Element {
		return this.controller.cContent.renderInput()
	}

	protected renderParam(param: TaskParam) {
		let {label, values, onClick} = param;
		return <div key={label} className="px-3 py-2 bg-white d-flex align-items-center border-bottom" onClick={onClick}>
			<div className="text-muted mr-3 w-5c">{label}</div>
			<div className="flex-fill mr-3 ">{values || none}</div>
			{
				onClick ?
				<FA className="ml-auto" name="angle-right" />
				:
				undefined
			}
		</div>
	}

	protected renderTaskAdditions() {
		let additionRows: TaskParam[] = [
			{label: '分派工时', values: this.renderAssignHours(), onClick: this.onClickHours}, 
		];
		return <div>
			{additionRows.map(v => this.renderParam(v))}
		</div>;
	}

	protected renderAssignHours() {
		return <div className="flex-fill mr-3 ">
			{taskTimeToString(this.controller.assignhours)}
			</div>
	}

	private onClickHours = async () => {
		let chours = new CInputHours(this.controller.owner);
		let h = await chours.inputHours(this.controller.assignhours);
		this.closePage();
		if (h !== undefined) {
			this.controller.assignhours = h;
		}
	}

	// protected onHoursChange = (evt:React.ChangeEvent<HTMLInputElement>) => {
	// 	let m = checkHourMinutes(evt.target.value);
	// 	if (m < 0) {
	// 		m = 0;
	// 	}
	// 	this.controller.assignhours = m;
	// 	this.controller.changed = true;
	// }

	// protected onHoursBlur = (evt: React.FocusEvent<HTMLInputElement>) => {
	// 	if (checkHourMinutes(evt.target.value) < 0) {
	// 		evt.target.value = '';
	// 		this.controller.assignhours = 0;
	// 		this.controller.changed = true;
	// 	}
	// }

	protected renderExButtons():JSX.Element {
		return <>{this.renderDeleteButton()}</>;
	}
}
