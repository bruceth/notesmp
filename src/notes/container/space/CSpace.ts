import { CContainer } from "../CContainer";
import { VSpaceDir } from "./VSpaceDir";
import { renderIcon } from "../../noteBase";
import { compareID, EnumNoteType, NoteItem } from "../../../notes/model";
import { observable } from "mobx";
import { Contact } from "model";
import { VSpaceMembers } from "./VSpaceMembers";
import { VSpaceView } from "./VSpaceView";
import { VSpaceEdit } from "./VSpaceEdit";
import { VContentView } from "./VContentView";
import { VContacts } from "./VContacts";
import { VSapceAdd } from "./VSpaceAdd";

export class CSpace extends CContainer {
	groupId: number;
	groupOwner: number;
	@observable memberCount: number;
	@observable members:Contact[];
	@observable contacts:Contact[];

	get type():EnumNoteType { return EnumNoteType.groupFolder }
	async showFolder() {
		this.load();
		await this.loadSpace();		 
		this.openVPage(VSpaceView);
	}

	async loadSpace() {
		let resulte = await this.uqs.notes.GetGroupFolderMemberCount.query({folder: this.folderId});
		let {group, count, owner} = resulte.ret[0];
		this.groupId = group;
		this.groupOwner = owner;
		this.memberCount = count;
	}

	async loadMembers() {
		let result = await this.uqs.notes.GetGroupMembers.query({group: this.groupId});
		let ret:any[] = result.ret;
		let index = ret.findIndex(v => this.isMe(v.contact));
		if (index >= 0) ret.splice(index, 1);
		this.members = ret;
	}

	async loadContacts() {
		let result = await this.uqs.notes.GetGroupContacts.query({group: this.groupId});
		let ret:any[] = result.ret;
		let index = ret.findIndex(v => this.isMe(v.contact));
		if (index >= 0) ret.splice(index, 1);
		this.contacts = ret;
	}

	renderIcon(): JSX.Element {
		return renderIcon('users', 'text-warning');
	}
	renderDirItem():JSX.Element {
		let item = new VSpaceDir(this);
		return item.render();
	}

	showAddPage() {
		this.openVPage(VSapceAdd);
	}

	showEditPage() {
		this.openVPage(VSpaceEdit);
	}

	showMembers = async () => {
		await this.loadMembers();
		this.openVPage(VSpaceMembers);
	}

	showSpaceContent = async() => {
		await this.loadMembers();
		this.openVPage(VContentView);
	}

	showAddMember = async () => {
		await this.loadContacts();
		await this.loadMembers();
		this.openVPage(VContacts);
	}

	async selectMember(item:Contact, isSelected:boolean) {
		let i = this.contacts.findIndex(v=>compareID(v.contact, item.contact));
		if (i < 0)
			return;
		let c = this.contacts[i];
		if (isSelected) {
			await this.uqs.notes.AddGroupMember.submit({group:this.groupId, member:c.contact});
			c.already = 1;
		}
		else {
			await this.uqs.notes.RemoveGroupMember.submit({group:this.groupId, member:c.contact})
			c.already = 0;
		}
		let mi = this.members.findIndex(v=>compareID(v.contact, item.contact));
		if (mi >= 0) {
			let m = this.members[mi];
			m.already = c.already;
		}
		else if (isSelected) {
			this.members.push({...c});
		}
	}

	protected endContentInput():any {
		let obj = this.noteItem ? { ...this.noteItem.obj } : {};
		this.cContent.endInput(obj);
		return obj;
	}

	async addGroup() {
		let obj = this.endContentInput();
		let noteContent = JSON.stringify(obj);
		return await this.owner.rootFold.addGroup(this.caption, noteContent, []);
	}

	async SetGroup(showWaiting: boolean = true) {
		let obj = this.endContentInput();
		let noteContent = JSON.stringify(obj);
		await this.editGroup(showWaiting,
			this.noteItem,
			this.caption,
			noteContent,
			obj);
		this.updateChange();
	}

	async editGroup(waiting:boolean, noteItem:NoteItem, caption:string, content:string, obj:any) {
		let {SetGroup} = this.uqs.notes;
		let {note} = noteItem;
		await SetGroup.submit({group:this.groupId, caption, content}, waiting);
		if (note === this.noteItem?.note) {
			this.noteItem.caption = caption;
			this.noteItem.content = content;
			this.noteItem.obj = obj;
		}
	}

}
