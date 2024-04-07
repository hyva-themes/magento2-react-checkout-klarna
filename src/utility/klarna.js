import { get as _get } from 'lodash-es';
import { _keys } from '@hyva/react-checkout/utils';

import log from './log';
import config from './config';
import { getCategoryId, getContainerId } from './index';

export default {
  /**
   * Initiating Klarna to add the javascript SDK to the page
   */
  init(token) {
    // eslint-disable-next-line no-undef
    Klarna.Payments.init({
      client_token: token,
    });
  },
  /**
   * Performing the Klarna load request to load the Klarna widget
   */
  load(methodCode, cartData, actions, callback) {
    const paymentMethod = getCategoryId(methodCode);
    const containerId = getContainerId(methodCode);
    const containerElement = `#${containerId}`;
    const paymentMethodCategory = !config.isKecSession ? paymentMethod : null;
    const data = config.dataSharingOnload ? this.getUpdateData(cartData) : null;
    const options = {
      container: containerElement,
      payment_method_category: paymentMethodCategory,
    };

    log(`Loading container ${containerId}`);
    log(`Loading method ${paymentMethod}`);
    log({ options, data, config });

    // eslint-disable-next-line no-undef
    Klarna.Payments.load(options, data, (res) => {
      log(res);

      actions.setHasErrors(!res.errors);

      if (callback) {
        callback(res);
      }
    });
  },

  authorize(paymentMethod, cartData, actions, callback) {
    const data = this.getUpdateData(cartData);
    const authorizeCallback = (res) => {
      log(res);

      if (res.approved === true) {
        actions.setAuthorizationToken(res.authorization_token);
      }
      actions.setHasErrors(!!res.errors);

      const { approved: isApproved, authorization_token: authorizationToken } =
        res;

      callback({ isApproved, authorizationToken });
    };

    if (config.isKecSession) {
      // eslint-disable-next-line no-undef
      return Klarna.Payments.finalize({}, data, authorizeCallback);
    }

    const options = { payment_method_category: paymentMethod };

    // eslint-disable-next-line no-undef
    return Klarna.Payments.authorize(options, data, authorizeCallback);
  },

  /**
   * Getting back data for performing a Klarna update request
   */
  getUpdateData(cartData) {
    const { email, shippingAddress, billingAddress, isVirtual } = cartData;
    const billingAddressData = this.buildAddress(billingAddress, email);
    const shippingAddressData = this.buildAddress(
      isVirtual ? billingAddress : shippingAddress,
      email
    );
    const data = {
      billing_address: billingAddressData,
      shipping_address: shippingAddressData,
      customer: this.buildCustomer(billingAddress),
    };

    if (!!data.billing_address && !!data.shipping_address) {
      data.shipping_address.organization_name =
        data.billing_address.organization_name;
    }

    // if (customer.isLoggedIn()) {
    //   email = customer.customerData.email;
    // } else {
    //   email = quote.guestEmail;
    // }

    log(data);

    return data;
  },

  /**
   * Getting back the address based on the input
   * @param {Array} address
   * @param {String} email
   * @returns {{
   *      street_address: String,
   *      country: String,
   *      city: String,
   *      phone: String,
   *      organization_name: String,
   *      given_name: String,
   *      postal_code: String,
   *      family_name: String,
   *      email: *
   * }}
   */
  buildAddress(address, email) {
    const addr = { email };
    const addressMapper = {
      city: 'city',
      phone: 'phone',
      prefix: 'title',
      region: 'region',
      country: 'country',
      zipcode: 'postal_code',
      firstname: 'given_name',
      lastname: 'family_name',
      'street[0]': 'street_address',
      'street[1]': 'street_address2',
    };

    _keys(addressMapper).forEach((addressProp) => {
      const addressValue = _get(address, addressProp) || '';
      addr[addressMapper[addressProp]] = addressValue;
    });

    // Having organization_name in the billing address causes KP/PLSI to return B2B methods
    // no matter the customer type. So we only want to set this if the merchant has enabled B2B.
    if (address.company && config.b2bEnabled) {
      addr.organization_name = address.company;
    }

    log(addr);

    return addr;
  },

  buildCustomer(billingAddress) {
    let type = 'person';

    if (config.b2bEnabled && billingAddress && billingAddress.company) {
      type = 'organization';
    }

    return {
      type,
    };
  },
};
