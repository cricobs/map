/**
 * Created by lap-hep-deb-use on 2/8/17.
 */



var h = new History();
h.append(1);
h.append(2);
h.append(3);

console.info(h.current()); //3
console.info(h.previous()); // 2
console.info(h.previous()); // 1
console.info(h.previous()); // 1
console.info(h.previous()); // 1
// console.info(h.next()); // 2
// h.append(4);
// console.info(h.current()); //4
console.info(h.next()); //3
console.info(h.next()); //2
