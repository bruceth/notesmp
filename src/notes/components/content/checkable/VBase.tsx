import React from 'react';
import { View } from "../../../../tonva";
import { CCheckable, ContentCheckItem } from './CCheckable';
import { observer } from 'mobx-react';

export abstract class VBase extends View<CCheckable> {
	render() {
		return React.createElement(observer(() => {
			let {uncheckedItems, checkedItems} = this.controller.doneItems;
			return <div className="mb-2">
				{uncheckedItems.map((v, index) => this.renderCheckItem(v))}
				{this.renderCheckedItems(checkedItems)}
			</div>;
		}));
	}

	protected abstract renderCheckItem(v:ContentCheckItem):JSX.Element;
	protected abstract renderCheckedItems(checkedItems:ContentCheckItem[]):JSX.Element;
}
