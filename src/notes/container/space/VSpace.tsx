import React from 'react';
import { VFolder } from "../views/VFolder";
import { CSpace } from './CSpace';
import { FA } from 'tonva';

export class VSpace extends VFolder<CSpace> {
	protected top():JSX.Element {
		let {noteItem} = this.controller;
		if (!noteItem) return;

		let paragraphs: string = '空间';
		let {content: contentString} = noteItem;
		if (contentString) {
			let json = JSON.parse(contentString);
			if (json) {
				let {content} = json;
				paragraphs = (content as string)?.trimEnd();
			}
		}
		let left: any;
		left = <>
			<FA className="mr-3 text-warning py-3" name="users" size="3x" />
			<div className="small text-muted py-3">{this.renderParagraphs(paragraphs)}</div>
		</>;
		return <div className="d-flex ml-3">
			{left}
			<div className="ml-auto align-self-stretch cursor-pointer px-3 d-flex align-items-center" 
				onClick={(e)=>{e.stopPropagation(); this.controller.showFolderView()}}>
				<FA name="ellipsis-h" />
			</div>
		</div>;
	}
}
