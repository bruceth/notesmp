import React from "react";
import { CContact } from "./CContact";
import { VPage } from "../../tonva";
import { observable, computed } from "mobx";
import { observer } from "mobx-react";

export class VEditAssigned extends VPage<CContact> {
	@observable private assigned:string;

	init(param?:any) {
		this.assigned = this.controller.contact?.assigned;
	}

	@computed protected get btnSaveDisabled():boolean {
		return this.assigned === this.controller.contact.assigned;
	}

	header() {
		return '编辑';
	}

	right():JSX.Element {
		return React.createElement(observer(() => <>
			<button onClick={() => this.onButtonSave()}
				className="btn btn-sm btn-success mr-1" disabled={this.btnSaveDisabled}>
				保存
			</button>
		</>));
	}

	protected onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
		this.assigned = evt.target.value.trim();
	}

	private onKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
		if (evt.keyCode === 13) {
			if (!this.btnSaveDisabled) {
				this.onButtonSave();
			}
		}
	}

	protected async onButtonSave(): Promise<void> {
		this.controller.SaveContactAssign(this.assigned);
		this.closePage();
	}

	content() {
		return <div className="border rounded">
			<div className="bg-white">
				<div className="px-3 py-2 bg-white d-flex align-items-center border-bottom">
					<div className="text-muted mr-3 w-4c">备注名</div>
					<input type="text" className="flex-fill w-100 border-0 form-control" maxLength={80}
						autoFocus={true}
						onChange={this.onChange}
						onKeyDown={this.onKeyDown}
						defaultValue={this.assigned} />
				</div>
			</div>
		</div>
	}
}