import React from "react";
import { VTextEdit } from "./VTextEdit";
import { observer } from "mobx-react";

export class VTextAdd extends VTextEdit {
	header() {return <>新建</>}

	protected async onButtonSave(): Promise<void> {
		await this.controller.AddNote();
		this.closePage();
		return;
	}

	protected renderExButtons():JSX.Element {
		return React.createElement(observer(() => {
			return this.renderShareButton();
		}));
	}

	protected renderShareButton() {
		return <button onClick={this.onSaveAndSendNote}
			className="btn btn-outline-primary mr-3">
			发给
		</button>;
	}

	protected onSaveAndSendNote = async () => {
		let cnewNote = await this.controller.AddNote();
		this.closePage();
		await cnewNote.cApp.loadRelation();
		cnewNote.showShareTo();
	}

}
