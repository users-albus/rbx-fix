enum BatchBuyPurchaseResults {
  Success = "Success",
  AlreadyOwned = "AlreadyOwned",
  InsufficientFunds = "InsufficientFunds",
  ExceptionOccured = "ExceptionOccurred",
  TooManyPurchases = "TooManyPurchases",
  CaughtError = "CaughtError",
  PremiumNeeded = "InsufficientMembership",
  NoSellers = "NotForSale",
}

export default BatchBuyPurchaseResults;
