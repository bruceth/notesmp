import { CContainer } from "./CContainer";
import { NoteItem, EnumNoteType } from "../model";
import { CNoteBase } from "../noteBase";

export abstract class CFolder extends CContainer {
	get type():EnumNoteType { return EnumNoteType.folder }
}

export abstract class CFolderDisableItemFrom extends CFolder {
	protected getItemConverter() {
		return (item:NoteItem, queryResults:{[name:string]:any[]}):CNoteBase => {
			let ret = this.owner.noteItemConverter(item, queryResults);
			ret.disableFrom = true;
			return ret;
		}
	}
}
