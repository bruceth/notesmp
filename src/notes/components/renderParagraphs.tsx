import React from 'react';

export function renderParagraphs(content:string):JSX.Element {
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
