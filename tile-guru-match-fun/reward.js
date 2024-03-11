/**
 * Created by r4zi4l on 17.06.2022
 */

var Reward = function (type, value, options) {
    this.type = type;
    this.value = value;
    this.options = options || {};

    if (this.options.onFinish) {
        this.options.onFinish = cleverapps.once(this.options.onFinish);
    }

    if (["unlimitedLives", "worker"].indexOf(this.type) !== -1) {
        this.value = Product.FormatTimePeriod(this.value);
    }
};

Reward.prototype.receiveReward = function () {
    if (this.getAmount()) {
        this.handler = RewardTypes[this.type].handler.call(this, this.value, this.options);
    }
};

Reward.prototype.onAnimationFinished = function () {
    if (this.handler) {
        this.handler();
    }

    if (this.options.onFinish) {
        this.options.onFinish();
    }

    var amount = this.getAmount();
    if (!amount) {
        return;
    }

    var target = cleverapps.aims.getTarget(this.getFlyingTarget());
    if (target.aim.noTargetDelta || target.aim.controls && target.aim.controls.indexOf("MenuBar") === 0) {
        return;
    }

    cleverapps.scenes.getRunningScene().runAction(new cc.CollectEffect(target));

    if (!target.aim.withoutDelta) {
        cleverapps.UI.animateDelta(+amount || 0, {
            x: cleverapps.styles.Reward.sidebarDelta.x,
            y: cleverapps.styles.Reward.sidebarDelta.y,
            font: cleverapps.styles.FONTS.SCENE_ANIMATE_DELTA_TEXT,
            parent: target
        });
    }
};

Reward.prototype.getAmount = function () {
    if (Array.isArray(this.value)) {
        return this.value;
    }
    if (["units", "battlePass", "kraken", "growthFund", "troop"].indexOf(this.type) !== -1) {
        return this.value.amount || 1;
    }
    if (typeof this.value === "object") {
        return this.value.amount || this.value.level || this.value.time || +this.value.subscription || 0;
    }
    return this.value || 0;
};

Reward.prototype.getIcon = function (regular) {
    var styles = cleverapps.styles.Reward;
    var params = {};

    if (this.options.icons && this.options.icons[this.type] && !regular) {
        params.frame = this.options.icons[this.type];
    } else if (this.type === "mission") {
        var missionType = Mission.ParseCompoundType(this.value.missionType).type;
        params.frame = RewardTypes[this.type].icon[missionType] || Mission.getCollectIcon(missionType);
    } else if (this.type === "boosters") {
        params.frame = RewardTypes.boosters.icon[this.value.id];
    } else if (this.type === "battlePass") {
        params.json = bundles.passbuyticket_window.jsons[this.value.missionType === Mission.TYPE_SALEPASS ? "purchase_ticket_json" : "ticket_json"];
        params.animation = "animation";
    } else if (this.type === "units") {
        params.unit = this.value;
    } else if (this.type === "herolevels") {
        params.json = bundles.heroes.jsons[this.value.color.toUpperCase() + "_hero_spine_json"];
        params.scale = 1.5;
        params.skin = match3.heroes.getCurrentSkin();
        params.animation = "idle";
    } else if (this.type === "piggyBank") {
        params.frame = bundles.piggy_bank_reward.frames.piggy_bank_reward_icon;
    } else if (this.type === "clover" && Game.currentGame && Game.currentGame.secondaryMission) {
        params.frame = Game.currentGame.secondaryMission.getIcon();
    } else if (this.type === "cup") {
        params.frame = RewardTypes[this.type].icon[this.value.type];
    } else if (this.type === "keys") {
        params.key = this.value;
    } else if (this.type === "troop") {
        params.troop = this.value;
    } else if (this.type === "simpleStar" || this.type === "homeStar") {
        params.frame = bundles.reward_icons.frames.simple_star_png;
    } else {
        params.frame = RewardTypes[this.type].icon;
    }

    var icon;

    if (params.troop) {
        icon = WarriorView.getUnitImage(WarriorLines[params.troop.code], params.troop.stage);
    } else if (params.unit) {
        icon = UnitView.getUnitImage(params.unit, { alignAnchorX: true, preferStatic: true });
        cleverapps.UI.fitToBox(icon, styles.icon);
    } else if (params.json) {
        icon = new cleverapps.Spine(params.json, params.scale || 1);
        icon.setAnimation(0, params.animation, true);

        if (params.skin) {
            icon.setSkin(params.skin);
        }
    } else if (params.frame) {
        icon = new cc.Sprite(params.frame);
    } else if (params.key) {
        icon = new QuestItemView(params.key, true);
    } else {
        cleverapps.throwAsync("Reward icon is undefined - " + this.type);
        icon = new cc.Node();
    }

    return icon;
};

Reward.prototype.getSmallIcon = function (regular) {
    var styles = cleverapps.styles.Reward;
    var params = {};

    if (this.options.icons && this.options.icons[this.type] && !regular) {
        params.frame = this.options.icons[this.type];
    } else if (this.type === "boosters") {
        params.frame = RewardTypes.boosters.smallIcon[this.value.id];
    } else if (this.type === "mission") {
        params.frame = RewardTypes.mission.smallIcon[Mission.ParseCompoundType(this.value.missionType).type];
    } else if (this.type === "cup") {
        params.frame = RewardTypes[this.type].smallIcon[this.value.type];
    } else {
        params.frame = RewardTypes[this.type].smallIcon;
    }

    var icon;

    if (params.frame) {
        icon = new cc.Sprite(params.frame);
    } else {
        icon = this.getIcon(regular);
    }

    cleverapps.UI.fitToBox(icon, styles.smallIcon);

    return icon;
};

Reward.prototype.getFlyingAmount = function () {
    var amount = this.getAmount();

    if (["unlimitedLives", "worker"].indexOf(this.type) !== -1) {
        return 1;
    }

    if (this.type === "wands") {
        if (amount <= 3) {
            return amount;
        }
        return Math.min(5, Math.floor(amount / 50) + 3);
    }

    if (this.type === "energy") {
        return Math.min(5, Math.floor(amount / 5) + 1);
    }

    if (this.type === "mission") {
        if (this.value.missionType === Mission.TYPE_KRAKENFEAST) {
            return Math.min(3, amount);
        }
        if (this.value.missionType === Mission.TYPE_SOFTFEAST) {
            if (amount >= 500) {
                return 4;
            }
            if (amount >= 150) {
                return 3;
            }
            if (amount) {
                return 2;
            }
        }
        if (this.value.missionType === Mission.TYPE_LIVESFEAST) {
            if (amount >= 20) {
                return 3;
            }
            if (amount >= 10) {
                return 2;
            }
            if (amount) {
                return 1;
            }
        }
    }

    if (amount >= 100) {
        return 8;
    }
    if (amount >= 50) {
        return 5;
    }
    if (amount >= 3) {
        return 3;
    }
    return amount;
};

Reward.prototype.getFlyingTarget = function () {
    if (this.options.target) {
        return this.options.target;
    }

    if (this.type === "boosters") {
        return "boosters" + this.value.id;
    }

    if (this.type === "mission") {
        return cleverapps.resolution.mode !== cleverapps.WideMode.VERTICAL ? "mission" + this.value.missionType : undefined;
    }

    if (this.type === "clover") {
        return cleverapps.resolution.mode !== cleverapps.WideMode.VERTICAL ? "mission" + Game.currentGame.secondaryMission.type : undefined;
    }

    if (this.type === "units" && this.options.toMainWorld) {
        return "mainWorld";
    }

    if (this.type === "cup") {
        return "cup" + this.value.type;
    }

    if (this.type === "gold" || this.type === "rubies") {
        return "hard";
    }

    if (this.type === "coins") {
        return "soft";
    }

    if (this.type === "unlimitedLives" || this.type === "energy") {
        return "lives";
    }

    return this.type;
};

Reward.prototype.getText = function (prefix) {
    if (this.type === "unlimitedLives") {
        return this.value.title;
    }

    if (this.type === "battlePass") {
        return "PassProduct.Title";
    }

    if (this.type === "worker") {
        return this.value.subscription ? prefix + (this.value.amount || 1) : Messages.get(this.value.title, { amount: this.value.time });
    }

    if (this.type === "growthFund") {
        return "Shop.growthFund.title";
    }

    if (this.type === "piggyBank" && cleverapps.piggyBank.isFull()) {
        return "VictoryWindowBase.piggyBankFull";
    }

    var text = prefix ? String(prefix) : "";

    if (this.type === "boosters" || this.type === "keys" || this.type === "randomBoosters" || this.type === "mission") {
        text += this.value.amount;
    } else if (this.type === "units") {
        text += this.value.amount || 1;
    } else if (this.type === "troop") {
        text += this.value.amount || 1;
    } else if (this.type === "herolevels") {
        text += Math.max(0, Math.min(Heroes.HEROES_MAX_LEVEL, this.value.level));
    } else if (Array.isArray(this.value)) {
        text += this.value.join("-");
    } else if (this.type === "kraken") {
        text += "3";
    } else {
        text += this.value;
    }

    return text;
};

Reward.prototype.listControls = function () {
    return cleverapps.toArray(RewardTypes[this.type].controls) || [];
};

Reward.prototype.listBundles = function () {
    return cleverapps.toArray(RewardTypes[this.type].bundle) || [];
};

Reward.prototype.collectRewardsAnimation = function (source, options) {
    options = options || {};

    var amount = this.getAmount();
    if (!amount) {
        return;
    }

    var scene = cleverapps.scenes.getRunningScene();
    var targetType = this.getFlyingTarget();
    var target = cleverapps.aims.getTarget(targetType);

    if (!options.sound) {
        if (this.type === "mission" && this.value.missionType === Mission.TYPE_SOFTFEAST) {
            options.sound = bundles.menubar.urls.coins_effect;
        } else if (["hard", "soft", "exp", "worker", "wands"].indexOf(targetType) === -1) {
            options.sound = bundles.menubar.urls.exp_fly_finish_effect;
        }
    }

    var flyingAnimation = Reward.COLLECT_ANIMATION;
    if (options.flyingAnimation) {
        flyingAnimation = options.flyingAnimation;
    } else if (RewardTypes[this.type].flyingAnimation) {
        flyingAnimation = RewardTypes[this.type].flyingAnimation;
    } else if (target.aim.flyingAnimation) {
        flyingAnimation = target.aim.flyingAnimation;
    }

    var flyAction, collectAction;

    if (source) {
        switch (flyingAnimation) {
            case Reward.SPAWN_UNITS_ANIMATION:
                flyAction = this.spawnUnitsAnimation(this.spawnedUnits, source);
                break;

            case Reward.SPAWN_CARDS_ANIMATION:
                flyAction = this.spawnCardsAnimation(this.spawnedCards, source, target);
                break;

            case Reward.JUMP_COLLECT_ANIMATION:
                flyAction = this.jumpCollectAnimation(source, target, options);
                break;

            case Reward.COLLECT_ANIMATION:
                flyAction = this.collectAnimation(source, target, options);
                break;
        }
    }

    collectAction = new cc.CallFunc(this.onAnimationFinished.bind(this));

    if (flyAction) {
        collectAction = new cc.Sequence(flyAction, collectAction);
    }

    if (target.aim.scrollsToTarget && target.aim.scrollsToTarget()) {
        collectAction = new cc.Spawn(
            collectAction,
            new cc.TargetedAction(scene.scroll, new cc.ScrollAction(target, {
                skipFocusReport: true,
                duration: 1,
                visibleBox: {
                    left: 0.4,
                    right: 0.4,
                    top: 0.4,
                    bottom: 0.4
                }
            }))
        );
    }

    scene.runAction(new cc.Sequence(
        new cc.DelayTime((options.delay || 0) / 1000),
        collectAction,
        new cc.CallFunc(options.callback)
    ));
};

Reward.prototype.collectAnimation = function (source, target, options) {
    source = source.onGetView ? source.onGetView() : source;
    if (!source) {
        return;
    }

    source.stopAllActions();

    return new cc.TargetedAction(source, new cc.Sequence(
        cleverapps.UI.animateCollect(source, target, {
            path: options.path,
            adjustToTarget: true,
            sound: options.sound
        }),
        new cc.CallFunc(function () {
            target.aim && target.aim.animate && target.aim.animate();
        }),
        new cc.RemoveSelf()
    ));
};

Reward.prototype.spawnUnitsAnimation = function (spawnedUnits, source) {
    source.replaceParentSamePlace(cleverapps.scenes.getMovingNode(source), {
        keepScale: true
    });

    return new cc.TargetedAction(source, new cc.Sequence(
        new cc.CallFunc(function () {
            Game.currentGame.spawnAction(spawnedUnits, [], source, {
                fromNode: true,
                startScale: source.adjustScaleTo(Game.currentGame.map.getView().animations),
                startAnchors: {
                    anchorX: 0.5,
                    anchorY: 0.5
                }
            });
        }),
        new cc.DelayTime(0.2),
        new cc.Hide(),
        new cc.DelayTime(0.5),
        new cc.RemoveSelf()
    ));
};

Reward.prototype.spawnCardsAnimation = function (spawnedCards, source, target) {
    var scene = cleverapps.scenes.getRunningScene(source);
    var position = scene.convertToNodeSpace(source.parent.convertToWorldSpace(source));

    cleverapps.aims.showTarget(target);

    var actions = [];

    spawnedCards.forEach(function (card) {
        actions.push(new cc.DelayTime(0.3));
        actions.push(new cc.CallFunc(function () {
            cleverapps.aims.showTarget(target);

            var ViewClass = card.getViewClass();
            var view = new ViewClass(card);
            view.setPositionRound(position);
            scene.addChild(view);

            Game.currentGame.hand.push(card, {
                insertIndex: cleverapps.Random.random(Game.currentGame.hand.stack.length)
            });

            cleverapps.audio.playSound(bundles.game.urls.plus_card_effect);
        }));
    });

    return new cc.Sequence(actions);
};

Reward.prototype.jumpCollectAnimation = function (source, target, options) {
    options = options || {};

    var movingNode;
    var startPosition;
    var fromMap2d;
    if (source instanceof cc.Node) {
        movingNode = cleverapps.scenes.getMovingNode(source);
        startPosition = movingNode.convertToNodeSpace(source.parent.convertToWorldSpace(source.getPosition()));
    } else {
        movingNode = Game.currentGame.map.getView().animations;
        startPosition = Game.currentGame.map.getView().alignInIsometricGrid(source.x, source.y);
        fromMap2d = true;
    }

    var styles = cleverapps.styles.Reward.jumpCollect;
    var beginScale = options.beginScale || 0.5;
    var flyingScale = styles.delta.scale;
    var finalScale = options.finalScale || flyingScale;
    var amount = this.getFlyingAmount();

    var actions = [];
    cleverapps.arrayFill(amount).forEach(function (value, index) {
        var item = options.small === false ? this.getIcon(true) : this.getSmallIcon(true);
        var itemBeginScale = item.scale * beginScale;
        var itemFlyingScale = item.scale * flyingScale;
        var itemFinalScale = Math.min(target.getGlobalBoundingBox().width / item.width, finalScale);

        item.setScale(itemBeginScale);
        item.setPositionRound(startPosition);
        movingNode.addChild(item);

        item.setLocalZOrder(1 / (1 + index));
        item.setVisible(false);

        actions.push(new cc.TargetedAction(item, new cc.Sequence(
            new cc.DelayTime(index * 0.1 + Math.random() * 0.1),
            new cc.Show(),
            new cc.CallFunc(function () {
                if (options.hideSource) {
                    source.setVisible(false);
                }
            }),
            cleverapps.UI.animateJumpCollect(item, target, {
                collectMovingNode: fromMap2d && cleverapps.windows.isActive() && movingNode,
                jumpScale: itemFlyingScale,
                jumpOffset: index / amount,
                collectScale: itemFinalScale,
                collectSound: options.sound
            }),
            new cc.CallFunc(function () {
                cleverapps.aims.showTarget(target);
                target.aim && target.aim.animate && target.aim.animate();
            }),
            new cc.RemoveSelf()
        )));
    }.bind(this));

    return new cc.Sequence(
        new cc.Spawn(actions),
        new cc.CallFunc(function () {
            if (fromMap2d && !options.withoutDelta) {
                var deltaIcon = this.getSmallIcon();
                deltaIcon.setScale(deltaIcon.scale * flyingScale);
                cleverapps.UI.animateDelta(amount, {
                    icon: deltaIcon,
                    x: startPosition.x,
                    y: startPosition.y + styles.delta.dy + (options.deltaOffset || 0),
                    parent: movingNode,
                    font: cleverapps.styles.FONTS.SCENE_ANIMATE_DELTA_TEXT
                });
            }
        }.bind(this))
    );
};

Reward.prototype.isFlyingUnderShadow = function () {
    var target = cleverapps.aims.getTarget(this.getFlyingTarget());
    return target && target.aim && target.aim.flyingUnderShadow;
};

Reward.NO_ANIMATION = 1;
Reward.COLLECT_ANIMATION = 2;
Reward.SPAWN_UNITS_ANIMATION = 3;
Reward.SPAWN_CARDS_ANIMATION = 4;
Reward.JUMP_COLLECT_ANIMATION = 5;

cleverapps.styles.Reward = {
    sidebarDelta: {
        x: { align: "center" },
        y: { align: "center", dy: 75 }
    },

    icon: {
        height: 130,
        maxScale: 1.5
    },

    smallIcon: {
        height: 70
    },

    jumpCollect: {
        delta: {
            dy: 80,
            scale: 0.8
        },

        jumpRight: {
            x1: 50,
            x2: 150,
            y1: -50,
            y2: -100
        },

        jumpLeft: {
            x1: -50,
            x2: -150,
            y1: -50,
            y2: -100
        },

        jumpBoth: {
            x1: -50,
            x2: 50,
            y1: -50,
            y2: -100
        }
    },

    flyHint: {
        speed: 3000
    }
};
