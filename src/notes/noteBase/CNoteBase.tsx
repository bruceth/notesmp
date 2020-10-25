import { observable, computed } from "mobx";
import { CUqSub } from '../../tapp';
import { NoteItem, NoteModel, EnumNoteType, initNoteItemObj } from '../model';
import { CNotes } from '../CNotes';

export abstract class CNoteBase extends CUqSub<CNotes> {
	disableFrom: boolean = false;
	@observable noteModel: NoteModel;
	@observable noteItem: NoteItem;

	@observable activeRelativeTab: string;
	get isContentChanged():boolean {return false;}; // {return this.cContent.changed}

	get groupFolder(): number {
		if (!this.noteItem)
			return undefined;
		let ret = this.noteItem.groupFolder;
		if (!ret && this.noteItem.type === EnumNoteType.groupFolder) {
			ret = this.noteItem.note;
		}
		return ret;
	}

	init(param: NoteItem): void {
		this.noteItem = param;
	}

	async lodeModel() {
		let folderId = this.owner.currentFold?.folderId;
		let ret = await this.uqs.notes.GetNote.query({folder: folderId, note: this.noteItem.note});
		let noteModel:NoteModel = ret.ret[0];
		noteModel.to = ret.to;
		noteModel.flow = ret.flow;
		noteModel.spawn = ret.spawn;
		noteModel.contain = ret.contain;
		noteModel.comments = ret.comments;
		for (var sItem of noteModel.spawn) {
			initNoteItemObj(sItem);
		}
		this.noteModel = noteModel;
	}

	abstract get type():EnumNoteType;

	protected async internalStart() { }

	@observable caption: string;
	get isCaptionChanged() {return this.caption !== this.noteItem?.caption;}
	@computed get isNoteChanged(): boolean {
		return this.isContentChanged || this.isCaptionChanged;
	}

	abstract renderIcon(): JSX.Element;
	abstract renderDirItem(index: number): JSX.Element;
	abstract showViewPage():void;
	abstract showEditPage():void;
	abstract showAddPage():void;

	protected endContentInput():any {
		let obj = this.noteItem ? { ...this.noteItem.obj } : {};
		return obj;
	}

	async showShareTo() {
		await this.owner.showShareTo();
	}

	async SetNote(showWaiting: boolean = true) {
		let obj = this.endContentInput();
		let noteContent = JSON.stringify(obj);
		await this.owner.editNote(showWaiting,
			this.noteItem,
			this.caption,
			noteContent,
			obj);
		this.updateChange();
	}

	protected updateChange() {
		if (!this.noteItem) {
			debugger;
			throw new Error('this.noteItem can not be undefined');
		}
		this.noteItem.$update = new Date();
		if (this.caption && this.caption !== this.noteItem.caption) {
			this.noteItem.caption = this.caption;
		}
		this.owner.itemChanged(this.noteItem);
	}

	// return the folder noteItem
	itemChanged(noteItem: NoteItem):NoteItem {
		//if (this.noteItem) {
		this.noteItem.$update = noteItem.$update;
		return this.noteItem;
		//}
	}

	async AddNote() {
		let obj = this.endContentInput();
		let noteContent = JSON.stringify(obj);
		let {folderId} = this.owner.currentFold;
		let ret = await this.owner.addNote(folderId, this.caption, noteContent, obj, this.type);
		if (this.noteItem) {
			this.updateChange();
		}
		return ret;
	}
}
