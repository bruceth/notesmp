import React from 'react';
import { FA } from '../../../tonva';
import { CContainer } from '../CContainer';
import { observer } from 'mobx-react';
import { VNoteBase } from '../../noteBase/VNoteBase';

export class VFolderDir extends VNoteBase<CContainer> {
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
				<FA name="folder" className="text-warning" size="lg" fixWidth={true} />
				{dot}
			</div>;

			return <div className="d-block bg-white">
				<div className="d-flex px-3 py-2 align-items-center">
					{vIcon}
					<b className="">{noteItem.caption}</b>
					{divToCount}
				</div>
			</div>
		}));
	}
}
