# XNFT

This is front-end repository of the [XNFT](http://dev.xnft.shop/).

## 💻 Set Up Environment

To begin, you need to install dependencies with Yarn.

```
 $ yarn
```

You should update **default provider URL** because our production provider URL is limited by CORS for security.
On `src/config.ts`, please replace it:

```diff
- defaultProvider: 'https://mainnet.infura.io/v3/OLD_PROVIDER_URL',
+ defaultProvider: 'https://mainnet.infura.io/v3/YOUR_PROVIDER_URL',
```

After it, you can launch the development server with following command.

```
 $ yarn start
```
