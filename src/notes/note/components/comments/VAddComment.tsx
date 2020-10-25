import React from 'react';
import { VPage } from "../../../../tonva";
import { CComments } from "./CComments";

export class VAddComment extends VPage<CComments> {
	header() {return "评论"}
	
	content() {
		return <textarea rows={10} 
			className="w-100 border-0 form-control"
			placeholder="请输入" maxLength={20000}
			onChange={this.onCommentChange} />
	}

	right() {
		return <button className="btn btn-sm btn-success mr-1" onClick={this.onCommentSubmit}>提交</button>;
	}

	private comment:string;
	private onCommentChange = (evt:React.ChangeEvent<HTMLTextAreaElement>) => {
		this.comment = evt.target.value;
	}

	private onCommentSubmit = async () => {
		await this.controller.onAddComment(this.comment);
		//this.controller.relativeKey = 'comment';
		this.closePage();
	}
}
