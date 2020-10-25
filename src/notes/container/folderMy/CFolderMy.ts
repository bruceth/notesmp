import { CFolderDisableItemFrom } from "../CFolder";
import { renderIcon } from "../../noteBase";
import { VFolderMyEdit } from "./VFolderMyEdit";
import { VFolderMyAdd } from "./VFolderMyAdd";
import { VFolderMyView } from "./VFolderMyView";
import { VFolderMy } from "./VFolderMy";

// 小单夹
export class CFolderMy extends CFolderDisableItemFrom {
	renderIcon(): JSX.Element {
		return renderIcon(this.noteItem.toCount>0? 'files-o': 'file-o', 'text-info');
	}
	showAddPage() {
		this.openVPage(VFolderMyAdd);
	}
	showEditPage() {
		this.openVPage(VFolderMyEdit);
	}

	showFolderViewPage() {
		this.openVPage(VFolderMyView);
	}

	async showFolder() {
		this.load();
		this.openVPage(VFolderMy);
	}

	protected endContentInput():any {
		let obj = this.noteItem ? { ...this.noteItem.obj } : {};
		this.cContent.endInput(obj);
		return obj;
	}
}
