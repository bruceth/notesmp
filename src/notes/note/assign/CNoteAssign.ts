//import React from 'react';
import { computed, observable } from 'mobx';
//import { FA } from 'tonva';
import { Contact } from '../../../model';
import { EnumNoteType, NoteItem, numberFromId } from '../../model';
import { renderIcon } from '../../noteBase';
import { CContent, CCheckable } from '../../components';
import { CNote } from '../CNote';
import { VAssignView } from './VAssignView';
import { VAssignAdd } from './VAssignAdd';
//import { VAssignEdit } from './VAssignEdit'
import { VAssignDir } from './VAssignDir';
import { CAssignTo } from './CAssignTo';
import { CTaskObserver } from '../task/CTaskObserver';

export class CNoteAssign extends CNote {
	cContent: CContent;
	@observable checker: Contact;
	@observable rater: Contact;

	point:number = 100;
	@observable assignhours:number = 0;
	@observable changed:boolean = false;

	init(param: NoteItem): void {
		super.init(param);
		this.cContent = new CCheckable(this.res);
		let obj:any;
		if (param) {
			this.caption = param.caption;
			obj = param.obj;
			this.assignhours = obj.assignhours;
		}
		this.cContent.init(obj);
	}

	@computed get isContentChanged():boolean {return this.changed || this.cContent.changed}
	get type():EnumNoteType { return EnumNoteType.assign }
	@computed get isNoteEmpty(): boolean {
		return (this.caption === undefined || this.caption.trim().length === 0) || this.cContent.isEmpty;
	}

	renderIcon(): JSX.Element {
		return renderIcon('list', 'text-primary');
	}

	protected endContentInput():any {
		let obj = this.noteItem ? { ...this.noteItem.obj } : {};
		this.cContent.endInput(obj);
		obj.assignhours = this.assignhours;
		return obj;
	}

	renderDirItem(index: number): JSX.Element {
		return this.renderView(VAssignDir);
	}

	showViewPage() {
		this.openVPage(VAssignView);
	}

	showEditPage() {
		//this.cContent.startInput();
		//this.openVPage(VAssignEdit);
	}

	duplicateAssign = () => {
		//this.owner
		let noteItem = {...this.noteItem};
		noteItem.obj = JSON.parse(noteItem.content);
		noteItem.commentCount = 0;
		noteItem.commentUnread = 0;
		noteItem.note = undefined;
		this.closePage();
		this.owner.duplicateAssign(noteItem);
	}

	showAddPage() {
		this.cContent.startInput();
		this.startAction();
		this.openVPage(VAssignAdd);
	}

	saveAndAssingTo = async () => {
		let ret = await this.AddNote() as CNoteAssign;
		let cAssignTo = new CAssignTo(this.cApp, ret, true);
		cAssignTo.SetTopKey(this.TopKey);
		await cAssignTo.start();
	}

	showAssignTo = async () => {
		let cAssignTo = new CAssignTo(this.cApp, this);
		await cAssignTo.start();
	}

	assignTask = async (toList: number[]) => {
		let { note } = this.noteItem;
		let { caption, content } = this.noteItem;
		let cObj = JSON.parse(content);
		if (this.checker) {
			cObj.checker = numberFromId(this.checker.contact);
		}
		else {
			delete cObj.checker;
		}
		if (this.rater) {
			cObj.rater = numberFromId(this.rater.contact);
		}
		else {
			delete cObj.rater;
		}
		cObj.assignhours = this.assignhours;
		//cObj.hours = this.assignhours;
		cObj.point = this.point;
		let data = {
			groupFolder: this.owner.currentFold.groupFolder,
			folder: this.owner.currentFold.folderId,
			note,
			caption,
			content: JSON.stringify(cObj),
			tos: toList.map(v => ({to:v})),
			checker: this.checker?.contact,
			rater: this.rater?.contact,
			point: this.point,
		}
		await this.uqs.notes.AssignTask.submit(data);
		await this.lodeModel();
		this.noteItem.spawnCount = this.noteModel.spawn.length;
	}

	showSpawn = async (noteItem: NoteItem) => {
		let s = new CTaskObserver(this.owner);
		s.init(noteItem);
		await s.lodeModel();
		s.initModelData();
		s.showViewPage();
	}
}
