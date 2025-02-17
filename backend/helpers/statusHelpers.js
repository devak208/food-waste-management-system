// statusHelpers.js
const getDeliveryStatus = (status) => status === 'Delivered';
const getPaymentStatus = (status) => status === 'Completed';

module.exports = { getDeliveryStatus, getPaymentStatus };