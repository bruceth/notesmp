import React from 'react';
import { VBasePage } from './VBasePage';
import { CShareTo } from 'notes/CShareTo';

export class VActions extends VBasePage<CShareTo> {
	header() {return '操作'}
	content() {
		let cn = 'px-3 py-2 cursor-pointer bg-white mt-1';
		return <div className="">
			<div className="text-muted small px-3 py-1 mt-2">收件人</div>
			<div className="border rounded p-3 mb-3">
				{this.renderSelectedContact(this.controller.contacts)}
			</div>
			<div className={cn} onClick={this.controller.onSendOut}>
				分享内容
			</div>
		</div>;
	}
}
