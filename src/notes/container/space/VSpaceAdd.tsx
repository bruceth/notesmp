import { VSpaceEdit } from "./VSpaceEdit";

export class VSapceAdd extends VSpaceEdit {
	header() {return '新建群'}

	protected async onButtonSave(): Promise<void> {
		await this.controller.addGroup();
		this.closePage();
		return;
	}
}