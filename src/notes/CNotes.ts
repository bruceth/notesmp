import { CUqBase } from "../tapp";
import { VSelectContact, SelectContactOptions } from "./views";
import { EnumNoteType, initNoteItemObj, NoteItem } from "./model";
import { CNoteBase } from "./noteBase";
import { CContainer, CFolderRoot, createCSpace, createCFolder, createCUnitNote } from "./container";
import { Contact } from "../model";
import { createCNoteTask } from "./note";
import { VFolderDropdown, VHomeDropdown, VSpaceDropdown } from "./views/VNotesDropDown";
import { CNoteText } from "./note/text";
import { CNoteAssign } from "./note/assign";
import { CFolderMy } from "./container/folderMy";
import { CShareTo } from "./CShareTo";
import { CSpace } from "./container/space";

export class CNotes extends CUqBase {
	protected foldStack: CContainer[];
	rootFold: CContainer;
	currentFold: CContainer;
	noteItem: NoteItem;

    protected async internalStart() {
	}

	init() {
		this.rootFold =this.currentFold = this.newSub(CFolderRoot);
		this.foldStack = [];
	}

	noteItemConverter = (item:NoteItem, queryResults:{[name:string]:any[]}):CNoteBase => {
		initNoteItemObj(item);
		let cNoteBase = this.createCNoteBase(item);
		cNoteBase.init(item);
		return cNoteBase;
	}

	itemChanged(noteItem: NoteItem) {
		let folderNoteItem = this.currentFold.itemChanged(noteItem);
		if (this.foldStack.length > 0) {
			for (let folder of this.foldStack) {
				folderNoteItem = folder.itemChanged(folderNoteItem)
			}
		}
	}

	openFolder(foldItem:CContainer) {
		this.foldStack.push(this.currentFold);
		this.currentFold = foldItem;
		this.currentFold.showFolder();
	}

	popFolder() {
		this.currentFold = this.foldStack.pop();
	}

	createCNoteBase(noteItem: NoteItem): CNoteBase {
		switch (noteItem.type) {
			default: throw Error("unknown type");
			case EnumNoteType.text: return this.createCNoteText();
			case EnumNoteType.textList: return this.createCNoteList(); 
			case EnumNoteType.textCheckable: return this.createCNoteCheckable(); 
			case EnumNoteType.folder: return createCFolder(this, noteItem);
			case EnumNoteType.task: return createCNoteTask(this, noteItem); 
			case EnumNoteType.group: debugger; throw Error("type group undefined");
			case EnumNoteType.groupFolder: return createCSpace(this); 
			case EnumNoteType.unit:  debugger; throw Error("type unit undefined");
			case EnumNoteType.assign: return new CNoteAssign(this);
			case EnumNoteType.unitNote: return createCUnitNote(this);
		}
	}

	private createCNoteText(): CNoteText {
		let ret = new CNoteText(this);
		ret.createTextContent();
		return ret;
	}

	private createCNoteList(): CNoteText {
		let ret = new CNoteText(this);
		ret.createListContent();
		return ret;
	}

	private createCNoteCheckable(): CNoteText {
		let ret = new CNoteText(this);
		ret.createCheckableContent();
		return ret;
	}

	async load() {
		await this.currentFold.load();
	}

	async refresh() {
		await this.currentFold.refresh();
	}
	/*
	async getNote(id: number): Promise<NoteModel> {
		return await this.currentFold.getNote(id);
	}
	*/

	async addNote(folder:number, caption:string, content:string, obj:any, type: EnumNoteType) {
		return await this.currentFold.addNote(folder, caption, content, obj, type);
	}

	async editNote(waiting:boolean, noteItem:NoteItem, caption:string, content:string, obj:any) {
		return await this.currentFold.editNote(waiting, noteItem, caption, content, obj);
	}

	async sendNoteTo(toList:number[]) {
		let {groupFolder, currentNoteItem} = this.currentFold;
		if (currentNoteItem === undefined) {
			currentNoteItem = this.currentFold.noteItem;
		}
		let {note} = currentNoteItem;
		let tos = toList.join('|');
		await this.uqs.notes.SendNoteTo.submit({groupFolder, note, tos});
	}

	async hideNote(note:number, x:number) {
		await this.currentFold.hideNote(note, x);
	}

	renderNotesView() {
		return this.currentFold.renderListView();
	}

	renderHomeDropDown() {
		let vHomeDropdown = new VHomeDropdown(this);
		return vHomeDropdown.render();
	};

	renderFolderDropDown() {
		let vHomeDropdown = new VFolderDropdown(this);
		return vHomeDropdown.render();
	};

	renderSpaceDropDown() {
		let vSpaceDropdown = new VSpaceDropdown(this);
		return vSpaceDropdown.render();
	};

	showAddNoteTextPage = () => {
		let cNoteText = this.createCNoteText();
		cNoteText.showAddPage();
	}

	showAddNoteListPage = () => {
		let cNoteText = this.createCNoteList();
		cNoteText.showAddPage();
	}
	
	showAddNoteCheckablePage = () => {
		let cNoteText = this.createCNoteCheckable();
		cNoteText.showAddPage();
	}

	showAddMyFolderPage = () => {
		let cFolder = new CFolderMy(this);
		cFolder.init(undefined);
		cFolder.showAddPage();
	}

	showAddGroupPage = () => {
		//let cGroup = this.newSub(CGroup);
		//cGroup.showAddPage()
		let cGroup = new CSpace(this);
		cGroup.init(undefined);
		cGroup.showAddPage();
	}

	showAddAssignPage = () => {
		let cNoteAssign = new CNoteAssign(this);
		cNoteAssign.init(undefined);
		cNoteAssign.showAddPage();
	}

	duplicateAssign = (param: NoteItem) => {
		let cNoteAssign = new CNoteAssign(this);
		cNoteAssign.init(param);
		cNoteAssign.showAddPage();
	}
	
	async showShareTo() {
		//this.noteItem = noteItem;
		/*
		let ret = await this.uqs.notes.GetMyContacts.page(
			{
				groupFolder: this.currentFold.groupFolder
			}, 0, 50, true);
		this.groupMembers = ret.$page;
		this.openVPage(VTo, backPageCount);
		*/
		//let {groupFolder} = this.currentFold;
		//let {note} = noteItem;
		/*
		let props: CToProps = {
			currentGroupFolder: groupFolder,
			onAfterContactsSelected: async () => {
				this.openVPage(VActions); //, {contacts, noteId: this.currentNoteId});
			},
			sendOut: async (toList: number[]) => {
				let tos = toList.join('|');
				await this.uqs.notes.SendNoteTo.submit({groupFolder, note, tos});
			},
		};
		let cTo = new CTo(this.cApp, props);
		await cTo.start();
		*/
		let cShareTo = new CShareTo(this.cApp, this);
		await cShareTo.start();
	}

	/*
	showSentPage() {
		this.openVPage(VSent);
	}
	*/

	async callSelectContact(options: SelectContactOptions): Promise<Contact[]> {
		return await this.vCall(VSelectContact, options);
	}

	/*
	showAssignTaskPage() {
		let cNoteTask = createCNoteTask(this, this.noteItem); // this.newSub(CNoteTask);
		cNoteTask.init(this.noteItem);
		cNoteTask.showAssignTaskPage();
	}
	*/
}
