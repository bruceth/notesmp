import React from 'react';
import { List, FA, User, Image, UserView } from '../../../tonva';
import { CContainer } from '../CContainer';
import { CNoteBase, VNoteBase } from "../../noteBase";
import { observer } from 'mobx-react';
import { renderParagraphs } from '../../components';

export class VFolder<T extends CContainer> extends VNoteBase<T> {
	afterBack() {
		this.controller.owner.popFolder();
	}
	header() {
		return React.createElement(observer(() => {
				let {noteItem} = this.controller;
			if (noteItem) {
				return noteItem.caption;
			}
			return this.t('notes');
		}));
	}

	right() {
		// 应该任何群成员都可以发小单吧
		//if (this.isMe(this.controller.noteItem.owner)) {
			return this.controller.owner.renderFolderDropDown();
		//}
	}

	protected top() {
		let {noteItem} = this.controller;
		if (!noteItem) return;

		let paragraphs: string;
		let {content: contentString} = noteItem;
		let json = JSON.parse(contentString);
		if (json) {
			let {content} = json;
			paragraphs = (content as string)?.trimEnd();
		}
		else {
			paragraphs = "整理小单";
		}
		let left: any;
		if (this.isMe(this.controller.noteItem.owner)) {
			left = <>
				<FA className="mr-3 text-warning py-3" name={noteItem.toCount > 0 ? "folder-open":"folder"} size="3x" />
				<div className="small text-muted py-3">{this.renderParagraphs(paragraphs)}</div>
			</>;
		}
		else {
			let {owner, assigned} = noteItem;
			let renderUser = (user:User) => {
				let {name, nick, icon} = user;
				return <>
					<Image className="w-3c h-3c mr-2 my-3" src={icon || '.user-o'} />
					<div className="py-3">
						<div className="small">{assigned || nick || name}</div>
						<div className="small text-muted py-3">{this.renderParagraphs(paragraphs)}</div>
					</div>
				</>;
			}
			left = <UserView user={owner as number} render={renderUser} />;
		}
		return <div className="d-flex ml-3">
			{left}
			<div className="ml-auto align-self-stretch cursor-pointer px-3 d-flex align-items-center" 
				onClick={(e)=>{e.stopPropagation(); this.controller.showFolderView()}}>
				<FA name="ellipsis-h" />
			</div>
		</div>;
	}

	content() {
		let {notesPager, showNoteItem} = this.controller;
		return <div>
			{React.createElement(observer(() => this.top()))}
			<List className="" 
				items={notesPager} 
				item={{
					render: this.renderItemInFolder,
					key: this.noteKey, 
					onClick: showNoteItem,
					className:'notes'}} />
		</div>
	}

	protected renderParagraphs(content:string):JSX.Element {
		return renderParagraphs(content);
	}

	renderListView() {
		return this.content();
	}

	private noteKey = (item: CNoteBase) => {
		let note = item.noteItem.note;
		return note;
	}

	private renderItemInFolder = (cNoteBase: CNoteBase, index:number) => {
		return <div className="d-block mb-2 bg-white">{cNoteBase.renderDirItem(index)}</div>;
	}
}
