import { CFolderDisableItemFrom } from "../CFolder";
import { renderIcon } from "../../noteBase";
import { VFolderShare } from "./VFolderShare";

export class CFolderShare extends CFolderDisableItemFrom {
	renderIcon(): JSX.Element {
		return renderIcon('folder', 'text-warning');
	}
	showAddPage() {}
	showEditPage() {}

	async showFolder() {
		this.load();
		this.openVPage(VFolderShare);
	}
}
