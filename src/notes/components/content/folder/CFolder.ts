import { VInput } from "./VInput";
import { VView } from "./VView";
import { CTextBase } from "../textBase";

export class CFolder extends CTextBase {
	renderInput():JSX.Element {return this.renderView(VInput)}
	renderViewContent():JSX.Element {
		return this.renderView(VView)
	}
}

