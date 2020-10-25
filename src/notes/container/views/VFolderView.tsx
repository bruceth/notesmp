import React from 'react';
import { observer } from 'mobx-react';
import { VNoteBaseView } from '../../noteBase';
import { CContainer } from '../CContainer';
import { VFolderRelatives } from './VFolderRelatives';

export class VFolderView<T extends CContainer> extends VNoteBaseView<T> {
	protected get back(): 'close' | 'back' | 'none' {return 'close'}
	header() {
		return React.createElement(observer(() => {
			let {noteItem} = this.controller;
			if (noteItem) {
				return noteItem.caption;
			}
			return this.t('notes');
		}));
	}

	protected renderRelatives() {
		return this.renderVm(VFolderRelatives as any);
	}

	protected renderContent() {
		return this.controller.cContent.renderViewContent();
	}
}
