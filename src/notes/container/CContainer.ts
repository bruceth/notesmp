import { CNoteBase } from "../noteBase";
import { NoteItem, EnumNoteType } from '../model';
import { QueryPager } from "../../tonva";
import { EnumSpecFolder } from "../../tapp";
import { VFolder } from "./views/VFolder"
import { VFolderDir } from "./views/VFolderDir";
import { VFolderView } from "./views/VFolderView";
import { observable, computed } from "mobx";
import { CContent, CFolder } from "../../notes/components";

export abstract class CContainer extends CNoteBase {
	@observable cContent: CContent;
	folderId: number;
	notesPager: QueryPager<CNoteBase>;
	currentNoteItem: NoteItem;

	init(param: NoteItem):void {
		super.init(param);
		this.cContent = new CFolder(this.res)
		if (param) {
			this.caption = param.caption;
			this.cContent.init(param.obj);
		}

		let folderId = this.noteItem?.note;
		if (!folderId) this.folderId = -EnumSpecFolder.notes;
		else this.folderId = folderId;

		this.notesPager = new QueryPager<CNoteBase>(this.uqs.notes.GetNotes, undefined, undefined, true);
		this.notesPager.setItemConverter(this.getItemConverter());
	}

	@computed get isContentChanged():boolean {return this.cContent.changed}

	protected getItemConverter() {
		return this.owner.noteItemConverter;
	}

	async load() {
		await this.notesPager.first({folderId: this.folderId, withX: 0});
	}

	async refresh() {
		//每次刷新取5个。
		let newnotes = new QueryPager<NoteItem>(this.uqs.notes.GetNotes, 5, 5, false);
		await newnotes.first({folderId: this.folderId, withX: 1});
		let newitems = newnotes.items;
		if (newitems) {
			let len = newitems.length;
			let items = this.notesPager.items;
			for (let i = len - 1; i >= 0; --i) {
				let item = newitems[i];
				let {note, x} = item;
				let index = items.findIndex(v => v.noteItem.note===note);
				if (index >= 0) {
					items.splice(index, 1);
				}
				if (x === 0) {
					let cNoteItem = this.owner.noteItemConverter(item, undefined);
					items.unshift(cNoteItem);
				}
			}
		}
	}

	// private async getNote(id: number): Promise<NoteModel> {
	// 	let folderId = this.owner.currentFold?.folderId;
	// 	let ret = await this.uqs.notes.GetNote.query({folder: folderId, note: id});
	// 	let noteModel:NoteModel = ret.ret[0];
	// 	noteModel.to = ret.to;
	// 	noteModel.flow = ret.flow;
	// 	noteModel.spawn = ret.spawn;
	// 	noteModel.contain = ret.contain;
	// 	noteModel.comments = ret.comments;
	// 	for (var sItem of noteModel.spawn) {
	// 		initNoteItemObj(sItem);
	// 	}
	// 	return noteModel;
	// }

	showNoteItem = async (item: CNoteBase) => {
		let noteItem = this.currentNoteItem = item.noteItem;
		//let noteModel = await this.getNote(noteItem.note);
		noteItem.unread = 0;
		noteItem.commentUnread = 0;
		//item.noteModel = noteModel;
		await item.lodeModel();
		return item.showViewPage();
	}

	itemChanged(noteItem: NoteItem):NoteItem {
		let {items} = this.notesPager;
		let index = items.findIndex(v => v.noteItem === noteItem);
		if (index > 0) {
			let fItem = items.splice(index, 1);
			items.unshift(...fItem);
		}
		//return index >= 0;
		return this.noteItem;
	}

	abstract async showFolder(): Promise<void>;
	/* {
		this.load();
		this.openVPage(VFolder);
	}*/

	renderListView() {
		return (new VFolder(this)).renderListView();
	}

	showViewPage(): void {
		this.owner.openFolder(this);
	}

	async showFolderView() {
		let noteItem = this.noteItem;
		if (!noteItem)
			return;
		//let noteModel = await this.getNote(noteItem.note);
		noteItem.unread = 0;
		noteItem.commentUnread = 0;
		//this.noteModel = noteModel;
		await this.lodeModel();
		this.showFolderViewPage();
	}

	showFolderViewPage() {
		this.openVPage(VFolderView as any);
	}

	async addNote(folder:number, caption:string, content:string, obj:any, type:EnumNoteType) {
		let sub = 0;
		let param = {
			groupFolder:this.groupFolder,
			folder:folder,
			caption,
			content,
			type,
			sub}
		let ret = await this.uqs.notes.AddNote.submit(param);
		let {note} = ret;
		let date = new Date();
		let noteItem:NoteItem = {
			seconds: undefined,
			owner: this.user.id,
			note: note as number,
			type,
			caption,
			content,
			x: 0,
			assigned: undefined,
			from: undefined,
			fromAssigned: undefined,
			state: undefined,
			unread: 0,
			obj,
			$create: date,
			$update: date,
		}
		if (type === EnumNoteType.folder) {
			noteItem.groupFolder = this.groupFolder;
		}
		let cNoteItem = this.owner.createCNoteBase(noteItem);
		cNoteItem.init(noteItem);
		if (folder === this.folderId) {
			this.notesPager.items.unshift(cNoteItem);
		}
		return cNoteItem;
	}

	async editNote(waiting:boolean, noteItem:NoteItem, caption:string, content:string, obj:any) {
		let {SetNote} = this.uqs.notes;
		let {note, type} = noteItem;
		await SetNote.submit({note, caption, content, type}, waiting);
		// Note.resetCache(note); 现在不调用NoteTuid的cache，所以不需要了
		// noteItem.unread = 1; 自己修改自己的小单，只是移到最前面，并不显示unread
		if (note === this.noteItem?.note) {
			this.noteItem.caption = caption;
			this.noteItem.content = content;
			this.noteItem.obj = obj;
		}
		else {
			let {items} = this.notesPager;
			let index = items.findIndex(v => v.noteItem.note===note);
			if (index >= 0) {
				let theItems = items.splice(index, 1);
				let theItem = theItems[0];
				theItem.noteItem.caption = caption;
				theItem.noteItem.content = content;
				theItem.noteItem.obj = obj;
				items.unshift(theItem);
			}
		}
	}

	async hideNote(note:number, x:number) {
		await this.uqs.notes.HideNote.submit({note, x});
		let index = this.notesPager.items.findIndex(v => v.noteItem.note === note);
		if (index >= 0) this.notesPager.items.splice(index, 1);
	}

	renderDirItem(index: number): JSX.Element {
		let vNoteItem = new VFolderDir(this);
		return vNoteItem.render();
	}

	async addGroup(caption:string, content:string, members:{member:number}[]) {
		let ret = await this.uqs.notes.AddGroup.submit({caption, content, members});
		let {group, folder} = ret;
		let date = new Date();
		let type = EnumNoteType.groupFolder;
		let noteItem:NoteItem = {
			seconds: undefined,
			owner: this.user.id,
			note: folder as number,
			type,
			caption,
			content,
			x: 0,
			assigned: undefined,
			from: undefined,
			fromAssigned: undefined,
			state: undefined,
			groupFolder:group,
			unread: 0,
			obj: undefined,
			$create: date,
			$update: date,
		}
		let cNoteItem = this.owner.createCNoteBase(noteItem);
		cNoteItem.init(noteItem);
		this.notesPager.items.unshift(cNoteItem);
		return cNoteItem;
	}

	taskUpdateState(noteItem:NoteItem) {
		let {items} = this.notesPager;
		let {note} = noteItem;
		let index = items.findIndex(v => v.noteItem.note===note);
		if (index >= 0) {
			items.splice(index, 1);
			let c = this.getItemConverter();
			let newItem = c(noteItem, undefined);
			items.unshift(newItem);
		}
	}
}
