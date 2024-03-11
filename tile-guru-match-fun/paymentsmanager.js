/**
 * Created by andrey on 13.10.2023
 */

var PaymentsManager = function () {
    this.consumed = [];
    this.load();

    this.restoreThrottled = cleverapps.timeredThrottle(10000, this.restore.bind(this));
    this.tryLoadProductsThrottled = cleverapps.timeredThrottle(10000, this.tryLoadProducts.bind(this));

    cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, this.tryLoadProductsThrottled.bind(this));
    cleverapps.timeouts.setInterval(this.tryLoadProductsThrottled.bind(this), cleverapps.parseInterval("2 minutes"));

    cleverapps.timeouts.setInterval(this.restoreThrottled.bind(this), cleverapps.parseInterval(cleverapps.config.debugMode ? "1 minute" : "5 minutes"));

    cleverapps.platform.on("changeStatus:" + Platform.PAYMENTS, function (status) {
        this.updateFlags();

        if (status === Platform.STATUS_CONNECTED) {
            this.tryLoadProducts();
        } else {
            cleverapps.payments.productsLoaded = false;
        }
    }.bind(this));
};

PaymentsManager.prototype.createPayments = function () {
    var oldPluginClass = cleverapps.payments && cleverapps.payments.constructor;
    var PluginClass = this.getPluginClass();

    if (oldPluginClass === PluginClass) {
        return cleverapps.payments;
    }

    this.stopLoadProductsPlayer();
    this.stopRestorePlayer();
    this.stopPurchasePlayer();

    delete this.restorePurchase;

    if (cleverapps.payments) {
        cleverapps.payments.clear();
    }

    cleverapps.payments = new PluginClass();

    PaymentOverlay.initialize();

    return cleverapps.payments;
};

PaymentsManager.prototype.getPluginClass = function () {
    var PluginClass;

    if (NoPayments.isAppropriate()) {
        PluginClass = NoPayments;
    } else if (YooKassaPayments.isAppropriate()) {
        PluginClass = YooKassaPayments;
    } else if (WebViewPayments.isAppropriate()) {
        PluginClass = WebViewPayments;
    } else if (RuStorePayments.isAppropriate()) {
        PluginClass = RuStorePayments;
    } else if (XsollaPayments.isAppropriate()) {
        PluginClass = XsollaPayments;
    } else if (TestPayments.isAppropriate()) {
        PluginClass = TestPayments;
    } else if (InstantPayments.isAppropriate()) {
        PluginClass = InstantPayments;
    } else if (SPMobagePayments.isAppropriate()) {
        PluginClass = SPMobagePayments;
    } else if (OKPayments.isAppropriate()) {
        PluginClass = OKPayments;
    } else if (MobileMyMailRuPayments.isAppropriate()) {
        PluginClass = MobileMyMailRuPayments;
    } else if (SamsungPayments.isAppropriate()) {
        PluginClass = SamsungPayments;
    } else if (MyMailRuPayments.isAppropriate()) {
        PluginClass = MyMailRuPayments;
    } else if (MobileVkPayments.isAppropriate()) {
        PluginClass = MobileVkPayments;
    } else if (VKPayments.isAppropriate()) {
        PluginClass = VKPayments;
    } else if (MobagePayments.isAppropriate()) {
        PluginClass = MobagePayments;
    } else if (FotoStranaPayments.isAppropriate()) {
        PluginClass = FotoStranaPayments;
    } else if (DraugiemPayments.isAppropriate()) {
        PluginClass = DraugiemPayments;
    } else if (YandexPayments.isAppropriate()) {
        PluginClass = YandexPayments;
    } else if (MicrosoftPayments.isAppropriate()) {
        PluginClass = MicrosoftPayments;
    } else if (PlingaPayments.isAppropriate()) {
        PluginClass = PlingaPayments;
    } else if (KongregatePayments.isAppropriate()) {
        PluginClass = KongregatePayments;
    } else if (WortalPayments.isAppropriate()) {
        PluginClass = WortalPayments;
    } else if (FacebookPayments.isAppropriate()) {
        PluginClass = FacebookPayments;
    } else if (MygamesPayments.isAppropriate()) {
        PluginClass = MygamesPayments;
    } else if (WechatPayments.isAppropriate()) {
        PluginClass = WechatPayments;
    }

    return PluginClass;
};

PaymentsManager.prototype.updateFlags = function () {
    cleverapps.whenAllInitialized(function () {
        cleverapps.flags.update();
    });
};

PaymentsManager.prototype.onUpdateCountry = function () {
    if (this.isPurchaseRunning()) {
        return;
    }

    cleverapps.platform.updatePlugin(Platform.PAYMENTS);
};

PaymentsManager.prototype.stopRestorePlayer = function () {
    if (this.restorePlayer) {
        this.restorePlayer.stop();
        delete this.restorePlayer;
    }
};

PaymentsManager.prototype.restore = function () {
    if (!cleverapps.payments.isAvailable() || !cleverapps.payments.isRestoreAvailable()
        || this.isPurchaseRunning() || this.isRestoreRunning()) {
        return;
    }

    var purchase;

    var player = this.restorePlayer = new ActionPlayer({
        actionTimeout: cleverapps.parseInterval("1 minute"),
        actions: [
            function (f, stop) {
                cleverapps.payments.restore(function (code, restorePurchase) {
                    if (code === cleverapps.CODE_SUCCEED) {
                        restorePurchase.restore = true;
                        purchase = restorePurchase;
                        f();
                    } else {
                        stop();
                    }
                });
            },

            function (f, stop) {
                if (this.isConsumed(purchase.paymentId)) {
                    this.consume(purchase);
                    stop();
                    return;
                }

                cleverapps.payments.validate(purchase, function (code) {
                    if (code === cleverapps.CODE_SUCCEED) {
                        f();
                    } else {
                        this.consume(purchase);
                        stop();
                    }
                }.bind(this));
            }.bind(this),

            function (f) {
                this.restorePurchase = purchase;

                console.log("payments restore", purchase);

                f();
            }.bind(this),

            function (f) {
                if (!cleverapps.meta.isFocused()) {
                    this.showRestore();
                }

                f();
            }.bind(this)
        ]
    });

    player.play();
};

PaymentsManager.prototype.showRestore = function () {
    var purchase = this.restorePurchase;
    var product = purchase && purchase.productId && Product.Create(purchase.productId);

    var isAvailable = product && purchase && cleverapps.environment.isMainScene()
        && (!cleverapps.travelBook.isExpedition() || !product.mainSceneOnly);

    if (!isAvailable) {
        return;
    }

    this.logPurchase(product, purchase);
    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.PRODUCT.RESTORE, { value: product.price });
    this.consume(purchase);

    product.onBuyed({ restore: true });

    delete this.restorePurchase;
    this.restoreThrottled();
};

PaymentsManager.prototype.load = function () {
    var info = cleverapps.platform.dataLoader.load(SimpleDataLoader.TYPES.PAYMENTS);
    if (info) {
        this.consumed = (info.consumed || []).slice();
    }
};

PaymentsManager.prototype.save = function () {
    cleverapps.platform.dataLoader.save(SimpleDataLoader.TYPES.PAYMENTS, {
        consumed: this.consumed.slice(-Payments.CONSUMED_STORAGE_LIMIT)
    });
};

PaymentsManager.prototype.setConsumed = function (paymentId) {
    if (paymentId && !this.consumed.includes(paymentId)) {
        this.consumed.push(paymentId);
        this.save();
    }
};

PaymentsManager.prototype.isConsumed = function (paymentId) {
    return paymentId && this.consumed.includes(paymentId);
};

PaymentsManager.prototype.consume = function (purchase) {
    this.setConsumed(purchase.paymentId);
    cleverapps.payments.consume(purchase);
};

PaymentsManager.prototype.purchase = function (product, callback, options) {
    callback = cleverapps.once(callback);

    var overlay;
    var purchase;

    if (this.isPurchaseRunning()) {
        cleverapps.notification.create("Product.PurchaseProcessing");
        callback(false, Product.PURCHASE_PROCESSING);
        return;
    }

    if (!cleverapps.payments.isAvailable()) {
        cleverapps.notification.create("Product.PurchaseCancelled");
        callback(false, cleverapps.CODE_FAILED);
        return;
    }

    var player = this.purchasePlayer = new ActionPlayer([
        function (f, stop) {
            cleverapps.payments.setPurchaseState(PaymentsManager.STATE_SOCIAL);

            if (cleverapps.payments.freeFromLoginToPay()) {
                f();
            } else {
                cleverapps.social.checkConnection(f, stop.bind(this, "ProductLoginNeeded"));
            }
        }.bind(this),

        function (f, stop) {
            if (cleverapps.synchronizer._syncIn.needShowReloadWindow()) {
                stop();
            } else {
                f();
            }
        },

        function (f, stop) {
            cleverapps.payments.setPurchaseState(PaymentsManager.STATE_EMAIL);

            var email = cleverapps.info.getValue("email");
            if (!cleverapps.payments.requiresEmailToPay() || cleverapps.validateEmail(email)) {
                f();
            } else {
                new EmailWindow(f, stop.bind(this, "ProductEmailNeeded"));
            }
        }.bind(this),

        function (f) {
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.PRODUCT.OPEN);
            overlay = new PaymentOverlay();
            cleverapps.scenes.getRunningScene().addChild(overlay);

            f();
        },

        function (f, stop) {
            console.log("PaymentsManager purchase start", product.loadedId, product.key);

            cleverapps.payments.setPurchaseState(PaymentsManager.STATE_PURCHASE);

            product.openTime = Date.now();

            cleverapps.payments.purchase(product, cleverapps.once(function (code, purchaseInfo) {
                console.log("PaymentsManager purchase result", product.loadedId, product.key, code);
                console.log("PaymentsManager purchase purchaseInfo", JSON.stringify(purchaseInfo, cleverapps.cutStringsReplacer));

                if (cleverapps.config.debugMode && cleverapps.Tool.restoreCheck) {
                    code = Product.RESTORE_CHECK;
                }

                if (code === cleverapps.CODE_SUCCEED && !player.isRunning()) {
                    cleverapps.timeouts.setTimeout(function () {
                        this.restoreThrottled();
                    }.bind(this), 15000);
                    return;
                }

                if (code !== cleverapps.CODE_SUCCEED) {
                    stop(code);
                    return;
                }

                purchase = purchaseInfo || product;

                if (this.isConsumed(purchase.paymentId)) {
                    this.consume(purchase);
                    stop();
                    return;
                }

                f();
            }.bind(this)));
        }.bind(this),

        function (f, stop) {
            cleverapps.payments.setPurchaseState(PaymentsManager.STATE_VALIDATE);

            console.log("PaymentsManager validate start", product.loadedId, product.key);

            cleverapps.payments.validate(purchase, function (code) {
                console.log("PaymentsManager validate result", product.loadedId, product.key, code);

                if (code !== cleverapps.CODE_SUCCEED) {
                    this.consume(purchase);
                    stop(code);
                    return;
                }

                f();
            }.bind(this));
        }.bind(this)
    ]);

    player.onComplete(function () {
        console.log("PaymentsManager purchase complete", product.loadedId, product.key);

        overlay && overlay.removeFromParent();
        cleverapps.payments.setPurchaseState(undefined);
    });

    player.onSuccess(function () {
        console.log("PaymentsManager purchase success", product.loadedId, product.key);

        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.PRODUCT.SUCCESS);

        this.logPurchase(product, purchase);
        product.onBuyed(options);
        this.consume(purchase);

        callback(true, product);
    }.bind(this));

    player.onFailure(function (code) {
        console.log("PaymentsManager purchase failure", product.loadedId, product.key);

        code = code || cleverapps.CODE_FAILED;

        if ([Product.PENDING_PURCHASE, Product.TIMEOUT_CANCEL, Product.RESTORE_CHECK].includes(code)) {
            console.log(code + " - " + product.itemId);
        } else {
            var notification = Messages.has(code) ? code : "Product.PurchaseCancelled";
            cleverapps.notification.create(notification);
        }

        callback(false, code);
    });

    player.play();
};

PaymentsManager.prototype.isPurchaseRunning = function () {
    return this.purchasePlayer && this.purchasePlayer.isRunning();
};

PaymentsManager.prototype.isRestoreRunning = function () {
    return this.restorePlayer && this.restorePlayer.isRunning();
};

PaymentsManager.prototype.stopPurchasePlayer = function () {
    if (this.purchasePlayer) {
        this.purchasePlayer.stop();
        delete this.purchasePlayer;
    }
};

PaymentsManager.prototype.logPurchase = function (product, purchase) {
    var info = {
        itemId: product.itemId,
        price: product.price,
        textPrice: product.getCurrentPrice(),
        paymentId: purchase && purchase.paymentId || ""
    };

    if (product.loadedPriceAmount && product.loadedCurrencyCode) {
        info.textPrice = product.loadedPriceAmount + " " + product.loadedCurrencyCode;
    }

    info.price = Math.round(info.price * cleverapps.User.calcPriceCoef() * 100) / 100;

    if (product.type === "subscription") {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.SUBSCRIPTION_BOUGHT, info);
        return;
    }

    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.PAYMENTS, info);

    if (cleverapps.payments.oneOf(YooKassaPayments)) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.YOOKASSA.PAID_COUNT);
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.YOOKASSA.PAID_AMOUNT, {
            value: info.price
        });
    }

    cleverapps.abTest.allLogEvent(cleverapps.EVENTS.STATS.PAYMENTS, {
        value: info.price
    });

    if (cleverapps.travelBook.isExpedition()) {
        if (cleverapps.user.registered > ExpeditionMissionLogic.EXPEDITIONS_LOG_SINCE) {
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.EXPEDITIONS.SPEND + cleverapps.travelBook.getCurrentPage().id, {
                value: info.price * 100
            });
        }

        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.EXPEDITIONS.TOTAL + cleverapps.travelBook.getCurrentPage().id, {
            value: info.price
        });
    }

    if (Game.currentGame && Game.currentGame.level.episode.isBonusWorldLevel() || cleverapps.environment.isBonusWorldScene()) {
        var mission = cleverapps.missionManager.findByType(Mission.TYPE_BONUS_WORLD);
        if (mission) {
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.BONUS_WORLD_PAYMENTS + mission.bonusWorld.type, {
                value: info.price
            });
        }
    }

    cleverapps.paymentsHistory.addPayment(product);

    var transactionId = purchase.transactionId || purchase.paymentId;
    var price = purchase.loadedPriceAmount;
    var currency = purchase.loadedCurrencyCode;

    purchase.state = purchase.restore ? 4 : 2;

    if (!currency || !price) {
        price = info.price;
        currency = "USD";
    }

    if (cleverapps.adjust) {
        cleverapps.adjust.logPurchase(transactionId, price, currency);
    }

    if (cleverapps.adOcean) {
        cleverapps.adOcean.logEvent(AdOcean.EVENT_ACTIVE_PAY, {
            price: price
        });
    }

    if (cleverapps.thinkingData) {
        cleverapps.thinkingData.logPurchase(product, purchase);
    }

    if (cleverapps.gravityEngine) {
        cleverapps.gravityEngine.logPurchase(product, purchase);
    }

    if (cleverapps.firebase && !cleverapps.config.debugMode) {
        cleverapps.firebase.logEvent("purchase", {
            currency: currency,
            value: price,
            transaction_id: transactionId
        });
    }

    if (cleverapps.googleAnalytics) {
        cleverapps.googleAnalytics.logEvent("purchase", {
            currency: currency,
            value: price,
            transaction_id: transactionId,
            items: [{
                item_id: product.itemId,
                item_name: product.title
            }]
        });
    }

    if (cleverapps.platform.oneOf(AndroidPlatform)) {
        cleverapps.platform.callNative("FacebookPlugin.logPurchase", { price: price, currency: currency });
    }

    if (cleverapps.platform.oneOf(Yandex, WortalPlatform, Instant, Samsung, AndroidBase, Apple, Samsung)
        && !cleverapps.payments.oneOf(RestPayments, YooKassaPayments)) {
        cleverapps.RestClient.post("/payments/add/" + cleverapps.platform.source + "/" + encodeURIComponent(cleverapps.platform.getUserID()), Object.assign(info, {
            purchase: purchase
        }));
    }
};

PaymentsManager.prototype.stopLoadProductsPlayer = function () {
    if (this.loadProductsPlayer) {
        this.loadProductsPlayer.stop();
        delete this.loadProductsPlayer;
    }
};

PaymentsManager.prototype.tryLoadProducts = function () {
    if (!cleverapps.platform.isConnected(Platform.PAYMENTS)) {
        return;
    }

    if (this.loadProductsPlayer && this.loadProductsPlayer.isRunning()) {
        return;
    }

    this.loadProductsPlayer = new ActionPlayer({
        actionTimeout: cleverapps.parseInterval("15 seconds"),
        actions: [
            function (f) {
                if (cleverapps.payments.productsLoaded) {
                    f();
                    return;
                }

                cleverapps.payments.loadProducts(function (code) {
                    if (code === cleverapps.CODE_SUCCEED) {
                        cleverapps.payments.productsLoaded = true;

                        this.updateFlags();

                        this.restore();

                        f();
                    }
                }.bind(this));
            }.bind(this),

            function (f) {
                if (cleverapps.payments.subscriptionsLoaded) {
                    f();
                    return;
                }

                cleverapps.payments.loadSubscriptions(function (code) {
                    if (code === cleverapps.CODE_SUCCEED) {
                        cleverapps.payments.subscriptionsLoaded = true;
                        f();
                    }
                });
            },

            function (f) {
                if (cleverapps.payments.subscriptionsTokensLoaded) {
                    f();
                    return;
                }

                cleverapps.payments.loadSubscriptionsTokens(function (code) {
                    if (code === cleverapps.CODE_SUCCEED) {
                        cleverapps.payments.subscriptionsTokensLoaded = true;
                        f();
                    }
                });
            }
        ]
    });

    this.loadProductsPlayer.play();
};

PaymentsManager.STATE_SOCIAL = 1;
PaymentsManager.STATE_EMAIL = 2;
PaymentsManager.STATE_PURCHASE = 3;
PaymentsManager.STATE_VALIDATE = 4;
