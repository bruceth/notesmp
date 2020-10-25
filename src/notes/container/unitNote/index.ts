import { CNotes } from "notes/CNotes";
import { CUnitNote } from "./CUnitNote";

export function createCUnitNote(cNotes: CNotes): CUnitNote { 
	return new CUnitNote(cNotes);
}
