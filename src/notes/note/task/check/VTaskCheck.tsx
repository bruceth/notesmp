import React from 'react';
import { VTaskView } from '../VTaskView';
import { Page, FA } from '../../../../tonva';
import { VEditTextItemInput, EditTextItemProps } from '../VEditTextItem';
import { CTaskCheck } from './CTaskCheck';
import { TaskCheckItem } from '../model';

export class VTaskCheck extends VTaskView<CTaskCheck> {
	protected renderState(): JSX.Element {
		return this.renderStateSpan('待验收');
	}

	protected renderCheckItem(item: TaskCheckItem) {
		let { key, text, checked, checkInfo } = item;
		let cn = 'form-control-plaintext ml-3 ';
		let content: any;
		if (checked === true) {
			cn += 'text-muted';
			content = <del>{text}</del>;
		}
		else {
			content = text;
		}
		let onUpdate = async (v: string) => {
			await this.controller.setCheckInfo(item, v);
		}
		let eprops: EditTextItemProps = { onUpdate: onUpdate, content: checkInfo, header: '验收事项说明' }
		let vEdit = new VEditTextItemInput(this.controller, eprops);
		return <div key={key} className={'d-flex'}>
			<label className="flex-grow-1 d-flex mx-3 my-0 align-items-center form-check">
				<input className="form-check-input mr-3 mt-0" type="checkbox"
					defaultChecked={checked}
					data-key={key}
					disabled={!this.controller.allowCheck} />
				<div className="flex-grow-1">
					<div className={cn}>{content}</div>
					{checkInfo && <div className="mt-1 ml-3 small">
						<FA name="comment-o" className="mr-2 text-primary" />
						<span className="text-info cursor-ponter" onClick={vEdit.onUpdate}>{checkInfo}</span>
					</div>}
				</div>
			</label>
			<div className="p-2 cursor-pointer" onClick={vEdit.onUpdate}>
				<FA name="pencil-square-o text-info" />
			</div>
		</div>;
	}

	protected renderOrtherContent() {
		let { checkInfo } = this.controller;
		return <div className="px-3 py-2 d-flex align-items-center border-bottom" >
			<div className="text-muted mr-1 w-5c">验收意见</div>
			<div className="flex-fill mr-3 ">
				<input className="flex-fill form-control border-0"
					type="text" step="1" min="1"
					defaultValue={checkInfo}
					onChange={this.onDiscribeChange}
					onKeyDown={this.onDiscribeKeyDown} /></div>
		</div>
	}

	private onDiscribeChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
		let v = evt.target.value;
		if (v.length <= 0)
			v = undefined;
		this.controller.updateCheckInfo(v);
	}

	private onDiscribeKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
		if (evt.keyCode === 13) {
			this.controller.checkSaveInfo();
		}
	}

	protected renderViewBottom() {
		let left = <div>
			<button onClick={()=>this.onCheck(true)} className="btn btn-success mx-3">
				<FA name="check" /> 通过
			</button>
			<button onClick={() => this.onCheck(false)} className="btn btn-outline-secondary mx-3">
				<FA name="times" /> 不通过
			</button>
		</div>;
		return <>
			{this.renderOrtherContent()}
			<div className="py-2 bg-light border-top d-flex">
				{left}
				<div className="mr-auto" />
			</div>
		</>;
	}

	protected onCheck = async (pass: boolean) => {
		await this.controller.checkTask(pass);
		this.closePage();
		let content = pass ?
			<span className="text-success"><FA name="check" /> 验收通过</span>
			:
			<span className="text-secondary"><FA name="check" /> 验收不通过</span>
		this.showActionEndPage({ content });
		//this.openPage(this.resultPage, {pass})
	}

	protected resultPage = ({ pass }: { pass: boolean }) => {
		let { caption: title } = this.controller;
		let content = pass ?
			<span className="text-success"><FA name="check" /> 验收通过</span>
			:
			<span className="text-secondary"><FA name="check" /> 验收不通过</span>
		return <Page header={title} back="close">
			<div className="border bg-white rounded m-5">
				<div className="py-5 text-center">
					{content}
				</div>
				<div className="border-top text-center py-3">
					<button className="btn btn-outline-info" onClick={() => this.closePage()}>返回</button>
				</div>
			</div>
		</Page>;
	}
}

export class VTaskCheckDir extends VTaskCheck {
	render() {
		return this.renderDirView();
	}
}