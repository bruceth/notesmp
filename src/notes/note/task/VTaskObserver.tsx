import React from 'react';
import { VTaskView } from './VTaskView';
import { CTaskObserver } from './CTaskObserver';

export class VTaskObserver extends VTaskView<CTaskObserver> {
	protected renderState() {
		let state = this.controller.taskStateResult;
		return this.renderStateSpan(state.content, state.isEnd);
	}

	protected renderTaskAdditions() {
		let rows = [
			//{label: '分值', values: this.renderPoint()}, 
			{label: '分派工时', values: this.renderAssignHours()}, 
			{label: '实际工时', values: this.renderHours()}, 
		];
		let {checker, rater} = this.controller.noteItem.obj;
		return <div>
			{rows.map(v => this.renderParam(v))}
			{ checker ? this.renderChecker() : undefined }
			{ rater ? this.renderRater() : undefined }
		</div>;
	}

	private renderChecker() {
		return <div>检查人</div>;
	}

	private renderRater() {
		return <div>评分人</div>;
	}

}

export class VTaskObserverDir extends VTaskObserver {
	render() {
		return this.renderDirView();
	}
}