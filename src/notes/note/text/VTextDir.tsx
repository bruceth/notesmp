import { CNoteText } from "./CNoteText";
import { VNoteBaseDir } from "../../noteBase";

export class VTextDir extends VNoteBaseDir<CNoteText> {
	protected renderContent():JSX.Element {
		return this.controller.cContent.renderDirContent();
	}
}
