import React from 'react';
import { observer } from 'mobx-react';
import { CNoteBase } from "./CNoteBase";
import { VNoteBaseForm } from './VNoteBaseForm';

export class VNoteBaseEdit<T extends CNoteBase> extends VNoteBaseForm<T> {
	/*
	@computed protected get btnSaveDisabled():boolean {
		if (this.controller.isContentChanged === true) return false;
		if (this.controller.isCaptionChanged === true) return false;
		return true;
	}
	*/

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

	protected async onButtonSave(): Promise<void> {
		await this.controller.SetNote();
		this.closePage();
	}

	protected renderExButtons():JSX.Element {return}
}

export class VNoteBaseEditPage extends VNoteBaseEdit<CNoteBase> {
}
