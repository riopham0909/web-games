/**
 * Created by r4zi4l on 04.05.2022
 */

var OfferManager = function () {
    this.offers = {};

    cleverapps.flags.on("change:videoAdsMainMonetization", this.refreshProductOffers.bind(this));
};

OfferManager.prototype.initialize = function () {
    this.inited = true;

    this.refreshAll();
};

OfferManager.prototype.refreshAll = function () {
    for (var name in Offers.TYPES) {
        this.refreshOffer(Offers.TYPES[name]);
    }
};

OfferManager.prototype.refreshProductOffers = function () {
    for (var name in Offers.TYPES) {
        var offerType = Offers.TYPES[name];

        if (Offers[offerType] && Offers[offerType].product) {
            this.refreshOffer(offerType);
        }
    }
};

OfferManager.prototype.refreshOffer = function (offerType) {
    if (!Offers[offerType]) {
        return;
    }

    if (this.isOfferAvailable(offerType)) {
        if (!this.offers[offerType]) {
            this.addOffer(offerType);
        }
    } else if (this.offers[offerType]) {
        this.removeOffer(offerType);
    }
};

OfferManager.prototype.refreshByMission = function (missionType) {
    var offer = Offers.offerByMission[missionType] || Offers.offerByMission[Mission.GetChildType(missionType)];
    if (offer) {
        this.refreshOffer(offer.type);
    }
};

OfferManager.prototype.refreshByHero = function (unit) {
    var offer = Offers.offerByHero[Unit.GetKey(unit)];
    if (offer) {
        this.refreshOffer(offer.type);
    }
};

OfferManager.prototype.refreshByFog = function (fog) {
    var offers = Offers.offersByFog[fog];
    if (offers) {
        offers.forEach(function (offer) {
            this.refreshOffer(offer.type);
        }.bind(this));
    }
};

OfferManager.prototype.clearForceByMission = function (missionType) {
    if (Offers.offerByMission[missionType] && Offers.offerByMission[missionType].force) {
        cleverapps.forces.clearForce(Offers.offerByMission[missionType].force.id);
    }
};

OfferManager.prototype.addOffer = function (offerType) {
    var offer = new Offer(offerType);
    this.offers[offerType] = offer;

    var icon = new OfferIcon(offer);
    cleverapps.sideBar.addTemporaryIcon(icon);
};

OfferManager.prototype.removeOffer = function (offerType) {
    delete this.offers[offerType];

    var icon = cleverapps.sideBar.findOfferIcon(offerType);
    if (icon) {
        cleverapps.sideBar.removeTemporaryIcon(icon);
    }
};

OfferManager.prototype.findOffer = function (options) {
    var product = options.product;
    var mission = options.mission === undefined ? undefined : Mission.GetChildType(options.mission);

    for (var type in this.offers) {
        var offer = this.offers[type];

        if (product !== undefined && product !== offer.product) {
            continue;
        }

        if (mission !== undefined && mission !== offer.mission && options.mission !== offer.mission) {
            continue;
        }

        return offer;
    }
};

OfferManager.prototype.isOfferAvailable = function (offerType) {
    var offerData = Offers[offerType];

    if (!this.inited || !offerData) {
        return false;
    }

    if (offerData.mission) {
        var mission = cleverapps.missionManager.findByType(offerData.mission);
        if (!mission || mission.isCompleted()) {
            return false;
        }
    }

    if (offerData.debugMode && !cleverapps.config.debugMode) {
        return false;
    }

    if (offerData.hero && cleverapps.unitsLibrary.isOpened(offerData.hero)) {
        return false;
    }

    if (offerData.product) {
        if (!cleverapps.payments.isProductExists(offerData.product) || cleverapps.flags.videoAdsMainMonetization) {
            return false;
        }
    }

    if (Missions[offerData.mission].id && (cleverapps.travelBook.getCurrentPage().id !== Missions[offerData.mission].id)) {
        return false;
    }

    var game = Game.currentGame;
    if (offerData.fog && (!game || !game.fogs || !game.fogs.isOpened(offerData.fog))) {
        return false;
    }

    if (offerData.cooldown) {
        var purchaseTime = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.OFFER_PURCHASE_TIME + offerType) || 0;
        if (Date.now() <= purchaseTime + cleverapps.parseInterval(offerData.cooldown)) {
            return false;
        }
    }

    return true;
};
