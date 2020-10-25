//import React from 'react';
import { CNoteTask } from "./CNoteTask";
import { VNoteBaseEdit } from 'notes/noteBase';
//import { observer } from 'mobx-react';

export class VEdit extends VNoteBaseEdit<CNoteTask> { //} VNoteForm<CNoteTask> {
	header() { return this.t('task') }
	
	/*
	protected renderEditBottom():JSX.Element {
		return <div className="py-2 pl-3 bg-light border-top d-flex">
			<div className="mr-auto" />
			{React.createElement(observer(() => <>
				<button onClick={() => this.onButtonSave()}
					className="btn btn-primary mr-3" disabled={!this.controller.isNoteChanged}>
					保存
				</button>
			</>))}
			{this.renderExButtons()}
		</div>;
	}
	*/
/*
	@computed protected get btnSaveDisabled():boolean {
		//if (this.controller.isContentChanged === true) return false;
		//if (this.controller.isCaptionChanged === true) return false;
		if (this.controller.isNoteChanged === true) return false;
		return this.getSaveDisabled();
	}

	protected getSaveDisabled():boolean {
		return (this.controller.caption === undefined);
	}
*/
/*
	protected async onButtonSave(): Promise<void> {
		await this.controller.SetNote();
		this.closePage();
	}

	protected renderExButtons():JSX.Element {
		return;
	}
*/	
}
