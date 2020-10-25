import React from 'react';
import { observer } from 'mobx-react';
import { VContainerForm } from '../views/VContainerForm';
import { CSpace } from './CSpace';

export class VSpaceEdit extends VContainerForm<CSpace> {
	protected get back(): 'close' | 'back' | 'none' {return 'close'}
	header() {
		return '编辑空间';
	}

	protected renderEditBottom():JSX.Element {
		return <div className="py-2 pl-3 bg-light border-top d-flex">
			<div className="mr-auto" />
			{React.createElement(observer(() => <>
				<button onClick={() => this.onButtonSave()}
					className="btn btn-primary mr-3" disabled={!this.controller.isNoteChanged}>
					保存
				</button>
			</>))}
		</div>;
	}

	protected async onButtonSave(): Promise<void> {
		await this.controller.SetGroup();
		this.closePage();
	}
}
