declare type C = {
    new (...args: any[]): {};
};
export declare function makeReactive(model: any): {};
declare function VueStore<T extends C>(constructor: T): T;
declare namespace VueStore {
    var create: typeof makeReactive;
}
export default VueStore;
