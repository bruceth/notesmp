import React from 'react';
import { ListInputBase } from "../ListInputBase";
import { ListItem } from "./CList";

export class ListInput extends ListInputBase<ListItem> {
	protected getItemKey(item:ListItem): number {return item.key}
	protected getItemText(item:ListItem): string {return item?.text}
	protected setItemText(item:ListItem, text:string): void {if (item) {item.text = text}}
	protected newItem(key:number, text:string): ListItem {return {key, text}};

	protected renderItemHeader(item:ListItem):JSX.Element {
		return <div className="w-3c w-min-3c w-max-3c pt-2 text-center">●</div>;
	}
}
