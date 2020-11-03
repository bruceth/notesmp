import { CUqBase } from "../tapp";
import { initNoteItemObj, NoteItem } from "../notes/model";
import { VBook } from "./VBook";
import { QueryPager } from "../tonva";
import { VFlow } from "./VFlow";

export interface ProjectSum {
	id: number;
	name: string;
	debitYear: number;
	creditYear: number;
	debitMonth: number;
	creditMonth: number;
	debitWeek: number;
	creditWeek: number;
	debitDay: number;
	creditDay: number;
	h8: number;
}

export interface ProjectFlowItem {
	project: number;
	stamp: Date;
	debit: number;
	credit: number;
	memo: string;
	note: number; 		// 关联的Note
}

export class CBook extends CUqBase {
	projectSums: ProjectSum[];
	projectDetailPager: QueryPager<ProjectFlowItem>;

    protected async internalStart() {
	}

	async loadBookProjects() {
		//let ret = await this.uqs.notes.GetBookProjects.query({user: this.user.id, at: undefined}, true);
		this.projectSums = []; //ret.ret;
	}

	renderBook() {
		return this.renderView(VBook);
	}

	async showProjectFlow(projectSum: ProjectSum) {
		this.projectDetailPager = new QueryPager(this.uqs.notes.GetProjectFlow);
		this.projectDetailPager.first({project: projectSum.id});
		this.openVPage(VFlow, projectSum);
	}

	async showFlowItem(projectFlowItem: ProjectFlowItem) {
		let {note} = projectFlowItem;
		let ret = await this.uqs.notes.GetNoteItemFromId.query({note});
		let noteItem:NoteItem = ret.ret[0];
		initNoteItemObj(noteItem);
		let cNote = this.cApp.cHome.cNotes.createCNoteBase(noteItem);
		cNote.init(noteItem);
		cNote.showViewPage();
	}
}
