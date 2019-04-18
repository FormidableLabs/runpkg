const reducerFn = (acc, cur, idx, src) => {
    // If first word, just add to acc
    if (idx === 0) {
      return acc.concat(cur);
    }
  
    const currentLength = cur.length;
    const prevLength = acc[acc.length - 1].length;
  
    // Check if it can be added to the current last item in acc
    // If not, just Array.prototype.concat it
    if (currentLength + prevLength <= 10) {
      const joinedWord = acc.pop() + " " + cur;
      return acc.concat(joinedWord);
    }
  
    return acc.concat(cur);
  };
  
  export default reducerFn;
  