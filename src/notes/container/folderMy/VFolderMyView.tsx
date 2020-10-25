import React from 'react';
import { VFolderView } from '../views';
import { CFolderMy } from './CFolderMy';

export class VFolderMyView extends VFolderView<CFolderMy> {
	protected renderViewBottom():JSX.Element {
		return <div className="py-2 pl-3 bg-light border-top d-flex align-items-end">
			{this.renderShareButton()}
		</div>;
	}
}
