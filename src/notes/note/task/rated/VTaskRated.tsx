//import React from 'react';
import { VTaskView } from '../VTaskView';
import { CTaskRated } from './CTaskRated';

export class VTaskRated extends VTaskView<CTaskRated> {
	protected renderState() {
		return this.renderStateSpan('已评价', true);
	}
}

export class VTaskRatedDir extends VTaskRated {
	render() {
		return this.renderDirView();
	}
}