import { CUqBase } from "../tapp";
import { CNotes } from "../notes";
import { VHome } from "./VHome";

export class CHome extends CUqBase {
	cNotes: CNotes;

  	protected async internalStart() {
	}

	async refresh() {
		await this.cNotes.refresh();
	}

	init() {
		this.cNotes = this.newC(CNotes);
	}

	tab = () => this.renderView(VHome);

	async load() {
		await this.cNotes.load();
	}
}
