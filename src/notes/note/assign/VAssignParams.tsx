import React from 'react';
import { observer } from 'mobx-react';
import { VPage, FA, UserView, Image, User } from "../../../tonva";
import { none } from '../../../tool';
import { Contact } from '../../../model';
import { SelectContactOptions } from '../../views';
import { CNoteAssign } from "./CNoteAssign";
import { CAssignTo } from './CAssignTo';
import { CNotes } from '../../../notes/CNotes';
import { CSelectContact } from '../../../notes/components/selectContact';
import { taskTimeToString } from '../../../notes/model';
import { CInputHours } from '../../../notes/components';

export interface Row {
	label: string;
	values?: any;
	onClick?: () => void;
}

//const none = <small className="text-muted">[无]</small>;

export class VAssignParams extends VPage<CAssignTo> {
	private cNoteAssign: CNoteAssign;

	init() {
		this.cNoteAssign = this.controller.cNoteAssign;
	}

	header() {return '分派任务'}
	get back(): 'close'|'back'|'none' {return 'close';}

	private renderParam(param: Row) {
		let {label, values, onClick} = param;
		return <div key={label} className="px-3 py-2 bg-white d-flex cursor-pointer align-items-center border-bottom" onClick={onClick}>
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

	content() {
		let rows: Row[] = [
			//{label: '执行人', values: this.renderContacts(), onClick: this.onClickContacts}, 
			//{label: '分值', values: this.renderPoint()}, 
			{label: '工时', values: this.renderHours(), onClick: this.onClickHours}, 
			{label: '检查人', values: this.renderChecker(), onClick: this.onClickChecker}, 
			{label: '评价人', values: this.renderRater(), onClick: this.onClickRater}, 
		];
		//let {owner} = this.controller;
		return <div className="py-2">
			{this.cNoteAssign.renderDirItem(0)}
			{rows.map(v => this.renderParam(v))}
			<div className="px-3 py-2"><button className="btn btn-primary" onClick={this.controller.onSendOut}>发送</button></div>
		</div>;
	}

	private renderContact = (item:Contact, index?:number) => {
		if (!item) return none;
		let {contact, assigned} = item;
		let renderUser = (user:User) => {
			let {name, nick, icon} = user;
			return <>
				<Image className="w-1c h-1c mr-1" src={icon || '.user-o'} />
				<span className="mr-3">{assigned || nick || name}</span>
			</>;
		}
		return <UserView user={contact} render={renderUser} />;
	}

	private renderPoint() {
		return <input className="flex-fill form-control border-0"
				type="number" step="1" min="1" defaultValue={this.cNoteAssign.point}
				onChange={this.onItemChange}
				onKeyDown={this.onItemKeyDown}/>;
	}

	private renderHours() {
		let time = taskTimeToString(this.cNoteAssign.assignhours);
		return <div className="flex-fill form-control border-0">{time}</div>
		// return <input className="flex-fill form-control border-0"
		// 		type="text"
		// 		placeholder="2.5或者2:30表示两个半小时"
		// 		defaultValue={time}
		// 		onChange={this.onHoursChange}
		// 		onBlur={this.onHoursBlur}
		// 		onKeyDown={this.onHoursKeyDown}/>;
	}

	private onClickHours = async () => {
		let chours = new CInputHours(this.cNoteAssign.owner);
		let h = await chours.inputHours(this.cNoteAssign.assignhours);
		this.closePage();
		if (h !== undefined) {
			this.cNoteAssign.assignhours = h;
		}
	}


	private onItemChange = (evt:React.ChangeEvent<HTMLInputElement>) => {
		this.cNoteAssign.point = Number(evt.currentTarget.value);
	}

	private onItemKeyDown = (evt:React.KeyboardEvent<HTMLInputElement>) => {
	}

	// private onHoursChange = (evt:React.ChangeEvent<HTMLInputElement>) => {
	// 	let m = checkHourMinutes(evt.target.value);
	// 	if (m < 0) {
	// 		m = 0;
	// 	}
	// 	this.cNoteAssign.assignhours = m;
	// }

	// private onHoursKeyDown = (evt:React.KeyboardEvent<HTMLInputElement>) => {
	// }

	// protected onHoursBlur = (evt: React.FocusEvent<HTMLInputElement>) => {
	// 	if (checkHourMinutes(evt.target.value) < 0) {
	// 		evt.target.value = '';
	// 		this.cNoteAssign.assignhours = 0;
	// 	}
	// }

	private renderChecker() {
		return React.createElement(observer(() => this.renderContact(this.cNoteAssign.checker)));
	}

	private onClickChecker = async () => {
		let cSelectContact = new CNotesSelectContact(this.cNoteAssign.owner, '检查人')
		cSelectContact.SetContacts(this.controller.GetAssignToContacts());

		let options: SelectContactOptions = {title: '检查人', single: true};
		let contacts = await cSelectContact.callSelectContact(options);
		this.closePage();
		this.cNoteAssign.checker = contacts[0];
	}

	private renderRater() {
		return React.createElement(observer(() => this.renderContact(this.cNoteAssign.rater)));
	}

	private onClickRater = async () => {
		let cSelectContact = new CNotesSelectContact(this.cNoteAssign.owner, '评价人')
		cSelectContact.SetContacts(this.controller.GetAssignToContacts());

		let options: SelectContactOptions = {title: '评价人', single: true};
		let contacts = await cSelectContact.callSelectContact(options);
		this.closePage();
		this.cNoteAssign.rater = contacts[0];
	}
}

class CNotesSelectContact extends CSelectContact {
	protected cNotes: CNotes;
	title: string;
	constructor(cNotes:CNotes, title: string) {
		super(cNotes.cApp);
		this.cNotes = cNotes;
		this.title = title;
	}

	SetContacts(contacts:Contact[]) {
		this.contacts = [];
		for (var ci of contacts) {
			let n = {...ci};
			n.already = 0;
			this.contacts.push(n);
		}
	}

	protected async loadContacts() {
	}
}
