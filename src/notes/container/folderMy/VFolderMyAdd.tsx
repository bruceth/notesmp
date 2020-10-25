import { VFolderMyEdit } from "./VFolderMyEdit";

export class VFolderMyAdd extends VFolderMyEdit {
	header() {return '新建小单夹'}

	protected async onButtonSave(): Promise<void> {
		await this.controller.AddNote();
		this.closePage();
		return;
	}
}