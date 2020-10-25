import { CNoteBase } from "../noteBase";
import { NoteItem } from "../model";
import { CComments } from "./components";

export abstract class CNote extends CNoteBase {
	cComments: CComments;

	init(param: NoteItem):void {
		super.init(param);
		this.cComments = new CComments(this.res);
		this.cComments.init(this);
		if (param) {
			if (!this.caption) this.caption = param.caption;
		}
	}
	
	addComment = async (content: string) => {
		let ret = await this.uqs.notes.AddComment.submit({ note: this.noteModel.id, content });
		let commentId = ret.comment;
		// 加入note界面，显示comment
		if (commentId) {
			this.noteItem.commentCount++;
			this.noteModel.comments.unshift({
				id: commentId,
				content: content,
				owner: this.user.id,
				assigned: undefined,
				$create: new Date(),
				$update: new Date(),
			});
			this.activeRelativeTab = 'comment';
			this.updateChange();
		}
	}
}
