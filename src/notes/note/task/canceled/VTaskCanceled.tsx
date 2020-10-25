//import React from 'react';
import { VTaskView } from '../VTaskView';
import { CTaskCanceled } from './CTaskCanceled';

export class VTaskCanceled extends VTaskView<CTaskCanceled> {
	protected renderState() {
		return this.renderStateSpan('已取消', true);
	}
}

export class VTaskCanceledDir extends VTaskCanceled {
	render() {
		return this.renderDirView();
	}
}