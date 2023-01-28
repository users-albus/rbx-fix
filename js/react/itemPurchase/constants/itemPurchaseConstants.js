export default {
  errorTypeIds: {
    transactionFailure: "TransactionFailureView",
    insufficientFunds: "InsufficientFundsView",
    priceChanged: "PriceChangedView",
  },
  errorStatusText: {
    badRequest: "Bad Request",
  },
  events: {
    startItemPurchase: "ItemPurchaseStart",
    NEW_UPSELL_FAILED_DUE_TO_ERROR:
      "ReactBuyButtonNewUpsellProcessFailedDueToError",
    NEW_UPSELL_FAILED_DUE_TO_LOADING:
      "ReactBuyButtonNewUpsellProcessFailedDueToNotLoaded",
    NEW_UPSELL_FROM_REACT_BUY_BUTTON:
      "ReactBuyButtonNewUpsellProcessNewUpsellFromReactBuyButton",
  },
  resources: {
    freeLabel: "Label.Free",
    okAction: "Action.Ok",
    insufficientFundsHeading: "Heading.InsufficientFunds",
    insufficientFundsMessage: "Message.InsufficientFunds",
    cancelAction: "Action.Cancel",
    buyRobuxAction: "Action.BuyRobux",
    buyAccessAction: "Action.BuyAccess",
    buyItemHeading: "Heading.BuyItem",
    buyNowAction: "Action.BuyNow",
    getItemHeading: "Heading.GetItem",
    getNowAction: "Action.GetNow",
    priceChangedHeading: "Heading.PriceChanged",
    priceChangedMessage: "Message.PriceChanged",
    balanceAfterMessage: "Message.BalanceAfter",
    agreeAndPayLabel: "Label.AgreeAndPay",
    promptGetFreeAccessMessage: "Message.PromptGetFreeAccess",
    promptGetFreeMessage: "Message.PromptGetFree",
    promptBuyAccessMessage: "Message.PromptBuyAccess",
    promptBuyMessage: "Message.PromptBuy",
    configureAction: "Action.Customize",
    notNowAction: "Action.NotNow",
    customizeAction: "Action.Customize",
    continueAction: "Action.Continue",
    purchaseCompleteHeading: "Heading.PurchaseComplete",
    successfullyBoughtAccessMessage: "Message.SuccessfullyBoughtAccess",
    successfullyBoughtMessage: "Message.SuccessfullyBought",
    successfullyRenewedAccessMessage: "Message.SuccessfullyRenewedAccess",
    successfullyRenewedMessage: "Message.SuccessfullyRenewed",
    successfullyAcquiredAccessMessage: "Message.SuccessfullyAcquiredAccess",
    successfullyAcquiredMessage: "Message.SuccessfullyAcquired",
    errorOccuredHeading: "Heading.ErrorOccured",
    purchasingUnavailableMessage: "Message.PurchasingUnavailable",
    buyAction: "Action.Buy",
    installAction: "Action.Install",
    getAction: "Action.Get",
    bestPriceLabel: "Label.BestPrice",
    priceLabel: "Label.Price",
    premiumDiscountOpportunityPromptLabel:
      "Label.PremiumDiscountOpportunityPrompt",
    premiumDiscountSavingsLabel: "Label.PremiumDiscountSavings",
    premiumExclusiveEligiblePromptLabel: "Label.PremiumExclusiveEligiblePrompt",
    premiumExclusiveIneligiblePromptLabel:
      "Label.PremiumExclusiveIneligiblePrompt",
    getPremiumAction: "Action.GetPremium",
    itemNotCurrentlyForSaleLabel: "Label.ItemNotCurrentlyForSale",
    itemNoLongerForSaleLabel: "Label.ItemNoLongerForSale",
    purchasingTemporarilyUnavailableLabel:
      "Label.PurchasingTemporarilyUnavailable",
    itemAvailableInventoryLabel: "Label.ItemAvailableInventory",
    noOneCurrentlySellingLabel: "Label.NoOneCurrentlySelling",
    inventoryAction: "Action.Inventory",
    OffsaleCountdownHourMinuteSecondLabel:
      "Label.OffsaleCountdownHourMinuteSecond",
    CountdownTimerDayHourMinute: "Label.CountdownTimerDayHourMinute",
    batchBuyItemHeading: "Heading.BuyItems",
    batchBuyPromptMessage: "Message.PromptBatchBuy",
    batchBuyBalanceAfterMessage: "Message.BalanceAfter",
    purchaseCompletedMessage: "Heading.PurchaseCompleted",
    generalPurchaseErrorMessage: "Heading.GeneralError",
    batchBuyPartialSuccessGeneralFailureMessage:
      "Heading.PartialSuccessGeneralFailure",
    batchBuyPartialSuccessItemsOwnedFailureMessage:
      "Heading.PartialSuccessItemsOwnedFailure",
    batchBuyPartialSuccessInsufficientFundsFailureMessage:
      "Heading.PartialSuccessInsufficientFundsFailure",
    batchBuyPartialSuccessNetworkErrorFailureMessage:
      "Heading.PartialSuccessNetworkErrorFailure",
    batchBuyPartialSuccessFloodcheckFailureMessage:
      "Heading.PartialSuccessFloodcheckFailure",
    purchaseErrorFailureMessage: "Heading.PurchaseFailure",
    batchBuyItemsOwnedFailureMessage: "Heading.ItemsOwnedFailure",
    insufficientFundsFailureMessage: "Heading.InsufficientFundsFailure",
    networkErrroFailureMessage: "Heading.NetworkErrorFailure",
    floodcheckFailureMessage: "Heading.FloodcheckFailure",
    batchBuyPartialSuccessPremiumNeededFailureMessage:
      "Heading.PartialSuccessPremiumNeededFailure",
    batchBuyPartialSuccessNoSellersFailureMessage:
      "Heading.PartialSuccessNoSellersFailure",
    premiumNeededFailureMessage: "Heading.PremiumNeededFailure",
    noSellersFailureMessage: "Heading.NoSellersFailure",
  },
  assetTypes: {
    // library catagory type
    Plugin: 38,
    Decal: 13,
    Model: 10,
    Video: 62,
    MeshPart: 40,
    //  no category type
    Place: 9,
    Badge: 21,
    GamePass: 34,
    Animation: 24,
    // others catalog category type
  },
  assetCategory: {
    Catalog: 0,
    Library: 1,
  },
  errorMessages: {
    insufficientFunds: "InsufficientFunds",
    retryErrorMessage:
      "Failed to determine purchasability status. Please try again by refreshing.",
    notForSale: "NotForSale",
    unauthorizedMessage: "Unauthorized",
  },
  batchBuyMaxThumbnails: 3,
  maxBatchLoadRetries: 5,
  floodcheckTime: 5,
};
