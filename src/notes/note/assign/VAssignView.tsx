import { NoteItem } from '../../../notes/model';
import React from 'react';
import { DropdownAction, DropdownActions, List } from '../../../tonva';
import { VNoteBaseView } from '../../noteBase';
import { getTaskItemState } from '../task/TaskState';
import { CNoteAssign } from './CNoteAssign';
import { VAssignRelatives } from './VAssignRelatives';

export class VAssignView extends VNoteBaseView<CNoteAssign> {
	header() {
		return this.t('noteTask')
	}

	protected renderRelatives() {
		return this.renderVm(VAssignRelatives);
	}

	right() {
		let dropdownActions: DropdownAction[] = [
			{
				icon:'hand-pointer-o', 
				caption:'复制任务', 
				action: this.controller.duplicateAssign,
				iconClass: 'text-primary'
			}
		];
		return <DropdownActions actions={dropdownActions}
			icon="plus"
			itemIconClass="text-info"
			className="cursor-pointer btn btn-lg text-white p-1 mr-1"/>
	}

	footer() {
		return this.renderFooter();
	}

	protected renderFooter() {
		return <div className="py-2 pl-3 bg-light border-top d-flex align-items-center">
			{this.controller.cComments.renderWriteComment()}
		</div>;
	}

	protected renderContent() {
		return this.controller.cContent.renderDirContent();
	}

	protected renderViewBottom():JSX.Element {
		let {noteItem, noteModel} = this.controller;
		if (this.isMe(noteItem.owner) === false) return;

		let {spawn} = noteModel;
		let div:any;
		if (spawn.length === 0) {
			div = <div className="px-3 py-2">
				<button className="btn btn-primary" onClick={this.controller.showAssignTo}>分派</button>
			</div>;
		}
		else {
			div = <div className="my-3">
				<div className="d-flex px-3 py-2 align-items-end">
					<div className="small text-muted pt-2 pb-1">已分派</div>
				</div>
				<List items={spawn} item={{render: this.renderSpawn, className:'notes'}} />
			</div>;
		}
		return <div className="bg-light">{div}</div>;
	}

	private renderSpawn = (noteItem: NoteItem, index: number) => {
		let {owner, assigned} = noteItem;
		let state = getTaskItemState(noteItem);
		let {content, isEnd} = state;
		return <div className="px-3 py-2 bg-light border-top" onClick={e=>this.controller.showSpawn(noteItem)}>
			{this.renderContact(owner as number, assigned)}
			<div className="ml-2"></div>
			{this.renderStateSpan(content, isEnd)}
		</div>
	}

	protected renderEditButton() : JSX.Element {
		return;
	}

}
