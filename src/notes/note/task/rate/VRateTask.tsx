import React from 'react';
import { FA } from '../../../../tonva';
import { VTaskView } from '../VTaskView';
import { CTaskRate } from './CTaskRate';
import { TaskCheckItem } from '../model';

export class VTaskRate extends VTaskView<CTaskRate> {
	protected rateValue: number = 0;

	protected renderState(): JSX.Element {
		return this.renderStateSpan('待评价');
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
		return <label key={key} className="flex-grow-1 d-flex mx-3 my-0 align-items-center form-check">
			<input className="form-check-input mr-3 mt-0" type="checkbox"
				defaultChecked={checked}
				data-key={key}
				disabled={!this.controller.allowCheck} />
			<div className="flex-grow-1">
				<div className={cn}>{content}</div>
				{checkInfo && <div className="mt-1 ml-3 small">
					<FA name="comment-o" className="mr-2 text-primary" />
					<span className="text-info cursor-ponter" >{checkInfo}</span>
				</div>}
			</div>
		</label>;
	}

	protected renderOrtherContent() {
		let { rateInfo, checkInfo } = this.controller;
		return <div>
			{
				checkInfo && <div className="px-3 py-2 d-flex align-items-center border-bottom" >
					<div className="text-muted mr-1 w-5c">验收意见</div>
					<div className="flex-fill mr-3 ">
					<input className="flex-fill form-control border-0"
						type="text" step="1" min="1"
						defaultValue={checkInfo}
						disabled={true}
						 /></div>
				</div>
			}
			<div className="px-3 py-2 d-flex align-items-center border-bottom" >
				<div className="text-muted mr-1 w-5c">评分意见</div>
				<div className="flex-fill mr-3 ">
					<input className="flex-fill form-control border-0"
						type="text" step="1" min="1"
						defaultValue={rateInfo}
						onChange={this.onDiscribeChange}
						onKeyDown={this.onDiscribeKeyDown} /></div>
			</div>
		</div>;
	}

	private onDiscribeChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
		let v = evt.target.value;
		if (v.length <= 0)
			v = undefined;
		this.controller.updateRateInfo(v);
	}

	private onDiscribeKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
		if (evt.keyCode === 13) {
			this.controller.checkSaveInfo();
		}
	}

	protected renderViewBottom() {
		let left = <div>
			<button onClick={() => this.onRate()} className="btn btn-success mx-3">
				评价
			</button>
		</div>;

		return <div>
			{this.renderOrtherContent()}
			{this.renderValueRadio()}
			<div className="py-2 bg-light border-top d-flex">
				{left}
				<div className="mr-auto" />
			</div>
		</div>
	}

	private onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
		this.rateValue = Number(evt.target.value);
	};

	protected renderValueRadio(): JSX.Element {
		let radios = [
			{ val: 2, text: '卓越' },
			{ val: 1, text: '谢谢' },
		];

		return <div className="my-3">
			{radios.map((v, index) => {
				let { val, text } = v;
				return <label key={index} className="mb-0 mx-3">
					<input className="mr-1" type="radio" value={val}
						defaultChecked={this.rateValue === val} name={'ratevalue'} onChange={this.onChange} />
					{text}
				</label>
			})}
		</div>;
	}

	private onRate = async () => {
		await this.controller.rateTask(this.rateValue);
		this.closePage();
		let content = <>评价完成</>;
		this.showActionEndPage({ content });
	}
}

export class VTaskRateDir extends VTaskRate {
	render() {
		return this.renderDirView();
	}
}