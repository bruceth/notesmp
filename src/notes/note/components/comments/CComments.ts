import { Controller } from "../../../../tonva";
import { VCommentsList } from "./VCommentsList";
import { VAddComment } from "./VAddComment";
import { CNote } from "../../../../notes/note/CNote";
import { VWriteComment } from "./VWriteComment";

export class CComments extends Controller {
	cNote: CNote;

	protected async internalStart() {}

	init(cNote: CNote) {
		this.cNote = cNote;
	}

	renderCommentsList():JSX.Element { return this.renderView(VCommentsList); }
	
	showAddCommentPage() {
		this.openVPage(VAddComment);
	}

	async onAddComment(comment:string) {
		await this.cNote.addComment(comment);
	}

	renderWriteComment():JSX.Element {
		return this.renderView(VWriteComment);
	}

	renderCommentButton():JSX.Element {
		let vWriteComment = new VWriteComment(this);
		return vWriteComment.renderButton();
	}
}
