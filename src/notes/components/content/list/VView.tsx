import React from 'react';
import { View } from "../../../../tonva";
import { CList } from './CList';
import { observer } from 'mobx-react';

export class VView extends View<CList> {
	render() {
		return React.createElement(observer(() => {
			let items = this.controller.items;
			return <ul className="note-content-list px-3 my-2">
				{items.map((v, index) => {
					let {key, text} = v;
					return <li key={key} className="ml-3 pt-1 pb-2 align-items-center">
						{text}
					</li>
				})}
			</ul>;
		}));
	}
}
