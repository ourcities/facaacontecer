MoipSubscription = {

  billing: null,
  customer: null,
  messages: $('.subscription-messages'),
  button:   $('.subscription-form-button'),
  success:  $('#successful-message'),
  loading:  $('#loading'),
  subscription_url: $('#subscription-url').data('url'),
  /**
   *  Function to split the chars /().- and spaces.
   *  Because we receive inputs with these characters and the result, which is
   *  an array, can be used with key-value.
   */
  removeNonNumerical: function(input){
    return input.toString().split(/\/|\.|\s|\-|\(|\)|\,/).filter(function(e) { return e });
  },

  /**
   * Function to construct a new user with billing info and address
   * Takes a customer Object as argument
   *
   */
  buildCustomer: function(input) {

    console.log('Building Customer...');
    this.billing  = input.subscription
    var customer  = input.user;


    customer.cpf        = this.removeNonNumerical(customer.cpf).join('');

    // We receive dates in the format 00/00/0000
    // So we split the '/' to separate day, month and year
    customer.birthday   = this.removeNonNumerical(customer.birthday);

    // As were receiving phones in the format (00) 00000000?0 (this last 0 is optional)
    // We have to split spaces and the '()' chars
    // I've used the filter function to remove empty strings from the resultant array
    customer.phone      = this.removeNonNumerical(customer.phone);

    var params = {
      code:             new Date().getTime(),
      email:            customer.email,
      fullname:         customer.name,
      cpf:              customer.cpf,
      birthdate_day:    customer.birthday[0],
      birthdate_month:  customer.birthday[1],
      birthdate_year:   customer.birthday[2],
      phone_area_code:  customer.phone[0],
      phone_number:     customer.phone[1],
      billing_info:     this.buildBillingInfo(this.billing),
      address:          this.buildAddress(customer)
    };

    return new Customer(params);
  },

  /**
   * Function to build the customer address in a fashion object
   * Takes a customer Object as argument
   */

  buildAddress: function(customer) {
    console.log('Building Address...');
    // As we are receiving zip code in the format 00000-000
    // We have to split the '-' and join the numbers

    customer.zipcode  = this.removeNonNumerical(customer.zipcode).join('');
    var params = {
      street:       customer.address_street,
      number:       customer.address_number,
      complement:   customer.address_extra,
      district:     customer.address_district,
      zipcode:      customer.zipcode,
      city:         customer.city,
      state:        customer.state,
      country:      customer.country
    };

    return new Address(params);

  },

  /**
   * Function to build the Billing info
   * Takes a card from customer.card argument
   *
   */
  buildBillingInfo: function(billing){
    console.log('Building Billing...');

    var card = billing;
    var expire = card.expire.split(' / ');

    var params = {
      fullname:           card.fullname,
      credit_card_number: card.card_number,
      expiration_month:   expire[0],

      // Return only the two final numbers (2012 would be just '12')
      expiration_year:    expire[1].substr(-2),
    }

    return new BillingInfo(params);

  },

  /**
   * Function to create new subscription
   * arguments: Object customer
   *            String plan_code
   */
  createCustomerSubscription: function(code, customer, plan, token) {

    var self      = this;

    var customer  = this.buildCustomer(customer);
    var moip      = new MoipAssinaturas(token);


    // Creating a subscription for a new user
    moip.subscribe(
      new Subscription()

      // Generated code based on time
      .with_code(code)

      // The customer
      .with_new_customer(customer)

      // The plan ID
      .with_plan_code(plan)

      // The return function of the new subscribing action
    ).callback(function(response){


      // Oh-oh, something went wrong
      if (response.has_errors()) {
        console.log(response);
        // Remove the loading icon
        //Selfstarter.cardButton.removeClass('loading');

        // Show all errors above the submit button
        for ( var i = 0, len = response.errors.length; i < len; i++) {
          var error = response.errors[i].description;
          self.success.css({ visibility: 'hidden' });
          self.loading.css({ visibility: 'hidden'});

          self.messages.append($('<strong/>').addClass('').text(error));
        }

        self.button.show();
      }
      // If no errors were found
      else {
        console.log(response)
        self.messages.append($("<h6/>").text(response.message + "!"));

        $.get(self.subscription_url);

        setInterval(function(){
          location.reload();
        }, 6000)

      /*  // The codes 1, 2 and 3 are good ones, so we can */
        //// move to the next step: save the subscription into our db
        //Selfstarter.saveSubscription(
          //code,
          //// We receive 00,00 values. This removes the two ,00
          //// from the end
          //parseInt(response.amount.toString().slice(0,-2)),
          //// Setting up which form will be sent (in this case, the one with creditcard fields)
          /*Selfstarter.cardForm);*/

      }
    });

  },

};
