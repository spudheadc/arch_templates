
export function setToArray<Type>(set: Set<Type>):Type[] {
    var ret: Array<Type> = []; 
    set.forEach((item) => ret.push(item)); 
    return ret;
}
