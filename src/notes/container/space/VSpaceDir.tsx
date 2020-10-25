import React from 'react';
import { FA } from '../../../tonva';
import { CSpace } from './CSpace';
import { observer } from 'mobx-react';
import { VNoteBase, renderIcon } from '../../../notes/noteBase';

export class VSpaceDir extends VNoteBase<CSpace> {
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
			return <div className="d-block bg-white">
				<div className="d-flex pl-2 pr-3 py-2 align-items-center">
					<div className="unread-dot mr-3">
						{renderIcon('users', 'text-warning')}
						{unread>0 && <u />}
					</div>
					<b className="text-primary">{noteItem.caption}</b>
					{divToCount}
				</div>
			</div>
		}));
	}
	// <FA name="users" className="text-warning" size="lg" fixWidth={true} />
}
