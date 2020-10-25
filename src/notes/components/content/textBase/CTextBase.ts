import { CContent } from "../CContent";
import { observable } from "mobx";

export abstract class CTextBase extends CContent {
	@observable noteContent: string;
	@observable changedNoteContent: string;

	get isEmpty():boolean { return this.noteContent === undefined || this.noteContent.trim().length === 0; }

	init(obj: any): void {
		switch (typeof obj) {
			default: break;				// Add状态，没有初始值
			case 'undefined': break;
			case "string":  this.noteContent = (obj as string).trim(); break;
			case "object": this.noteContent = obj.content?.trim(); break;
		}
	}

	endInput(obj:any): void {
		if (this.changedNoteContent !== undefined) {
			this.noteContent = this.changedNoteContent;
			this.changedNoteContent = undefined;
		}
		this.buildObj(obj);
	}

	protected buildObj(obj:any) {
		obj.content = this.changedNoteContent || this.noteContent;
		delete obj.itemKey;
		delete obj.items;
	}
}
