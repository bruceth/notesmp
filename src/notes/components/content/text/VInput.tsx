//import React from 'react';
import { CText } from './CText';
//import { observer } from 'mobx-react';
//import { View, t } from 'tonva';
import { VTextBaseInput } from '../textBase';

export class VInput<T extends CText> extends VTextBaseInput<T> {
	/*
	render() {
		return <div className="py-1 px-1">
			{React.createElement(observer(() => this.renderContentTextArea()))}
		</div>;
	}

	private renderContentTextArea() {
		return <textarea rows={10} 
			className="w-100 border-0 form-control" 
			placeholder={t('content')} maxLength={20000}
			defaultValue={this.controller.noteContent}
			onChange={this.onContentChange} />;
	}

	private onContentChange = (evt:React.ChangeEvent<HTMLTextAreaElement>) => {
		this.controller.changedNoteContent = evt.target.value;
		this.controller.changed = true;
	}
	*/
}
