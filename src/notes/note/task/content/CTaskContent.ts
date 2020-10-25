import { observable } from "mobx";
import { CContent } from "../../../components";
import { VView } from "./VView";
import { VItem } from "./VItem";
import { TaskCheckItem } from "../model";

export class CTaskContent extends CContent {
	allowCheck: boolean;
	private inputingText: string;
	@observable items: TaskCheckItem[] = [];
	itemKey: number = 1;

	init(obj:any) {
		if (obj) {
			if (obj.itemKey !== undefined && obj.items !== undefined) {
				this.itemKey = obj.itemKey;
				this.items = obj.items;
			}
		}
	}

	renderInput():JSX.Element {
		return;
	}

	renderViewContent():JSX.Element {return this.renderView(VView)}
	renderDirContent():JSX.Element {return this.renderView(VItem)}

	endInput(obj:any): void {
		this.addNewItem();
		this.buildObj(obj);
	}

	protected buildObj(obj:any): void {
		obj.itemKey = this.itemKey;
		obj.items = this.items;
	}

	toString():string { 
		return this.items?.map(v => v.text).join('\n')
	}

	fromString(value: string) {
		if (value) {
			this.items = [];
			this.itemKey = 1;
			this.items.push(...value.split('\n').filter((v, index) => {
				return v.trim().length > 0;
			}).map((v, index) => {
				return {
					key: this.itemKey++,
					text: v,
					checked: false
				}
			}));
		}
	}

	async onCheckChange(key: number, checked: boolean) {
		let item = this.items.find(v => v.key === key);
		if (item) item.checked = checked;
		//await this.onContentChanged?.();
		//await this.SetNote(false);
	}
	/*
	onItemChanged = (key: number, value: string) => {
		let item = key && this.items.find(v => v.key === key);
		if (item) {
			item.text = value;
		}
		else {
			this.inputingText = value;
		}
		this.changed = true;
	}
	*/

	addNewItem(): void {
		if (this.inputingText === undefined) return;
		let text = this.inputingText.trim();
		if (text.length === 0) return;
		this.items.push({
			key: this.itemKey++,
			text,
			checked: false,
		});
		this.changed = true;
		this.inputingText = undefined;
	}

	getItems():{uncheckedItems:TaskCheckItem[], checkedItems: TaskCheckItem[]} {
		let uncheckedItems:TaskCheckItem[] = [];
		let checkedItems:TaskCheckItem[] = [];
		for (let ci of this.items) {
			let {checked} = ci;
			if (checked === true) checkedItems.push(ci);
			else uncheckedItems.push(ci);
		}
		return {uncheckedItems, checkedItems};
	}
}
