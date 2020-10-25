//import React from 'react';
import { VTaskView } from '../VTaskView';
import { CTaskPass } from './CTaskPass';

export class VTaskPass extends VTaskView<CTaskPass> {
	protected renderState() {
		let { noteItem } = this.controller;
		let obj = noteItem.obj;
		if (obj) {
			let { rater } = obj;
			if (rater) {
				return this.renderStateSpan('待评价');
			}
		}
		return this.renderStateSpan('签收', true);
	}
}

export class VTaskPassDir extends VTaskPass {
	render() {
		return this.renderDirView();
	}
}