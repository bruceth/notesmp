import { CFolder } from "../CFolder";

export class CFolderRoot extends CFolder {
	renderIcon(): JSX.Element {return;}
	showAddPage() {}
	showEditPage() {}

	async showFolder() {
		this.load();
		//this.openVPage(VFolder);
	}
}
