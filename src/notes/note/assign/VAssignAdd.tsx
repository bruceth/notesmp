import { observer } from "mobx-react";
import React from "react";
import { VAssignEdit } from './VAssignEdit';

export class VAssignAdd extends VAssignEdit {
	protected async onButtonSend(): Promise<void> {
		await this.controller.saveAndAssingTo();
	}

	protected renderExButtons():JSX.Element {
		return;
	}

	protected renderEditBottom():JSX.Element {
		return <div className="py-2 pl-3 bg-light border-top d-flex">
			<div className="mr-auto" />
			{React.createElement(observer(() => <>
				<button onClick={() => this.onButtonSend()}
					className="btn btn-primary mr-3" disabled={this.controller.isNoteEmpty}>
					分派
				</button>
			</>))}
			{this.renderExButtons()}
		</div>;
	}
	
}
