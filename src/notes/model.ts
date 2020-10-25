import { BoxId } from "tonva";
import { EnumTaskState } from "./note/task/TaskState";

export enum EnumNoteType {
	text=0, task=1, comment=2, folder=3, group=4, groupFolder=5, unit=6, assign=7,
	textList=8, textCheckable=9, unitNote=10,
}

export interface NoteItem {
	seconds: number;
	owner: number | BoxId;
	note: number;
	type: EnumNoteType;
	caption: string;
	content: string;
	x: number;
	assigned: string;
	from: number | BoxId;
	fromAssigned: string;
	state: EnumTaskState;
	flowContent?: string;
	groupFolder?:number;
	unread: number;
	obj: any;
	toCount?: number;
	spawnCount?: number;
	commentCount?: number;
	commentUnread?: number;
	$create: Date;
	$update: Date;
}

export interface NoteFlow {	
}

export interface Access {
	user: number;
	access: number;
	assigned: string;
}

export interface CommentItem {
	id: number;
	content: string;
	owner: number;
	assigned: string;
	$create: Date;
	$update: Date;
}

export interface NoteModel {
	id: number;
	caption: string;
	content: string;
	type: EnumNoteType,
	flowContent?: string;
	$create: Date;
	$update: Date;
	to: Access[];
	flow: NoteFlow[];
	spawn: NoteItem[];
	contain: NoteItem[];
	comments: CommentItem[];
}

export function replaceAll(str:string, findStr:string, repStr:string):string {
	if (!str) return str;
	return str.split(findStr).join(repStr);
}

export function numberFromId(id:number|BoxId):number {
	let _id:number;
	switch (typeof id) {
			case 'object': _id = (id as BoxId).id; break;
			case 'number': _id = id as number; break;
			default: return;
	}
	return _id;
}

export function compareID(id1:number|BoxId, id2:number|BoxId):boolean {
	return numberFromId(id1) === numberFromId(id2);
}

export function checkHourMinutes(v:string): number {
	let reTime = /^(?:(?:[0-9])|(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]$/;
	if (reTime.test(v)) {
		let r = v.split(':');
		return Number(r[0]) * 60 + Number(r[1]);
	}
	let h = Number(v);
	if (isNaN(h) || h > 20 || h < 0) {
		return -1;
	}
	return h * 60;
}

export function taskTimeToString(t:number):string {
	if (isNaN(t) || t <= 0)
		return '';
	let h = Math.floor(t / 60);
	let m = Math.floor(t % 60);
	let ms = m.toString();
	if (m < 10) {
		ms = '0' + ms;
	}
	return h.toString() + ':' + ms;
}


export function initNoteItemObj(item:NoteItem):void {
	let {type, content, flowContent} = item;
	if (flowContent) {
		let obj = JSON.parse(flowContent);
		item.obj = obj;
	}
	else if (content) {
		if (content[0] === '{') {
			let obj = JSON.parse(content);
			if (type === EnumNoteType.text) {
				switch (obj.check) {
					case 1: item.type = EnumNoteType.textList; break;
					case 2: item.type = EnumNoteType.textCheckable; break;
				}
			}
			item.obj = obj;
		}
		else {
			item.obj = content;
		}
	}
}

