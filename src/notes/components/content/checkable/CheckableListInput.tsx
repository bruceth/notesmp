import React from 'react';
import { ListInputBase } from "../ListInputBase";
import { ContentCheckItem } from "./CCheckable";

export class CheckableListInput extends ListInputBase<ContentCheckItem> {
	protected getItemKey(item:ContentCheckItem): number {return item.key}
	protected getItemText(item:ContentCheckItem): string {return item?.text}
	protected setItemText(item:ContentCheckItem, text:string): void {if (item) {item.text = text}}
	protected newItem(key:number, text:string): ContentCheckItem {return {key, text, checked:false}};

	protected renderItemHeader(item:ContentCheckItem):JSX.Element {
		return <label className="w-3c w-min-3c w-max-3c text-center mb-0">
			<input className="mt-3" type="checkbox"
				defaultChecked={item.checked}
				onChange={e => this.onCheckChange(item, e.currentTarget.checked)} />
		</label>;
	}

	private onCheckChange = (item:ContentCheckItem, checked:boolean) => {
		item.checked = checked;
		this.props.onChanged();
	}
}
