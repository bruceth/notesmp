import * as React from 'react';
import _ from 'lodash';

export interface ImageProps {
    src: string;
    className?: string;
    style?: React.CSSProperties;
}

const defaultImage = 'http://101.200.46.56/imgs/Bear-icon.png';

export function Image(props: ImageProps) {
        let {className, style, src} = props;
        if (!src) {
            src = defaultImage;
        }
        else if (_.startsWith(src, ':') === true) {
            src = 'http://localhost:3015/res/' + src.substr(1);
        }
        return <img src={src} className={className} style={style} />;
    //}
}
