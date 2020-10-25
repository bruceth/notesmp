import React from 'react';
import { observer } from 'mobx-react';
import { FA } from '../../../tonva';
import { CContainer } from '../CContainer';
import { VNoteBase } from '../../noteBase';

export class VUnitNoteDir extends VNoteBase<CContainer> {
	render() {
		return React.createElement(observer(() => {
			let {noteItem} = this.controller;
			let {toCount, unread} = noteItem;
			let divToCount:any;
			if (toCount > 0) {
				divToCount = <small className="ml-4 text-muted">
					<FA name="share" className="mr-1" />
					{toCount}
				</small>;
			}

			let dot:any;
			if (unread>0) {
				dot = <u/>;
			}
	
			let vIcon = <div className="unread-dot mr-3">
				{this.controller.renderIcon()}
				{dot}
			</div>;

			return <div className="d-block bg-white">
				<div className="d-flex pl-2 pr-3 py-2 align-items-center">
					{vIcon}
					<b className="text-primary">{noteItem.caption}</b>
					{divToCount}
				</div>
			</div>
		}));
	}
}
