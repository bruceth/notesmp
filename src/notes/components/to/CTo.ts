import { observable } from "mobx";
import { CUqBase } from "../../../tapp";
import { Contact } from "../../../model";
import { VSent } from "./VSent";
import { VTo } from "./VTo";
import { Query } from "tonva";
import { NoteItem } from "notes/model";

export abstract class CTo extends CUqBase {
	protected currentGroupFolder: number;
	currentNoteItem: NoteItem;
	@observable groupContacts: Contact[];
	@observable contacts: Contact[];

	constructor(cApp:any, currentGroupFolder: number, currentNoteItem: NoteItem) {
		super(cApp);
		this.currentGroupFolder = currentGroupFolder;
		this.currentNoteItem = currentNoteItem;
	}

	protected abstract get GetContacts(): Query; // this.uqs.notes.GetMyContacts
	protected abstract sendOut(toList:number[]):Promise<void>;
	protected abstract afterContactsSelected(): Promise<void>;

	protected async internalStart():Promise<void> {
		let ret = await this.GetContacts.page(
			{
				groupFolder: this.currentGroupFolder,
				note: this.currentNoteItem.note,
			}, 0, 50, true);
		this.groupContacts = ret.$page;
		this.startAction();
		this.openVPage(VTo);
	}

	onSendOut = async (): Promise<void> => {
		//let {contacts, noteItem, currentFold: currentFoldItem} = this.controller;
		let toList = this.contacts.map (v => {
			let {contact} = v;
			if (!contact) return undefined;
			if (typeof contact === 'object') return (contact as any).id;
			return contact;
		});
		//await this.controller.sendNoteTo(currentFoldItem.folderId, noteItem.note, toList);
		await this.sendOut(toList);
		this.popToTopPage();
		this.openVPage(VSent);
	}

	async onContactsSelected(contacts: Contact[]) {
		this.contacts = contacts;
		await this.afterContactsSelected();
	}
}
