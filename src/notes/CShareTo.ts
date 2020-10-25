import { CTo } from "./components";
import { VActions } from "./views/VActions";
import { CNotes } from "./CNotes";
import { Query } from "tonva";

export class CShareTo extends CTo {
	private cNotes:CNotes;
	constructor(cApp:any, cNotes:CNotes) {
		let {currentFold} = cNotes;
		let {groupFolder, currentNoteItem} = currentFold;
		if (currentNoteItem === undefined) {
			currentNoteItem = currentFold.noteItem;
		}
		super(cApp, groupFolder, currentNoteItem);
		this.cNotes = cNotes;
	}
	
	protected get GetContacts(): Query {return this.uqs.notes.GetShareContacts}

	protected async sendOut(toList:number[]):Promise<void> {
		await this.cNotes.sendNoteTo(toList);
	}

	protected async afterContactsSelected(): Promise<void> {
		this.openVPage(VActions); //, {contacts, noteId: this.currentNoteId});
	}
}
