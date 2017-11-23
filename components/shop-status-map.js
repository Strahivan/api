module.exports = {
  pending: {
    message: 'A new custom order is waiting for your verification. Please check availability of the item and set the status to approval.'
  },
  verify: {
    message: 'Congratulations! A user just purchased an item through bank transfer. Please verify that you received the amount and set the order to confirmed.'
  },
  confirmed: {
    message: 'Congratulations! A user just purchased an item through paypal. Please set the order to processing when you have the item in your hands.'
  },
  ready_for_delivery: {
    message: 'A user just paid the second installment of her order. Please arrange for delivery for the item.'
  },
  verify_pending_payment: {
    message: 'A user just paid the second installment of her order via bank transfer. Please verify receipt and then arrange for delivery for the item.'
  }
};

