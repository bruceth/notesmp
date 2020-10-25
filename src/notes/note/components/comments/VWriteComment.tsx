import React from 'react';
import { View, Page, FA } from "../../../../tonva";
import { CComments } from "./CComments";

export class VWriteComment extends View<CComments> {
	render():JSX.Element {
		return <div
			className="flex-fill rounded-pill mr-3 border bg-white px-3 py-1 small cursor-pointer"
			onClick={this.onComment}>
			写评论...
		</div>;
	}

	renderButton():JSX.Element {
		return <span className="cursor-pointer text-primary mr-5" onClick={this.onComment}>
			<FA name="comment-o" />
		</span>;
	}

	protected onComment = () => {
		let right = <button className="btn btn-sm btn-success mr-1" onClick={this.onCommentSubmit}>提交</button>;
		this.openPageElement(<Page header="评论" right={right}>
			<textarea rows={10} 
				className="w-100 border-0 form-control"
				placeholder="请输入" maxLength={20000}
				onChange={this.onCommentChange} />
		</Page>);
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
