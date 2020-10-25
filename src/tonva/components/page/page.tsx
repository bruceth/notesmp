import * as React from 'react';
import {observer} from 'mobx-react';
import {PageHeader} from './pageHeader';
import { TabsProps, TabsView } from './tabs';
import { ScrollProps, ScrollView } from './scrollView';

export interface IVPage {
	content():JSX.Element;
	header():JSX.Element;
	footer():JSX.Element;
}


export interface PageProps extends ScrollProps {
    back?: 'close' | 'back' | 'none';
    header?: boolean | string | JSX.Element;
    right?: JSX.Element;
    footer?: JSX.Element;
    logout?: boolean | (()=>Promise<void>);
	headerClassName?: string;
	className?: string;
	afterBack?: () => void;
	tabsProps?: TabsProps;
}

@observer
export class Page extends React.Component<PageProps> {
	private tabsView: TabsView;
    constructor(props: PageProps) {
		super(props);
		let {tabsProps} = props;
		if (tabsProps) {
			this.tabsView = new TabsView(tabsProps);
		}
	}

	private renderHeader() {
		const {back, header, right, headerClassName, afterBack} = this.props;
		let pageHeader = header !== false && <PageHeader 
			back={back} 
			center={header as any}
			right={right}
			logout={this.props.logout}
			className={headerClassName}
			afterBack={afterBack}
			/>;
		return pageHeader;
	}

	private renderFooter() {
		const {footer} = this.props;
		if (footer) {
			let elFooter = <footer>{footer}</footer>;
			return <>
				<section className="tv-page-footer">{elFooter}</section>
				{elFooter}
			</>;
		}
	}

    render() {
		if (this.tabsView) {
			return React.createElement(this.tabsView.content);
		}
		const {onScroll, onScrollTop, onScrollBottom, children, className} = this.props;
		return <ScrollView
			onScroll={onScroll}
			onScrollTop={onScrollTop}
			onScrollBottom={onScrollBottom}
			className={className}
		>
			{this.renderHeader()}
			<main>{children}</main>
			{this.renderFooter()}
		</ScrollView>;
	}
}
