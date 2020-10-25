import { VInput } from "./VInput";
import { VView } from "./VView";
import { CTextBase } from "../textBase";

export class CText extends CTextBase {
	renderInput():JSX.Element {return this.renderView<this>(VInput)}
	renderViewContent():JSX.Element {return this.renderView<this>(VView)}

	toString():string { return this.changedNoteContent || this.noteContent }
	fromString(v: string) {
		this.noteContent = v.trim();
	}
}

