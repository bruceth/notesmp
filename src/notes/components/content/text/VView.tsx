import React from 'react';
import { VTextBaseView } from '../textBase';
import { CText } from './CText';

export class VView<T extends CText> extends VTextBaseView<T> {
	render() {
		return <div className="px-3 my-2">
			{this.renderParagraphs(this.controller.noteContent)}
		</div>;
	}
}
