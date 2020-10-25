import * as React from 'react';
import { VPage, TabCaptionComponent, Page, TabProp, t } from '../tonva';
import { CApp } from './CApp';

const color = (selected: boolean) => selected === true ? 'text-primary' : 'text-muted';
function caption(label:string, icon:string) {
	return (selected: boolean) => TabCaptionComponent(label, icon, color(selected));
}
export class VMain extends VPage<CApp> {
    async open(param?: any, onClosePage?: (ret:any)=>void) {
        this.openPage(this.render, param, onClosePage);
    }

    render = (param?: any): JSX.Element => {
		let { cHome, cRelation, cDiscover, cMe } = this.controller;
		/*
        let faceTabs = [
			{ name: 'note', label: '首页', icon: 'home', content: cGroup.tab},
			{ name: 'job', label: '查看', icon: 'list', content: cReport.tab, onShown: cReport.load, className: 'job-tab' },
            //{ name: 'home', label: '绩效', icon: 'tasks', content: cHome.tab, },
            { name: 'me', label: '我的', icon: 'user', content: cMe.tab }
        ].map(v => {
            let { name, label, icon, content, onShown, className } = v;
            return {
                name: name,
                caption: (selected: boolean) => TabCaptionComponent(label, icon, color(selected)),
                content: content,
				onShown: onShown,
				className: className
            }
		});
		*/
		let tabs: TabProp[] = [
			{name: 'home', caption: caption(t('home'), 'home'), content: cHome.tab},
			{name: 'relation', caption: caption(t('relation'), 'user-plus'), content: cRelation.tab, onShown: cRelation.load},
			{name: 'discover', caption: caption(t('discover'), 'arrows-alt'), content: cDiscover.tab, load: cDiscover.loadBookProjects},
			{name: 'me', caption: caption(t('me'), 'user-o'), content: cMe.tab},
		];
		return <Page tabsProps={{tabs}} />;
    }
}
