# fast vanity address generator

## Comparison

| prefixChars | [vanity-eth.tk](https://vanity-eth.tk) | fast-vanity-address-generator |
| ----------- | -------------------------------------- | ----------------------------- |
| 0x0000      | 7 secs                                 | ~3 secs                       |
| 0x00000     | 1 min 48 secs                          | ~25 secs                      |
| 0x000000    | 28 mins 54 secs                        | ~10 mins 32 secs              |

Note: I just ran few trials on M1 MacBook Pro using 4 worker threads. Time taken can depend on factors like OS (crypto random source), processor, number of threads used and luck.

## How to use

1. Git clone
2. `yarn install`
3. Set your address rule in `worker.js`, update the `match` function logic as per your desire.
4. Set number of workers in `run.js`. Currently it's set to 8.
5. `node run.js`
6. Pvt key and address is saved in `secret-keys.txt`

## How it works

Most of existing vanity address generators use randomBytes for every iteration. Generating a cryptographically secure random number is a costly operation, and doing it for every iteration slows down the process.

This impl simply generates crypto secure random number once, and mines on the offset.

```python
def generateWallet():
    randomNumber = cryptoSecure() ## costly operation
    offset = 0

    while(1) {
        address = getAddressForPrivateKey(randomNumber + offset)

        if(match(address)) break

        offset++ ## cheap operation
    }

    return randomNumber + offset
```

## Would this kind of way be safe?

Assuming the `randomNumber` has an entropy of 256 bits (as it's taken from a crypto secure random number), which makes it practically unfeasible to guess it.

However the `offset` is a small number which is easy to guess.

The addition of `randomNumber` to `offset` is like a [one-time pad](https://en.wikipedia.org/wiki/One-time_pad). And theoretically, it is not possible to guess the sum unless `randomNumber` can also be guessed.
