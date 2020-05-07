export function arrIndexOf(arr, val) {
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i] === val) return i;
  }
  return -1;
}

export function arrRemove(arr, val) {
  const index = arrIndexOf(arr, val);
  if (index > -1) {
    arr.splice(index, 1);
  }
}
