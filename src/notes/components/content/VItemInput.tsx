import React from "react";
import { Controller, View } from "tonva";
import { observable, computed } from "mobx";
import { observer } from "mobx-react";

export interface ItemInputProps {
	onChange: (inputContent: string) => Promise<void>;
	content: string;
	placeholder?: string;
}

export class VItemInput<T extends Controller> extends View<T> {
	@observable protected isFocused: boolean = false;
	@observable protected inputContent: string;
	@computed get content() {
		let content: any = this.inputContent;
		if (!content && this.props.placeholder) {
			content = <small className="text-muted">{this.props.placeholder}</small>;
		}

		return content;
	}
	private props: ItemInputProps;

	render(props: ItemInputProps): JSX.Element {
		this.props = props;
		this.inputContent = props.content;
		return React.createElement(observer(() => this.isFocused === true ?
			<input className="flex-fill form-control border-0"
				type="text"
				ref={this.inputRef}
				onBlur={this.onBlur}
				onKeyDown={this.onKeyDown} onChange={this.onInputChange} />
			:
			<div className="cursor-pointer flex-fill border-0 py-2"
				onClick={() => this.isFocused = true}>
				{this.content}
			</div>
		));
	}

	protected input: HTMLInputElement;
	protected lostFocusTimeoutHandler: any;
	protected onKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
		// if (evt.keyCode === 13) {
			this.onUpdateAction();
		//}
	}
	protected onBlur = (evt: React.FocusEvent<HTMLInputElement>) => {
		this.lostFocusTimeoutHandler = setTimeout(() => {
			this.lostFocusTimeoutHandler = undefined;
			this.isFocused = false;
		}, 200);
		if (this.inputContent !== this.props.content && this.props?.onChange) {
			this.props.onChange(this.inputContent);
		}
	}
	protected onInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
		this.inputContent = this.input.value.trim();
	}
	protected inputRef = (input: any) => {
		if (!input) return;
		if (window.getComputedStyle(input).visibility === 'hidden') return;
		this.input = input;
		this.input.focus();
		if (this.inputContent) this.input.value = this.inputContent;
	}

	protected onUpdateAction = async () => {
		clearTimeout(this.lostFocusTimeoutHandler);
		if (!this.input) return;
		if (!this.inputContent) return;
		this.input.disabled = true;
		if (this.inputContent !== this.props.content && this.props?.onChange) {
			this.props.onChange(this.inputContent);
		}
		this.input.disabled = false;
		this.isFocused = false;
	}
}
