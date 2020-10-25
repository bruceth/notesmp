import React from 'react';
import { CApp } from "./CApp";
import { VPage } from "../tonva";

export class VTestMe extends VPage<CApp> {
	header() {return 'VTestMe'}
	content() {
		return <div>VTestMe</div>;
	}
}
