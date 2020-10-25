//import React from 'react';
import { TabRelative } from '../../noteBase';
import { VRelativesNoteBase } from '../views';
import { CNoteText } from './CNoteText';

export class VTextRelatives extends VRelativesNoteBase<CNoteText> {
	protected get tabs():TabRelative[] { return [this.tabComment, this.tabShare] };
}
