import { CContent } from "../CContent";
//import { VInput } from "./VInput";
import { VView } from "./VView";
import { observable } from "mobx";
import { ListInput } from "./ListInput";

export interface ListItem {
	key: number;
	text: string;
}

export class CList extends CContent {
	private listInput: ListInput;
	@observable items: ListItem[] = [];
	itemKey: number = 1;

	init(obj:any) {
		this.itemKey = obj.itemKey;
		this.items = obj.items;
	}

	get isEmpty():boolean { return this.items.length === 0; }

	startInput(): void {
		super.startInput();
		this.listInput = new ListInput({
			items: this.items,
			uniqueKey: () => this.itemKey++,
			onChanged: () => this.changed = true,					
		});
	}

	renderInput():JSX.Element {
		return this.listInput.render();
		//let v = new VInput(this);
		//return v.render();
	}
	renderViewContent():JSX.Element {return this.renderView(VView)}

	endInput(obj:any): void {
		this.items = this.listInput.getList();
		this.buildObj(obj);
	}

	protected buildObj(obj:any): void {
		obj.itemKey = this.itemKey;
		obj.items = this.items;
		delete obj.content;
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
				}
			}));
		}
	}
/*
	onItemChanged = (key: number, value: string) => {
		let item = this.items.find(v => v.key === key);
		if (item) {
			item.text = value;
		}
		else {
			this.inputingText = value;
		}
		this.changed = true;
	}

	addNewItem(): void {
		if (this.inputingText === undefined) return;
		let text = this.inputingText.trim();
		if (text.length === 0) return;
		this.items.push({
			key: this.itemKey++,
			text: text,
		});
		this.changed = true;
		this.inputingText = undefined;
	}
*/
}
