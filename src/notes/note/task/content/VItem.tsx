import React from 'react';
import { FA } from '../../../../tonva';
import { TaskCheckItem } from '../model';
import { VBase } from "./VBase";

export class VItem extends VBase {
	protected renderCheckItem(v:TaskCheckItem) {
		let {key, text, checked} = v;
		let cn = 'ml-3 ';
		let content: any;
		let icon: string;
		if (checked === true) {
			cn += 'text-muted ';
			content = <del>{text}</del>;
			icon = 'check-square';
		}
		else {
			content = text;
			icon = 'square-o';
		}
		return <div key={key} className="d-flex mx-3 align-items-center">
			<FA name={icon} />
			<div className={'py-1 ' + cn}>{content}</div>
		</div>;
	}

	protected renderCheckedItems(checkedItems:TaskCheckItem[]):JSX.Element {
		let checkedCount = checkedItems.length;
		if (checkedCount > 0) {
			return <div className="">
				{checkedItems.map((v, index) => this.renderCheckItem(v))}
			</div>;
		}
	}
}
