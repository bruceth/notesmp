import { observable } from "mobx";
import { Contact } from "model";
import { SelectContactOptions, VSelectContact } from "./VSelectContact";
import { CUqBase } from "../../../tapp";

export abstract class CSelectContact extends CUqBase {
	@observable contacts: Contact[];

	//protected abstract get GetContacts(): Query; // this.uqs.notes.GetMyContacts
	protected abstract loadContacts(): Promise<void>;

	protected async internalStart():Promise<void> {
		await this.loadContacts();
		/*
		let ret = await this.GetContacts.page(
			{
				groupFolder: this.currentGroupFolder,
				note: this.currentNoteItem.note,
			}, 0, 50, true);
		this.groupContacts = ret.$page;
		this.startAction();
		*/
		this.openVPage(VSelectContact);
	}

	SetContacts(contacts:Contact[]) {
		this.contacts = [];
		for (var ci of contacts) {
			let n = {...ci};
			this.contacts.push(n);
		}
	}

	async callSelectContact(options: SelectContactOptions): Promise<Contact[]> {
		return await this.vCall(VSelectContact, options);
	}
}
