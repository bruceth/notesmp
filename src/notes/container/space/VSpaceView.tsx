import React from 'react';
import { DropdownAction, FA } from '../../../tonva';
import { VFolder } from "../views/VFolder";
import { CSpace } from './CSpace';
import { VNotesDropDown } from '../../views';
import { CNotes } from '../../../notes/CNotes';
import { observer } from 'mobx-react';

export class VSpaceView extends VFolder<CSpace> {
	header() {
		return React.createElement(observer(() => {
			let {noteItem} = this.controller;
			let caption = noteItem ? noteItem.caption : this.t('noteSpace');
			return <div>{caption}</div>
		}));
	}

	right() {
		if (this.isMe(this.controller.groupOwner)) {
			let dd = new VSpaceDropdown(this.controller.owner, this.controller);
			return dd.render();
		}
		else {
			return this.controller.owner.renderSpaceDropDown();
		}
	}

	protected top():JSX.Element {
		let {noteItem} = this.controller;
		if (!noteItem) return;

		let paragraphs: string = '群';
		let {content: contentString} = noteItem;
		if (contentString) {
			let json = JSON.parse(contentString);
			if (json) {
				let {content} = json;
				paragraphs = (content as string)?.trimEnd();
				paragraphs = paragraphs.replace(/(\r|\n)/g, ' ');
			}
		}
		return <div className="px-3 py-3 d-flex cursor-pointer align-items-center"
			onClick={this.controller.showSpaceContent}>
			<FA className="mr-3 mt-1 text-warning" name="users" size="2x" />
			<div className="text-muted mr-3" style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
				{paragraphs}
			</div>
		</div>;
	}
}

class  VSpaceDropdown extends VNotesDropDown {
	private cSpace: CSpace;
	
	constructor(cNotes:CNotes, cSpace: CSpace) {
		super(cNotes);
		this.cSpace = cSpace;
	}
	protected get dropdownActions(): DropdownAction[] {
		let addMember = {
			icon:'user-o', 
			caption:this.t('成员增减'), 
			action: this.cSpace.showAddMember,
			iconClass: 'text-success'
		};
		return [this.text, this.list, this.checkable, this.task, this.folder, undefined, addMember];
	}
}
