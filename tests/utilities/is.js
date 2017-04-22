export default function is(instance) {
    let res = ({}).toString.call(instance);
    res = res.split(' ')[1].replace(/\W/gi, '').toLowerCase();
    return res;
}