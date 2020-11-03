import { CUqBase } from "../tapp";
import { VDiscover } from "./VDiscover";
import { CBook } from "../book";

export class CDiscover extends CUqBase {
	cBook: CBook;

    protected async internalStart() {
	}

	init() {
		this.cBook = this.newC(CBook);
		return;
	}

	loadBookProjects = async () => {
		await this.cBook.loadBookProjects();
	}

	tab = () => this.renderView(VDiscover);

	async testBus() {
		await this.uqs.notes.TestBusBootProject.submit({});
		alert('test bus');
	}
}
