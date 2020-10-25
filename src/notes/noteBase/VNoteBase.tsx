import { VBasePage } from "../../notes/views/VBasePage";
import React from "react";
import { User, Image, UserView, Page, EasyTime, FA } from "../../tonva";
import { CNoteBase } from "./CNoteBase";

export function renderIcon(name:string, cn:string) {
	return <span className="fa-stack fa-lg">
		<i className={'fa fa-square-o fa-stack-2x ' + cn}></i>
		<i className={'fa fa-stack-1x fa-' + name + ' ' + cn}></i>
	</span>
	//return <FA name={name} size="lg" className={cn} fixWidth={true} />;
}

export abstract class VNoteBase<T extends CNoteBase> extends VBasePage<T> {
	// VPage 里面的页面主体
	content() {
		return this.renderBody();
	}

	// 页面主体
	protected renderBody():JSX.Element {
		return;
	}

	// 小单的主要部分，top, caption和content
	protected renderTopCaptionContent() {
		return <div className="bg-white">
			{this.renderTop()}
			<div className="py-2">
				{this.renderCaption()}
				{this.renderContent()}
			</div>
		</div>;
	}

	protected renderTop():JSX.Element {
		return <div className="d-flex px-3 py-2 align-items-center border-top border-bottom bg-light">
			{this.renderIcon()}
			{this.renderEditTime()}
			{this.renderFrom()}
		</div>;
	}
	protected renderIcon():JSX.Element {return;}
	
	protected renderFrom = () => {
		let {noteItem, disableFrom: disableOwnerFrom} = this.controller;
		if (!noteItem) return <div>noteItem undefined in renderFrom</div>;
		let {owner, assigned, from} = noteItem;
		let contact:number = from? from as number : owner as number;
		if (disableOwnerFrom === false && this.isMe(contact) === false) {
			let renderUser = (user:User) => {
				let {name, nick, icon} = user;
				let vImage:any, cnName:string = 'text-muted';
				if (icon) {
					cnName += ' small'
					vImage = <Image className="w-1c h-1c mr-1" src={icon} />;
				}
				return <>
					{vImage} <span className={cnName}>{assigned || nick || name}</span>
				</>
			}
			return <span className="mr-3"><UserView user={contact} render={renderUser} /></span>;
		}
	}

	protected renderEditTime() {
		let {$create, $update} = this.controller.noteItem;
		let create:Date = $create;
		let update:Date = $update;
		if (create && update) {
			let time:Date, action:any;
			if (update.getTime() - create.getTime() > 60*1000) {
				action = <FA className="mr-1 text-info" name="pencil" />;
				time = update;
			}
			else {
				time = create;
			}
			return <small className="text-muted">
				{action}
				<span><EasyTime date={time} /></span>
			</small>
		}
	}

	protected renderCaption() {
		let {caption: title} = this.controller;
		if (title) {
			return <div className="pr-3">
				<div><b>{title}</b></div>
			</div>;
		}
	}

	protected renderContent():JSX.Element {return;}

	protected renderToCount() {
		let {toCount} = this.controller.noteItem;
		if (toCount === undefined || toCount <= 0)
			return;
		return <span className="mr-5 text-muted">
			<FA className="mr-2" name="share"/><small className="">{toCount}</small> 
		</span>;
	}

	protected renderSpawnCount() {
		let {spawnCount} = this.controller.noteItem;
		if (spawnCount === undefined || spawnCount <= 0)
			return;
		return  <span className="mr-5 text-muted">
			<FA className="mr-2" name="hand-pointer-o"/><small className="">{spawnCount}</small>
		</span>;
	}

	protected renderCommentFlag = () => {
		let {commentCount, commentUnread} = this.controller.noteItem;
		if (commentCount === undefined || commentCount <= 0)
			return;
		let vCU:any;
		if (commentUnread > 0) {
			let cu:any = commentUnread>99? <>99<sup>+</sup></> : commentUnread;
			vCU = <div className="unread-num">{cu}</div>;
		};
		return  <span className="mr-5 text-muted position-relative">
			<FA className="mr-2" name="comment-o"/><small className="">{commentCount}</small>
			{vCU}
		</span>;
	}

	protected showActionEndPage({content, onClick}:{content:any; onClick?:()=>void}) {
		this.openPage(() => {
			onClick = onClick || (()=>this.closePage());
			let {caption: title} = this.controller;
			return <Page header={title} back="close">
				<div className="border bg-white rounded m-5">
					<div className="py-5 text-center">
						{content}
					</div>
					<div className="border-top text-center py-3">
						<button className="btn btn-outline-info" onClick={onClick}>返回</button>
					</div>
				</div>
			</Page>;
		});
	}

	protected renderShareButton() {
		return <span onClick={this.onSendNote} className="cursor-pointer text-primary mr-5">
			<FA name="share" />
		</span>;
	}

	protected onSendNote = async () => {
		await this.controller.cApp.loadRelation();
		this.controller.showShareTo();
	}

	protected renderEditButton() : JSX.Element {
		return <span onClick={()=>this.onEdit()} className="cursor-pointer text-primary">
			<FA name="pencil-square-o" />
		</span>;
	}
	
	protected renderStateSpan(content: string, isEnd: boolean = false) {
		if (isEnd === true) {
			return <span className="small text-danger"><FA className="small mr-1" name="stop" />{content}</span>;
		}
		return <span className="small text-success border border-success rounded px-2">{content}</span>;
	}

	protected onEdit() {this.controller.showEditPage()}
}
