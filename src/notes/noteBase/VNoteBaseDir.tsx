import React from 'react';
import { observer } from 'mobx-react';
import { VNoteBase } from "./VNoteBase";
import { CNoteBase } from "./CNoteBase";

export class VNoteBaseDir<T extends CNoteBase> extends VNoteBase<T> {
	render() {
		return this.renderBody();
	}

	protected renderBody() {
		return React.createElement(observer(() => {
			return <div className="d-block bg-white">
				{this.renderTopCaptionContent()}
				{this.renderDirBottom()}
			</div>;
		}));
	}

	protected renderTopCaptionContent() {
		return <div className="bg-white">
			{this.renderTop()}
			<div className="py-2">
				{this.renderContent()}
			</div>
		</div>;
	}

	protected renderTop():JSX.Element {
		return <div className="d-flex pl-2 pr-3 py-2 border-top">
			{this.renderIcon()}
			<div>
				{this.renderCaption()}
				{this.renderFrom()}
			</div>
			<div className="ml-auto">{this.renderEditTime()}</div>
		</div>;
	}

	protected renderDirBottom():JSX.Element {
		let divToCount = this.renderToCount();
		let divSpawnCount = this.renderSpawnCount();
		let divComment = this.renderCommentFlag();
		if (divToCount || divSpawnCount || divComment) {
			return <div className="d-flex align-items-center px-3 mb-1">
				{divToCount}
				{divSpawnCount}
				{divComment}
				<div className="mr-auto" />
			</div>;
		}
	}

	protected renderIcon(): JSX.Element {
		let {unread} = this.controller.noteItem;
		let dot:any;
		if (unread>0) dot = <u/>;
		return <div className="mr-3 unread-dot">{this.controller.renderIcon()}{dot}</div>
	}
}

export class VNoteBaseDirView extends VNoteBaseDir<CNoteBase> {
}
