//import React from 'react';
import { VRelativesBase, TabRelative } from "../../noteBase";
import { CFolder } from "../CFolder";

export class VFolderRelatives extends VRelativesBase<CFolder> {
	protected get tabs():TabRelative[] { return [this.tabShare] };
}
