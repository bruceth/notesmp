import React from 'react';
import { observer } from 'mobx-react';
import { View } from "../../../../tonva";
import { CTaskContent } from './CTaskContent';
import { TaskCheckItem } from '../model';

export abstract class VBase extends View<CTaskContent> {
	render() {
		return React.createElement(observer(() => {
			let {uncheckedItems, checkedItems} = this.controller.getItems();
			return <div className="mb-2">
				{uncheckedItems.map((v, index) => this.renderCheckItem(v))}
				{this.renderCheckedItems(checkedItems)}
			</div>;
		}));
	}

	protected abstract renderCheckItem(v:TaskCheckItem):JSX.Element;
	protected abstract renderCheckedItems(checkedItems:TaskCheckItem[]):JSX.Element;
}
