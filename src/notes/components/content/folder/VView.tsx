//import React from 'react';
//import { View } from "tonva";
import { CFolder } from './CFolder';
import { VTextBaseView } from '../textBase';

export class VView extends VTextBaseView<CFolder> {
	/*
	render() {
		return <div className="px-3 my-2">
			{this.renderParagraphs(this.controller.noteContent)}
		</div>;
	}

	protected renderParagraphs(content:string):JSX.Element {
		if (!content) return;
		return <>{content.trimRight().split('\n').map((v, index) => {
			let c:any;
			if (!v) {
				c = '\u00A0'; //<>&nbsp;</>;
			}
			else {
				c = '';
				let len = v.length, i=0;
				for (; i<len; i++) {
					switch(v.charCodeAt(i)) {
						case 0x20: c +='\u2000'; continue;
					}
					break;
				}
				c += v.substr(i);
			}
			return <div key={index} className="pt-1 pb-2">{c}</div>;
		})}</>;
	}
	*/
}
