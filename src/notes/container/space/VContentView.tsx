import { observer } from 'mobx-react';
import { renderParagraphs } from '../../components';
import React from 'react';
import { FA, List } from '../../../tonva';
import { VNoteBase } from "../../noteBase";
import { CSpace } from "./CSpace";

export class VContentView extends VNoteBase<CSpace> {
	header() {return '详情'}
	right() {
		let vEditButton:any;
		if (this.isMe(this.controller.groupOwner)) {
			vEditButton = <span className="mr-2">{this.renderEditButton()}</span>;
		}
		return vEditButton;
	}

	content() {
		return React.createElement(observer(() => {
			let {noteItem} = this.controller;
			if (!noteItem) return;

			let paragraphs: string = '空间';
			let {caption, content: contentString} = noteItem;
			if (contentString) {
				let json = JSON.parse(contentString);
				if (json) {
					let {content} = json;
					paragraphs = (content as string)?.trimEnd();
				}
			}
			let left: any;
			left = <div className="">
				<div className="d-flex py-3 px-3">
					<FA className="mr-3 text-warning" name="users" size="2x" />
					<div>{caption}</div>
				</div>
				<div className="bg-white px-3 py-2">
					{renderParagraphs(paragraphs)}
				</div>
			</div>;
			let {memberCount} = this.controller;
			let members = this.controller.members.filter((value, index)=>value.already===1);
			return <div>
				{left}
				<div className="d-flex mt-2 align-items-end">
					<div className="ml-3 mb-2 small text-muted">{memberCount}成员</div>
					{ this.isMe(this.controller.groupOwner) ?
						<div className="ml-auto cursor-pointer text-success border border-success rounded bg-white px-1 mr-2 mb-1"
							onClick={this.controller.showAddMember}>
							<FA name="plus" />
						</div>
						:
						undefined
					}
				</div>
				<div>
					<div className="text-success px-3 py-2 bg-white border-bottom">[自己]</div>
					{members.length>0 && <List items={members} item={{render: this.renderContactItem}} />}
				</div>
			</div>;
		}));
	}
}
