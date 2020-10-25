import React from 'react';
import { observer } from 'mobx-react';
import { VNoteBase } from "./VNoteBase";
import { CNoteBase } from "./CNoteBase";

export class VNoteBaseView<T extends CNoteBase> extends VNoteBase<T> {
	header() {return this.t('notes')}

	protected renderBody() {
		return React.createElement(observer(() => {
			return <div className="d-block">
				{this.renderTopCaptionContent()}
				{this.renderViewBottom()}
				{this.renderRelatives()}
			</div>;
		}));
	}

	protected renderTop():JSX.Element {
		let vEditButton:any;
		let isMe = this.isMe(this.controller.noteItem.owner);
		if (isMe === true) {
			vEditButton = <div className="ml-auto">{this.renderEditButton()}</div>;
		}
		return <div className="d-flex px-3 py-3 border-top border-bottom bg-light">
			{this.renderIcon()}
			<div>
				{this.renderCaption()}
				<div className="d-flex align-items-center mt-1">
					{this.renderFrom()}
					<span className="mr-3">{this.renderEditTime()}</span>
					{vEditButton}
				</div>
			</div>
		</div>;
	}

	// 小单的主要部分，top, caption和content
	protected renderTopCaptionContent() {
		return <div className="bg-white">
			{this.renderTop()}
			<div className="py-2">
				{this.renderContent()}
			</div>
		</div>;
	}

	protected renderViewBottom():JSX.Element {
		return <div className="h-1c"></div>;
	}

	protected renderRelatives():JSX.Element {
		return;
	}

	protected renderIcon(): JSX.Element {
		return <div className="mr-3">{this.controller.renderIcon()}</div>;
	}
}
