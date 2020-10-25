import React from 'react';
import { View, Page, UserView, EasyTime, User } from "../../../../tonva";
import { CComments } from "./CComments";
import { CommentItem } from '../../../../notes/model';

export class VCommentsList extends View<CComments> {
	render() {
		return this.renderComments();
	}
	
	protected renderComments = () => {
		let {comments} = this.controller.cNote.noteModel;
		let {length} = comments;
		if (length === 0) return;
		return <div className="py-3">
			{comments.map(v => this.renderComment(v))}
			{
				length >= 10 && <div className="px-3 pt-3 cursor-pointer text-primary text-right small"
				onClick={this.showMoreComments}>更多评论...</div>
			}
		</div>;
	}

	private showMoreComments = () => {
		this.openPageElement(<Page header="评论">
			<div className="text-muted p-3">更多评论正在开发中 ...</div>
		</Page>);
	}

	protected renderComment(comment:CommentItem) {
		let {id, owner, assigned, content, $update} = comment;
		let renderUser = (user:User) => {
			let {id, name, nick} = user;
			let isMe = this.isMe(id);
			let userName:string, cn:string;
			if (isMe === true) {
				cn = 'text-success';
				userName = '[我]';
			}
			else {
				cn = 'text-primary-dark';
				userName = assigned || nick || name;
			}
			let divUserName = <span className={cn + ' mr-2'}>{userName}:</span>;
			// <Image className="w-1-5c h-1-5c mx-3" src={icon || '.user-o'} />
			// <div className="small mb-3">{divUserName}</div>
			return <div className="mt-1 d-flex bg-white pt-2">
				<div className="mx-3">
					<div className="small text-muted"><EasyTime date={$update} /></div>
					<div className="">{this.renderCommentContent(divUserName, content)}</div>
				</div>
			</div>
		}
		return <UserView key={id} user={owner} render={renderUser} />;
	}
	
	protected renderCommentContent(vUser:any, content:string):JSX.Element {
		if (!content) return;
		return <>{content.trimRight().split('\n').map((v, index) => {
			let c:any;
			if (!v) {
				c = '\u00A0'; //<>&nbsp;</>;
			}
			else {
				c = '';
				let len = v.length, i=0;
				for (; i<len; i++) {
					switch(v.charCodeAt(i)) {
						case 0x20: c +='\u2000'; continue;
					}
					break;
				}
				c += v.substr(i);
			}
			if (index === 0) c = <>{vUser}{c}</>;
			return <div key={index} className="pb-1">{c}</div>;
		})}</>;
	}
}
