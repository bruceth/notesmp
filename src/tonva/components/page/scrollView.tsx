import React from 'react';
import classNames from 'classnames';

const scrollAfter = 20; // 20ms之后，scroll执行
export class Scroller {
    private el: HTMLBaseElement;
    constructor(el: HTMLBaseElement) {
        this.el = el;
    }

    scrollToTop():void {
        setTimeout(() => this.el.scrollTo(0, 0), scrollAfter);
    }
    scrollToBottom():void {
        setTimeout(() => this.el.scrollTo(0, this.el.scrollTop + this.el.offsetHeight), scrollAfter);
    }
}

export interface ScrollProps {
    onScroll?: (e:any) => void;
    onScrollTop?: (scroller: Scroller) => Promise<boolean>;
	onScrollBottom?: (scroller: Scroller) => Promise<void>;
	className?: string;
}
interface ScrollViewProps extends ScrollProps {
	className?: string;
	style?: React.CSSProperties;
}
const scrollTimeGap = 100;
export class ScrollView extends React.Component<ScrollViewProps, null> {
    private bottomTime:number = 0;
	private topTime:number = 0;
	private div: HTMLDivElement;

	private refDiv = (div:HTMLDivElement) => {
		if (!div) {
			if (this.div) {
				this.div.removeEventListener('resize', this.onResize)
			}
			return;
		}
		this.div = div;
		this.div.addEventListener('resize', this.onResize);
	}

	private onResize = (ev:UIEvent) => {
		console.error('div resize');
	};

    private onScroll = async (e:any) => {
        let {onScroll, onScrollTop, onScrollBottom} = this.props;
        if (onScroll) this.props.onScroll(e);
        let el = e.target as HTMLBaseElement;
        let scroller = new Scroller(el);
        if (el.scrollTop < 30) {
            if (onScrollTop !== undefined) {
                let topTime = new Date().getTime();
                if (topTime-this.topTime > scrollTimeGap) {
                    this.topTime = topTime;
					onScrollTop(scroller).then(ret => {
						 // has more
						if (ret === true) {
							let sh = el.scrollHeight;
							let top = 200;
							if (top > sh) top = sh;
							el.scrollTop = top;
						}
					});
                }
            }
        }
        if (el.scrollTop + el.offsetHeight > el.scrollHeight - 30) {
            //this.eachChild(this, 'bottom');
            if (onScrollBottom !== undefined) {
                let bottomTime = new Date().getTime();
                if (bottomTime - this.bottomTime > scrollTimeGap) {
                    this.bottomTime = bottomTime;
                    onScrollBottom(scroller);
                }
            }
        }
    }
    private eachChild(c:any, direct:'top'|'bottom') {
        let { props } = c;
        if (props === undefined)
            return;
        let { children } = props;
        if (children === undefined)
            return;
        React.Children.forEach(children, (child, index) => {
            let {_$scroll} = child as any;
            if (_$scroll) _$scroll(direct);
            console.log(child.toString());
            this.eachChild(child, direct);
        });
	}
	
    render() {
		let {className, style} = this.props;
		return <div ref={this.refDiv} className={classNames('tv-page')}
			onScroll={this.onScroll} style={style}>
			<article className={className}>
				{this.props.children}
			</article>
		</div>;
    }
}

