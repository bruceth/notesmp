import React from 'react';
import { VNoteBaseView } from '../../noteBase';
import { CNoteText } from './CNoteText';
import { VTextRelatives } from './VTextRelatives';
import { VTextHeader } from './VTextHeader';

export class VTextView extends VNoteBaseView<CNoteText> {
	header() {
		return this.renderVm(VTextHeader);
	}

	protected renderRelatives() {
		return this.renderVm(VTextRelatives);
	}

	footer() {
		return this.renderFooter();
	}

	protected renderFooter() {
		return <div className="py-2 pl-3 bg-light border-top d-flex align-items-center">
			{this.renderShareButton()}
			{this.controller.cComments.renderWriteComment()}
		</div>;
	}

	protected renderContent() {
		return this.controller.cContent.renderViewContent();
	}
}
