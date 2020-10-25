import React from 'react';
import { observer } from 'mobx-react';
import { FA } from "../../../tonva";
import { TaskCheckItemBase } from './model';
import { VNoteBaseView } from '../../noteBase';
import { CNoteTask } from "./CNoteTask";
import { VTaskRelatives } from './VTaskRelatives';
import { none } from '../../../tool';
import { taskTimeToString } from '../../../notes/model';

export interface TaskParam {
	label: string;
	values?: any;
	onClick?: () => void;
}

export abstract class VTaskView<T extends CNoteTask> extends VNoteBaseView<T> {
	protected get back(): 'close' | 'back' | 'none' { return 'close' }
	header() { return this.t('task') }
	content() {
		return React.createElement(observer(() => {
			return <div className="">
				{this.renderTopCaptionContent()}
				{this.renderTaskAdditions()}
				{this.renderViewBottom()}
				{this.renderRelatives()}
			</div>;
		}));
	}

	protected renderContent() {
		return this.controller.cContent.renderViewContent();
	}

	footer() {
		return this.renderFooter();
	}

	protected renderFooter() {
		return <div className="py-2 pl-3 bg-light border-top d-flex align-items-center">
			{this.controller.cComments?.renderWriteComment()}
		</div>;
	}

	renderDirView() {
		return React.createElement(observer(() => {
			return <div className="d-block bg-white">
				<div className="bg-white">
					{this.renderTaskDirTop()}
					<div className="py-2">
						{this.controller.cContent.renderDirContent()}
					</div>
				</div>
				{this.renderDirBottom()}
			</div>;
		}));
	}

	protected renderTop():JSX.Element {
		return <div className={'d-flex px-3 py-3 border-top border-bottom bg-light'}>
			{this.renderIcon()}
			<div>
				{this.renderCaption()}
				<div>
					{this.renderFrom()} 
					<span className="mr-3">{this.renderEditTime()}</span>
				</div>
			</div>			
		</div>;
	}

	private renderTaskDirTop():JSX.Element {
		return <div className={'d-flex pr-3 pl-2 py-2'}>
			{this.renderIcon()}
			<div>
				{this.renderCaption()}
				{this.renderFrom()}
			</div>
			<span className="ml-auto">{this.renderEditTime()}</span>
		</div>;
	}

	/*
	protected renderDirTop():JSX.Element {
		return <div className="d-flex px-3 py-2 border-top">
			{this.renderIcon()}
			<div>
				{this.renderCaption()}
				{this.renderFrom()}
			</div>
			<div className="ml-auto">{this.renderEditTime()}</div>
		</div>;
	}*/

	protected renderDirBottom():JSX.Element {
		let divToCount = this.renderToCount();
		let divSpawnCount = this.renderSpawnCount();
		let divComment = this.renderCommentFlag();
		if (divToCount || divSpawnCount || divComment) {
			return <div className="d-flex align-items-center px-3 mb-1">
				{divToCount}
				{divSpawnCount}
				{divComment}
				<div className="mr-auto" />
			</div>;
		}
	}

	protected renderCaption() {
		let { caption: title } = this.controller;
		let divCaption = title ? <b className="text-primary">{title}</b> : <span className="text-info">任务</span>;
		return <div className="pr-3">
			<span className="mr-2">{divCaption}</span> {this.renderState()}
		</div>;
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

	protected get additionRows(): TaskParam[]  {
		return 	[
			//{label: '分值', values: this.renderPoint()}, 
			{label: '分派工时', values: this.renderAssignHours()}, 
			{label: '实际工时', values: this.renderHours()}, 
		];
	}

	protected renderTaskAdditions() {
		return <div>
			{this.additionRows.map(v => this.renderParam(v))}
		</div>;
	}

	protected renderPoint() {
		return <div className="flex-fill form-control border-0">
			{this.controller.point}
		</div>;
	}

	protected renderAssignHours() {
		return <div className="flex-fill form-control border-0">
			{taskTimeToString(this.controller.assignhours)}
		</div>;
	}

	protected renderHours() {
		return <div className="flex-fill form-control border-0">
			{taskTimeToString(this.controller.hours)}
		</div>;
	}

	protected renderViewBottom():JSX.Element {
		return;
		/*
		let { owner, state } = this.controller.noteItem;
		let right: any;
		let isMe = this.isMe(owner);		
		if (isMe === true && state === EnumTaskState.Start) {
			right = <>{this.renderEditButton()}</>;
		}
		return <div className="py-2 bg-light border-top d-flex align-items-end">
			{this.controller.cComments.renderCommentButton()}
			<div className="mr-auto" />
			{right}
		</div>;
		*/
	}

	renderRelatives() {
		return this.renderVm(VTaskRelatives as any);
	}

	protected renderState(): JSX.Element {
		return <>state</>;
	}
	/*
	protected onEdit() {
		this.openVPage(VEdit as any);
	}
	*/

	protected renderCheckItem(v:TaskCheckItemBase, checkable:boolean) {
		let {key, text, checked} = v;
		let cn = 'form-control-plaintext ml-3 ';
		let content: any;
		if (checked === true) {
			cn += 'text-muted';
			content = <del>{text}</del>;
		}
		else {
			content = text;
		}
		return <label key={key} className="d-flex mx-3 my-0 align-items-center form-check">
			<input className="form-check-input mr-3 mt-0" type="checkbox"
				defaultChecked={checked}
				onChange={this.onCheckChange}
				data-key={key}
				disabled={!checkable} />
			<div className={cn}>{content}</div>
		</label>;
	}

	private onCheckChange = async (evt:React.ChangeEvent<HTMLInputElement>) => {
		//let t = evt.currentTarget;
		//let key = Number(t.getAttribute('data-key'));
		//await this.controller.onCheckChange(key, t.checked);
	}
}
