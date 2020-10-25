//import React from 'react';
import { VTaskView } from '../VTaskView';
import { CTaskDone } from './CTaskDone';

export class VTaskDone extends VTaskView<CTaskDone> {
	protected renderState() {
		let { noteItem } = this.controller;
		let obj = noteItem.obj;
		if (obj) {
			let { checker } = obj;
			if (checker) {
				return this.renderStateSpan('待验收');
			}
			let { rater } = obj;
			if (rater) {
				return this.renderStateSpan('待评分');
			}
		}
		return this.renderStateSpan('已办', true);
	}
}

export class VTaskDoneDir extends VTaskDone {
	render() {
		return this.renderDirView();
	}
}