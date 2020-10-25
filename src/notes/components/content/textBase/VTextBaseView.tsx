import { renderParagraphs } from '../../../components';
import React from 'react';
import { View } from "../../../../tonva";
import { CTextBase } from './CTextBase';

export class VTextBaseView<T extends CTextBase> extends View<T> {
	render() {
		return <div className="px-3 my-2">
			{this.renderParagraphs(this.controller.noteContent)}
		</div>;
	}
	
	protected renderParagraphs(content:string):JSX.Element {
		return renderParagraphs(content);
	}
}
