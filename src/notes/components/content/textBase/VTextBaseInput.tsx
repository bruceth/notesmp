import React from 'react';
import { View } from "../../../../tonva";
import { CTextBase } from './CTextBase';
import { observer } from 'mobx-react';

export class VTextBaseInput<T extends CTextBase> extends View<T> {
	render() {
		return <div className="py-1 px-1">
			{React.createElement(observer(() => this.renderContentTextArea()))}
		</div>;
	}

	private renderContentTextArea() {
		return <textarea rows={10} 
			className="w-100 border-0 form-control" 
			placeholder={this.t('content')} maxLength={20000}
			defaultValue={this.controller.noteContent}
			onChange={this.onContentChange} />;
	}

	private onContentChange = (evt:React.ChangeEvent<HTMLTextAreaElement>) => {
		this.controller.changedNoteContent = evt.target.value;
		this.controller.changed = true;
	}
}
