import React from 'react';
import { View } from "../../../tonva";
import { CNoteText } from "./CNoteText";
import { observer } from 'mobx-react';

export class VTextHeader extends View<CNoteText> {
	render() {
		return React.createElement(observer(() => <>{this.controller.header}</>));
	}
}
