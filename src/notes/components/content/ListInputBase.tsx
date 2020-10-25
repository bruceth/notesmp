import React from 'react';
import { observer } from 'mobx-react';
import { observable, toJS } from 'mobx';
import { FA } from '../../../tonva';

interface Focusable<T> {
	item: T;
	focused: boolean;
}

export interface ListInputProps<T> {
	items: T[];
	uniqueKey: () => number;
	onChanged: () => void;
}

export abstract class ListInputBase<T> {
	protected props: ListInputProps<T>;
	@observable private focusables: Focusable<T>[];
	private currentFocusable: Focusable<T>;
	private inputingText: string;
	private focuseTimeout: any;

	constructor(props: ListInputProps<T>) {
		this.props = props;
		let {items} = props;
		this.focusables = items? items.map(item => ({
			item: toJS(item), 
			focused: false
		})) : [];
	}

	protected abstract getItemKey(item:T): number;
	protected abstract getItemText(item:T): string;
	protected abstract setItemText(item:T, text:string): void;
	protected abstract newItem(key:number, text:string): T;

	getList():T[] { return this.focusables.map(v => toJS(v.item))}

	render(): JSX.Element {
		return React.createElement(observer(() => <div>
			{this.focusables.map(this.renderItem)}
			{this.renderNewInput()}
		</div>));
	}

	protected renderItem = (focusable: Focusable<T>):JSX.Element => {
		let {focused} = focusable;
		return focused === true? this.renderInputItem(focusable) : this.renderTextItem(focusable);
	}

	protected renderTextItem(focusable:Focusable<T>):JSX.Element {
		let {item} = focusable;
		let key = this.getItemKey(item);
		let text = this.getItemText(item);
		return <div key={key} className="d-flex mr-3 align-items-stretch">
			{this.renderItemHeader(item)}
			<div className="flex-fill py-2" onMouseDown={() => this.onItemClick(focusable)}>{text}</div>
		</div>;
	}

	protected renderItemHeader(item:T):JSX.Element {
		return <span>item</span>;
	}

	protected onItemClick(focusable: Focusable<T>) {
		if (this.currentFocusable) {
			this.currentFocusable.focused = false;
		}
		this.currentFocusable = focusable;
		focusable.focused = true;
		if (this.focuseTimeout) {
			clearTimeout(this.focuseTimeout);
			this.focuseTimeout = undefined;
		}
		this.focuseTimeout = setTimeout(() => {
			this.input?.focus();
			console.log('this.input ' + (this.input? 'null' : 'focus') );
		}, 10);
	}

	protected renderInputItem(focusable: Focusable<T>):JSX.Element {
		let {item} = focusable;
		let key = this.getItemKey(item);
		return <div key={key} className="d-flex mr-3 align-items-stretch">
			{this.renderItemHeader(item)}
			{this.renderInput(focusable)}
		</div>;
	}

	protected renderInput(focusable?: Focusable<T>):JSX.Element {
		return <input type="text" className="flex-fill form-control"
			defaultValue={this.getItemText(focusable?.item)}
			ref={this.inputRef}
			onBlur={this.onBlur}
			onKeyDown={this.onKeyDown}
			onChange={this.onChange} />;
	}

	protected renderNewInput():JSX.Element {
		return <div className="d-flex mr-3 my-2 align-items-center">
			<div className="w-3c w-min-3c w-max-3c text-center">
				<FA name="plus" className="text-info mt-1" fixWidth={true} /> 
			</div>
			<input className="flex-fill form-control" 
				type="text" 
				placeholder="新增" 
				onBlur={this.onBlurAddNew}
				onChange={this.onChange}
				onKeyDown={this.onAddNewEnter} />
		</div>;
	}

	private onAddNewEnter = (evt: React.KeyboardEvent<HTMLInputElement>) => {
		if (evt.keyCode !== 13) return;
		evt.currentTarget.value = '';
		this.addNewItem();
	}

	private addNewItem() {
		if (!this.inputingText) return;
		if (this.inputingText.trim().length === 0) return;
		this.focusables.push(
			{
				item: this.newItem(this.props.uniqueKey(), this.inputingText.trimRight()),
				focused: false
			}
		);
		this.inputingText = undefined;
	}

	protected input: HTMLInputElement;
	private onKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
		if (evt.keyCode !== 13) return;
		this.currentFocusable.focused = false;
		evt.currentTarget.value = '';
		this.inputingText = undefined;
		this.currentFocusable = undefined;
	}

	private onBlur = (evt: React.FocusEvent<HTMLInputElement>) => {
		this.currentFocusable.focused = false;
		this.currentFocusable = undefined;
	}
	private onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
		let {value} = evt.target;
		this.inputingText = value;
		if (this.currentFocusable) this.setItemText(this.currentFocusable.item, value);
		this.props.onChanged();
	}
	private inputRef = (input: any) => {
		if (!input) return;
		if (window.getComputedStyle(input).visibility === 'hidden') return;
		this.input = input;
		//this.input.focus();
	}
	private onBlurAddNew = (evt: React.FocusEvent<HTMLInputElement>) => {
		evt.currentTarget.value = '';
		this.addNewItem();
	}
}
