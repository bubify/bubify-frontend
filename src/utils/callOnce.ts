export function callOnce(myFunction: any) {
  let isCalled = false;

  async function call(...args: any) {
    if (isCalled) {
      return;
    }
    isCalled = true;
    return myFunction(...args);
  }

  function reset() {
    isCalled = false;
  }

  return {
    call,
    reset,
  };
}
