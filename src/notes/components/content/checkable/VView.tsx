import React from 'react';
import { ContentCheckItem } from './CCheckable';
import { VBase } from './VBase';

export class VView extends VBase {
	protected renderCheckItem(v:ContentCheckItem) {
		let {key, text, checked} = v;
		let cn = 'ml-3 ';
		let content: any;
		if (checked === true) {
			cn += 'text-muted ';
			content = <del>{text}</del>;
		}
		else {
			content = text;
		}
		return <label key={key} className="d-flex mx-3 align-items-center form-check mb-0">
			<input className="form-check-input mr-3 mt-0" type="checkbox"
				defaultChecked={checked}
				data-key={key}
				onChange={e => this.onCheckChange(v, e.currentTarget.checked)} />
			<div className={'form-control-plaintext ' + cn}>{content}</div>
		</label>;
	}

	private onCheckChange(item:ContentCheckItem, checked:boolean) {
		item.checked = checked;
	}

	protected renderCheckedItems(checkedItems:ContentCheckItem[]):JSX.Element {
		let checkedCount = checkedItems.length;
		if (checkedCount > 0) {
			return <div className="border-top py-2">
				<div className="px-3 pt-2 small text-muted">{checkedCount}项完成</div>
				{checkedItems.map((v, index) => this.renderCheckItem(v))}
			</div>;
		}
	}
}
