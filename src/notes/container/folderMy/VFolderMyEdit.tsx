import React from 'react';
import { observer } from 'mobx-react';
import { VContainerForm } from '../views/VContainerForm';
import { CFolderMy } from './CFolderMy';

export class VFolderMyEdit extends VContainerForm<CFolderMy> {
	protected get back(): 'close' | 'back' | 'none' {return 'close'}
	header() {
		return '编辑目录';
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
}
