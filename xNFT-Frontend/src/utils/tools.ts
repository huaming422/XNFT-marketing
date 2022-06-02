import Web3 from 'web3';

const isNumber = (val: number | string) => {
  if (!val) {
    return false;
  }
  //限制小数点前后位数
  return /^([1-9][\d]{0,6}|0)(\.[\d]{1,2})?$/.test(`${val}`);
};

const toChecksumAddress = (address: string) => {
  const web3: any = new Web3(window.ethereum);

  var checksumAddress = '0x';
  address = address.toLowerCase().replace('0x', '');

  // creates the case map using the binary form of the hash of the address
  var caseMap = parseInt(web3?.sha3('0x' + address), 16)
    .toString(2)
    .substring(0, 40);

  for (var i = 0; i < address.length; i++) {
    if (caseMap[i] === '1') {
      checksumAddress += address[i].toUpperCase();
    } else {
      checksumAddress += address[i];
    }
  }
  console.log('create: ', address, caseMap, checksumAddress);
  return checksumAddress;
};

function debounce<F extends (...params: any[]) => void>(fn: F, delay: number) {
  let timeoutID: number = null;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutID);
    timeoutID = window.setTimeout(() => fn.apply(this, args), delay);
  } as F;
}

const copyTextValue = (id: any, attr: any) => {
  let target = null;

  if (attr) {
    target = document.createElement('div');
    target.id = 'tempTarget';
    target.style.opacity = '0';
    if (id) {
      let curNode: any = document.querySelector('#' + id);
      target.innerText = curNode[attr];
    } else {
      target.innerText = attr;
    }
    document.body.appendChild(target);
  } else {
    target = document.querySelector('#' + id);
  }

  try {
    let range = document.createRange();
    range.selectNode(target);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    console.log('复制成功');
  } catch (e) {
    console.log('复制失败');
  }

  if (attr) {
    // remove temp target
    target.parentElement.removeChild(target);
  }
};

const formatAddress = (address: string, subLength?: number) => {
  if (!address || address.length < 20 || subLength === address?.length) {
    return address;
  }
  const length = address.length;
  return `${address.slice(0, Math.min(subLength || 5, length))}...${address.slice(
    length - Math.min(subLength || 5, length),
    length,
  )}`;
};

const isChrome = () => {
  return window.navigator.userAgent?.toUpperCase()?.includes('CHROME');
};

// hack to fixed text component warning
const ignoreWarnings = [
  'for a non-boolean attribute',
  "Warning: Can't perform a React state update on an unmounted component.",
  'unrecognized in this browser',
  'Invalid DOM property',
];
const realError = console.error;
console.error = (...x: any) => {
  if (ignoreWarnings.find((item) => x[0]?.toString()?.includes(item))) {
    return;
  }
  realError(...x);
};

const retry = (
  fn: (...rest: any[]) => Promise<any>,
  retriesTimes = 5,
  interval = 1000,
): Promise<any> => {
  return new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch((error: any) => {
        setTimeout(() => {
          if (retriesTimes === 0) {
            window.location.href = '/';
            return;
          }
          retry(fn, retriesTimes - 1, interval).then(resolve, reject);
        });
      });
  });
};

export { isNumber, toChecksumAddress, debounce, copyTextValue, formatAddress, isChrome, retry };
