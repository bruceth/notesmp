import { CInputHours } from '../../../../notes/components';
import { taskTimeToString } from '../../../../notes/model';
import React from 'react';
import { FA, Image, User, UserView } from '../../../../tonva';
import { none } from '../../../../tool';
import { VTaskView, TaskParam } from '../VTaskView';
import { CTaskStart } from './CTaskStart';

export class VTaskStart extends VTaskView<CTaskStart> {
	protected renderState(): JSX.Element {
		return this.renderStateSpan('待办');
	}

	protected renderViewBottom() {
		let { owner } = this.controller.noteItem;
		let left: any, right: any;
		let isMe = this.isMe(owner);
		if (isMe === true) {
			left = <button onClick={this.onDone} className="btn btn-primary mx-3">
				完成
			</button>;
		}

		return <div className="py-2 bg-light border-top d-flex">
				{left}
				<div className="mr-auto" />
				{right}
		</div>;
	}

	protected get additionRows(): TaskParam[]  {
		return 	[
			//{label: '分值', values: this.renderPoint()}, 
			{label: '分派工时', values: this.renderAssignHours()}, 
			{label: '实际工时', values: this.renderHours(), onClick: this.onClickHours}, 
		];
	}

	protected renderHours() {
		return <div className="flex-fill form-control border-0">
			{taskTimeToString(this.controller.hours)}
		</div>;
	}

	private onClickHours = async () => {
		let chours = new CInputHours(this.controller.owner);
		let h = await chours.inputHours(this.controller.hours);
		this.closePage();
		if (h !== undefined) {
			this.controller.hours = h;
		}
	}

	// protected onHoursChange = (evt:React.ChangeEvent<HTMLInputElement>) => {
	// 	let m = checkHourMinutes(evt.target.value);
	// 	if (m < 0) {
	// 		m = 0;
	// 	}
	// 	this.controller.hours = m;
	// }

	// protected onHoursBlur = (evt: React.FocusEvent<HTMLInputElement>) => {
	// 	if (checkHourMinutes(evt.target.value) < 0) {
	// 		evt.target.value = '';
	// 		this.controller.hours = 0;
	// 	}
	// }

	private onDone = async () => {
		await this.controller.DoneTask();
		this.closePage();

		// 这个地方应该要显示，下一步是由谁来做什么。比如谁来验收，或者谁来评价
		// 如果没有后续操作，显示成红色，加一个终止标志 #
		// 如果由后续操作，显示成绿色，并且显示下一步什么操作，由谁来操作
		let { obj } = this.controller.noteItem;
		let { checker, rater } = obj;
		let content;
		if (checker === undefined && rater === undefined) {
			content = <div className="text-danger"><FA className="mr-1" name="stop" />任务完成</div>
		}
		else {
			let contentChecker = checker ? <div className="px-3 py-2 bg-white d-flex border-bottom">
				<div className="text-muted mr-3 w-5c">检查人</div>
				<div className="mr-3 ">{this.renderContact(checker)}</div>
				</div>
				: undefined;
			let contentRater = rater ? <div className="px-3 py-2 bg-white d-flex border-bottom">
				<div className="text-muted mr-3 w-5c">评分人</div>
				<div className="mr-3 ">{this.renderContact(rater)}</div>
				</div>
				: undefined;

			content = <div>
				<div className="text-success">任务完成</div>
				{contentChecker}
				{contentRater}
			</div>
		}
		this.showActionEndPage({ content });
	}

	protected renderContact = (item:number) => {
		if (!item) return none;
		let renderUser = (user:User) => {
			let {name, nick, icon} = user;
			return <>
				<Image className="w-1c h-1c mr-1" src={icon || '.user-o'} />
				<span className="mr-3">{nick || name}</span>
			</>;
		}
		return <UserView user={item} render={renderUser} />;
	}
}

export class VTaskStartDir extends VTaskStart {
	render() {
		return this.renderDirView();
	}
}