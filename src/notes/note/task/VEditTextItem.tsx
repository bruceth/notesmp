import React from "react";
import { Controller, View, Page } from "../../../tonva";
import { observable } from "mobx";
import { observer } from "mobx-react";

export interface EditTextItemProps {
	onUpdate: (inputContent: string) => Promise<void>;
	content: string;
	header: string;
}

export class VEditTextItemInput<T extends Controller> extends View<T> {
	@observable private disabled: boolean;
	private inputText: string;
	private props: EditTextItemProps;

	constructor(controller: T, props: EditTextItemProps) {
		super(controller);
		this.props = props;
		this.inputText = this.props.content;
	}

	onUpdate = () => {
		this.disabled = true;
		this.openPageElement(React.createElement(observer(() => {
			let onClickSave = async () => {
				if (this.disabled === true) return;
				let inputText = this.inputText.trim();
				await this.props.onUpdate(inputText);
				this.closePage();
			}
			let onKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
				if (evt.keyCode === 13) onClickSave();
			}
			let onInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
				this.inputText = evt.target.value;
				this.disabled = this.props.content === this.inputText;
			}
			let right = <button className="btn btn-sm btn-success mr-2"
				disabled={this.disabled}
				onClick={onClickSave}>保存</button>;
			return <Page header={this.props.header} back="close" right={right}>
				<div className="p-3">
					<input className="form-control" type="text"
						onChange={onInputChange} onKeyDown={onKeyDown}
						defaultValue={this.props.content} />
				</div>
			</Page>;
		})));
	}

	render(props: EditTextItemProps): JSX.Element {
		this.props = props;
		this.inputText = this.props.content;

		return <></>
	}
}
