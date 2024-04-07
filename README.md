# Hyvä Themes - React Checkout Klarna

[![Hyvä Themes](https://github.com/hyva-themes/magento2-react-checkout/blob/documentation/docs/images/logo-hyva.svg)](https://hyva.io/)

## hyva-themes/magento2-react-checkout-klarna

Klarna payment method for Hyvä React Checkout

## Prerequisites

1. **[React Checkout](https://github.com/hyva-themes/magento2-react-checkout)** is installed and setup.
2. Klarna for Magento 2 is installed and setup as per the [documentation from Klarna](https://docs.klarna.com/platform-solutions/adobe-commerce/adobe-commerce-244-and-above/installation/)
3. Klarna is enabled and configured in the Magento 2 store backend under `Stores > Configuration > Sales > Payment Methods > Klarna > API configuration`.

## How to use it with Hyvä Checkout?
Add below code in your `package.json`.

File: `src/reactapp/package.json`

```
"config": {
    "paymentMethodsRepo": {
      "klarna": "git@github.com:hyva-themes/magento2-react-checkout-klarna.git"
    }
},
```
With this code in `package.json` and running `npm install`, then you are all set. This repo will be copied into the React Checkout and configured correctly.

Finally, we need to build the app again. For this, you need to run `npm run build` from the root directory of React Checkout react app (`src/reactapp`). After this, if you navigate to the checkout page from your site, then you will see the Amazon Pay payment option you have configured in the above step.

## Klarna payment methods covered

Below are the list of payment method currently covered by this integration

- klarna_pay_later


## Documentation

- If you need information on the build process of the React Checkout, then you can **[read more about it here](https://hyva-themes.github.io/magento2-react-checkout/build/)**.
- If you want to know more about how Hyvä Checkout helps you to integrate any payment methods, then **[read more about it here](https://hyva-themes.github.io/magento2-react-checkout/payment-integration/)**.
- The official documentation of **[Hyvä React Checkout](https://hyva-themes.github.io/magento2-react-checkout)**
- Klarna official **[documentation](https://docs.klarna.com/platform-solutions/adobe-commerce/)**

## Credits

- [All Contributors][link-contributors]

## License

BSD 3-Clause License. Please see [License File](LICENSE.txt) for more information.

[link-contributors]: ../../contributors
