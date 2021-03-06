import { LocalMap } from './localDb';
import _ from 'lodash';

const testingTags:string[] = ['/test', '/test/', '-test', '-test/'];
function isTesting():boolean {
    if ("undefined" != typeof wx)
        return false;
    let {pathname} = window.location;
    let pn = pathname.toLowerCase();
    for (let item of testingTags) {
        if (_.endsWith(pn, item) === true) return true;
    }
    return false;
}

export const env = (function () {
    let testing = isTesting();
    let localDb = new LocalMap(testing===true? '$$':'$');
    return {
        testing: testing,
        isDevelopment: process.env.NODE_ENV === 'development',
        localDb: localDb,
        setTimeout: (tag:string, callback: (...args: any[]) => void, ms: number, ...args: any[]):NodeJS.Timer => {
            //if (tag !== undefined) console.log('setTimeout ' + tag);
            return global.setTimeout(callback, ms, ...args);
        },
        clearTimeout: (handle:NodeJS.Timer):void => {
            global.clearTimeout(handle);
        },
        setInterval: (callback: (...args: any[]) => void, ms: number, ...args: any[]): NodeJS.Timer => {
            return global.setInterval(callback, ms, ...args);
        },
        clearInterval: (handle:NodeJS.Timer):void => {
            global.clearInterval(handle);
        }
    }
}());
