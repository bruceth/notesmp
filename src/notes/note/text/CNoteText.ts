import { computed, observable } from 'mobx';
import { EnumNoteType, NoteItem } from '../../model';
import { VTextView } from './VTextView';
import { VTextAdd } from './VTextAdd';
import { renderIcon } from '../../noteBase';
import { VTextDir } from './VTextDir';
import { VTextEdit } from './VTextEdit';
import { CContent, CText, CCheckable, CList } from '../../components';
import { CNote } from '../CNote';

export class CNoteText extends CNote {
	@observable header: string;
	@observable cType: EnumNoteType;
	@observable dropdowns: string[];
	@observable cContent: CContent;

	createTextContent(): void {
		this.header = this.t('noteText');
		this.cContent = new CText(this.res);
		this.cType = EnumNoteType.text;
		this.dropdowns = ['list', 'checkable'];
	}
	
	createListContent(): void {
		this.header = this.t('noteList');
		this.cContent = new CList(this.res);
		this.cType = EnumNoteType.textList;
		this.dropdowns = ['text', 'checkable'];
	}

	createCheckableContent(): void {
		this.header = this.t('noteCheckable');
		this.cContent = new CCheckable(this.res);
		this.cType = EnumNoteType.textCheckable;
		this.dropdowns = ['text', 'list'];
	}
	
	init(param: NoteItem): void {
		super.init(param);
		if (param) {
			if (this.cContent === undefined) {
				debugger;
				throw new Error('this.cContent should have created');
			}
			this.cContent.init(param.obj);
		}
	}

	@computed get isContentChanged():boolean { return this.cContent.changed }
	get type():EnumNoteType { return this.cType; }

	renderIcon(): JSX.Element {
		//return renderIcon(this.noteItem.toCount>0? 'files-o': 'file-o', 'text-info');
		return renderIcon('file-o', 'text-info');
	}

	protected endContentInput():any {
		let obj = this.noteItem ? { ...this.noteItem.obj } : {};
		this.cContent.endInput(obj);
		return obj;
	}

	renderDirItem(index: number): JSX.Element {
		return this.renderView(VTextDir);
	}

	showViewPage() {
		this.openVPage(VTextView);
	}

	showEditPage() {
		this.cContent.startInput();
		this.openVPage(VTextEdit);
	}

	showAddPage() {
		this.cContent.startInput();
		this.openVPage(VTextAdd);
	}

	changeToText = () => {
		if (this.cType === EnumNoteType.text)
			return;
		let content = this.cContent.toString();
		this.createTextContent();
		this.cContent.reset(content);
		if (this.noteItem) {
			this.noteItem.type = EnumNoteType.text;
		}
	}

	changeToList = () => {
		if (this.cType === EnumNoteType.textList)
			return;
		let content = this.cContent.toString();
		this.createListContent();
		this.cContent.reset(content);
		if (this.noteItem) {
			this.noteItem.type = EnumNoteType.textList;
		}
	}

	changeToCheckable = () => {
		if (this.cType === EnumNoteType.textCheckable)
			return;
		let content = this.cContent.toString();
		this.createCheckableContent();
		this.cContent.reset(content);
		if (this.noteItem) {
			this.noteItem.type = EnumNoteType.textCheckable;
		}
	}
}
