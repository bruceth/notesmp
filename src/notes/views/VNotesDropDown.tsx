import React from 'react';
import { View, DropdownActions, DropdownAction } from "../../tonva";
import { CNotes } from "../CNotes";

export abstract class VNotesDropDown extends View<CNotes> {
	protected text = {
		icon:'file-o', 
		caption:this.t('noteText'), 
		action: this.controller.showAddNoteTextPage, 
		captionClass: 'text-primary'
	};
	protected list = {
		icon:'list', 
		caption:this.t('noteList'),
		action: this.controller.showAddNoteListPage,
	};
	protected checkable = {
		icon:'check-square-o', 
		caption:this.t('noteCheckable'), 
		action: this.controller.showAddNoteCheckablePage,
	};
	protected task = {
		icon:'hand-pointer-o', 
		caption:this.t('noteTask'), 
		action: this.controller.showAddAssignPage,
		iconClass: 'text-primary'
	};
	protected folder = {
		icon:'folder', 
		caption:this.t('noteFolder'), 
		action: this.controller.showAddMyFolderPage,
		iconClass: 'text-warning'
	};
	protected space = {
		icon:'users', 
		caption:this.t('noteCreateSpace'), 
		action: this.controller.showAddGroupPage,
		iconClass: 'text-danger'
	};

	protected abstract get dropdownActions(): DropdownAction[];

	render() {
		return <DropdownActions actions={this.dropdownActions}
			icon="plus"
			itemIconClass="text-info"
			className="cursor-pointer btn btn-lg text-white p-1 mr-1"/>
	}
}

export class VHomeDropdown extends VNotesDropDown {
	protected get dropdownActions(): DropdownAction[] {
		return [this.text, this.list, this.checkable, this.folder, undefined, this.space];
	}
}

export class VFolderDropdown extends VNotesDropDown {
	protected get dropdownActions(): DropdownAction[] {
		return [this.text, this.list, this.checkable, this.folder];
	}
}

export class  VSpaceDropdown extends VNotesDropDown {
	protected get dropdownActions(): DropdownAction[] {
		return [this.text, this.list, this.checkable, this.task, this.folder];
	}
}
