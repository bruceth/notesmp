import { CNotes } from '../CNotes';
import { CSpace } from './space';
import { CFolder } from './CFolder';
import { NoteItem } from '../model';
import { CFolderMy } from './folderMy';
import { CFolderShare } from './folderShare';

export { CContainer } from './CContainer';
export { CFolderRoot } from './folderRoot';

export * from './unitNote';

export function createCSpace(cNotes: CNotes): CSpace { 
	return new CSpace(cNotes);
}

export function createCFolder(cNotes: CNotes, noteItem: NoteItem): CFolder {
	if (cNotes.isMe(noteItem.owner) === true) {
		return new CFolderMy(cNotes);
	}
	else {
		return new CFolderShare(cNotes);
	}
}
