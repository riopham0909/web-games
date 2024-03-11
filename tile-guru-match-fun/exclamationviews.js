/**
 * @author Spepa
 */
var ExclamationViewBase = cc.Node.extend({
    ctor: function () {
        this._super();
        var styles = this.getStyles();
        this.setAnchorPoint2();
        this.setContentSize2(styles);

        if (styles.scale) {
            this.setScale(styles.scale[cleverapps.resolution.mode]);
        }

        cleverapps.exclamation.on("show", cleverapps.throttle(1000, this.showMessage.bind(this)), this);
        cleverapps.exclamation.on("hide", this.hideMessage.bind(this), this);
    },

    showMessage: function (message, type) {
        var sound = message === "message.Shuffle" ? bundles.exclamations.urls.shuffle_effect : bundles.exclamations.urls.keep_going_effect;
        var animation = "keep_going_letsgo";
        var font = cleverapps.styles.FONTS.MESSAGE_TEXT_NORMAL;

        switch (type) {
            case Exclamation.Types.Warning:
                animation = "5_moves_left";
                sound = bundles.exclamations.urls.five_moves_effect;
                font = cleverapps.styles.FONTS.MESSAGE_TEXT_WARNING;
                break;

            case Exclamation.Types.Congrats:
                animation = "you_win";
                sound = bundles.main.urls.beat_friend_effect;
                font = cleverapps.styles.FONTS.MESSAGE_TEXT_CONGRATS;
                break;
        }

        this.runActions(message, font, sound, animation);
    },

    hideMessage: function () {
        this.setVisible(false);
    },

    runActions: function (message, font, sound, animation) {
        this.createAnimation(animation);
        this.createMsg(message, font);
        this.playSound(sound);
    },

    playSound: function (sound) {
        if (sound) {
            var delay = this.getStyles().sound ? this.getStyles().sound.delay : 0;
            this.runAction(new cc.Sequence(
                new cc.DelayTime(delay),
                new cc.CallFunc(function () {
                    cleverapps.audio.playSound(sound);
                })
            ));
        }
    },

    createMsg: function (message, font) {
        var text = this.createText(message, font);

        text.opacity = 0;
        text.runAction(new cc.Sequence(
            new cc.DelayTime(0.2),
            new cc.FadeIn(0.2),
            new cc.Spawn(
                new cc.MoveBy(0.1, 0, -2),
                new cc.ScaleTo(0.1, 1, 0.9)
            ),
            new cc.ScaleTo(0.25, 1, 1),
            new cc.DelayTime(0.3),
            new cc.FadeOut(0.2),
            new cc.RemoveSelf()
        ));
    },

    createText: function (message, font) {
        var msg = cleverapps.UI.LabelTTF.GetLocalizedText(message);
        var text = cleverapps.UI.generateTTFText(message, font);
        if (msg.indexOf(" ") !== -1) {
            text.setDimensions(this.width, 0);
        } else {
            text.fitTo(this.width);
        }
        text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        text.setPositionRound(this.width / 2, this.height / 2);
        this.addChild(text);

        return text;
    },

    createAnimation: function (animation) {
        if (!this.animation) {
            this.animation = new cleverapps.Spine(bundles.exclamations.jsons.exclamations_json);
            this.animation.setPositionRound(this.width / 2, this.height / 2);
            this.addChild(this.animation);
        }
        this.animation.setAnimation(0, animation, false);
    },

    getStyles: function () {
        return cleverapps.styles.Exclamations.base;
    }
});

ExclamationViewBase.Create = function () {
    if (["heroes", "runes"].indexOf(cleverapps.config.name) !== -1) {
        return new ExclamationViewHeroes();
    } if (["board", "solitaire", "differences"].indexOf(cleverapps.config.type) !== -1) {
        return new ExclamationViewWords();
    } if (["adventure"].indexOf(cleverapps.config.name) !== -1) {
        return new ExclamationViewActor();
    }

    return new ExclamationViewBase();
};

var ExclamationViewHeroes = ExclamationViewBase.extend({
    getStyles: function () {
        return cleverapps.styles.Exclamations.heroes;
    },

    showMessage: function (message, type) {
        var styles = this.getStyles();
        var sound = message === "message.YouWin" ? bundles.main.urls.sound_win_effect : bundles.exclamations.urls.keep_going_effect;

        var font = cleverapps.styles.FONTS.CONGRATS_MESSAGE_FONT;
        var fontColor = styles[message];
        if (fontColor) {
            font.color = fontColor.color;
        } else if (type === Exclamation.Types.Warning) {
            font.color = styles.warning.color;
        } else {
            font.color = styles.default.color;
        }

        var animation = "lets_go";
        if (cleverapps.exclamation.getCongratulations().indexOf(message) !== -1) {
            sound = bundles.game.urls[message + "_effect"];
            animation = message;
            message = "message." + message;
        } else if (message === "message.KeepGoing") {
            sound = bundles.exclamations.urls.go_on_effect;
        } else if (message === "message.Shuffle") {
            animation = "shuffle";
            sound = bundles.exclamations.urls.shuffle_effect;
        }

        this.runActions(message, font, sound, animation);
    },

    createMsg: function (message, font) {
        var text = this.createText(message, font);
        text.setRotation(10);

        var textScale = 1;
        text.setScale(0.1);
        text.setVisible(false);

        text.runAction(new cc.Sequence(
            new cc.DelayTime(0.2),
            new cc.Show(),
            new cc.ScaleTo(0.3, textScale).easing(cc.easeInOut(3)),
            new cc.DelayTime(0.55),
            new cc.ScaleTo(0.3, 0.1 * textScale),
            new cc.RemoveSelf()
        ));
    }
});

var ExclamationViewWords = ExclamationViewBase.extend({
    getStyles: function () {
        return cleverapps.styles.Exclamations.base;
    },

    showMessage: function (message) {
        this.runActions(message, undefined, undefined, "animation");
    },

    createMsg: function (message) {
        message = Messages.getLocalized(message);
        var lines = this.splitTextToLines(message);
        var lineNodes = lines.map(this.createLine.bind(this));

        var entireNode = new cleverapps.Layout(lineNodes, {
            direction: cleverapps.UI.VERTICAL,
            margin: lineNodes.length && lineNodes[0].height / 10 || 0
        });

        entireNode.setCascadeOpacityEnabled(true);
        entireNode.setOpacity(0);
        entireNode.setScale(0);
        entireNode.setPositionRound(this.width / 2, this.height / 2);
        this.addChild(entireNode);

        var scale = 1.0;
        var scene = cleverapps.scenes.getRunningScene();
        if (entireNode.width > scene.width) {
            scale = scene.width / (entireNode.width * 1.2);
        }

        this.setVisible(true);
        this.stopAllActions();
        this.runAction(new cc.Sequence(
            new cc.DelayTime(1.4),
            new cc.Hide()
        ));

        entireNode.runAction(
            new cc.Spawn(
                new cc.FadeIn(0.25),
                new cc.Sequence(
                    new cc.ScaleTo(0.2, 1.4 * scale, 1.4 * scale),
                    new cc.ScaleTo(0.2, 0.8 * scale, 0.8 * scale),
                    new cc.ScaleTo(1.0, scale, scale)
                ),
                new cc.Sequence(
                    new cc.DelayTime(1.2),
                    new cc.FadeOut(0.2),
                    new cc.RemoveSelf()
                )
            )
        );
    },

    createLine: function (line) {
        var node = new cc.Node();
        node.setAnchorPoint(0.5, 0.5);
        var width = 0, height = 0;

        var blocks = this.splitLineToBlocks(line);
        for (var index = 0; index < blocks.length; index++) {
            var letter = cleverapps.UI.generateOnlyText(blocks[index], cleverapps.styles.FONTS.CONGRATE_TEXT);
            node.addChild(letter);

            var dist = Math.abs(index - blocks.length / 2);
            var scale = 1 - 0.2 / blocks.length * dist;
            var duration = 0.2 + 0.6 / blocks.length * dist;
            var letterWidth = blocks[index] !== " " ? letter.width : cleverapps.styles.Exclamations.spaceWidth;
            letter.setPosition(width + letterWidth * scale / 2, letter.height / 2);
            width += letterWidth * scale;
            height = Math.max(height, letter.height);

            letter.setScale(0);
            letter.runAction(new cc.Sequence(
                new cc.ScaleTo(duration, 1.36),
                new cc.ScaleTo(0.13, scale)
            ));
        }

        node.setContentSize(width, height);
        node.setCascadeOpacityEnabled(true);

        return node;
    },

    splitTextToLines: function (text) {
        var maxLength = 16;

        if (!text) {
            return [];
        }

        var index = text.indexOf(" ");
        if (text.length <= maxLength || index === -1) {
            return [text];
        }

        var pos = text.substr(0, maxLength).lastIndexOf(" ");
        if (pos === -1) {
            pos = index;
        }

        var lines = [text.substr(0, pos)];
        lines = lines.concat(text.substr(pos + 1).trim());
        return lines;
    },

    splitLineToBlocks: function (text) {
        var chars = text.split("");
        if (chars.length <= 6) {
            return chars;
        }

        var centerBlock = chars.slice(3, chars.length - 3).join("");
        if (centerBlock.startsWith(" ")) {
            centerBlock = [" ", centerBlock];
        } else if (centerBlock.endsWith(" ")) {
            centerBlock = [centerBlock, " "];
        }
        return chars.slice(0, 3).concat(centerBlock).concat(chars.slice(chars.length - 3, chars.length));
    }
});

var ExclamationViewActor = ExclamationViewWords.extend({
    getStyles: function () {
        return cleverapps.styles.Exclamations.actor;
    },

    showMessage: function (message) {
        var sound = bundles.exclamations.urls.exclamation_alert_effect;

        if (cleverapps.exclamation.getCongratulations().indexOf(message) !== -1) {
            var attack = cleverapps.Random.mathChoose(this.getStyles().actorActions);
            sound = attack.sound;

            cleverapps.scenes.getRunningScene().actor.animate(attack.animation, { noSFX: true });
        } else if (message === "message.YouWin") {
            sound = bundles.exclamations.urls.exclamation_win_effect;
        } else if (message === "message.Shuffle") {
            sound = bundles.exclamations.urls.shuffle_effect;
        }

        this.runActions(message, undefined, sound, "animation");
    }
});

cleverapps.overrideColors(cleverapps.styles.COLORS, {
    CONGRATS_RED: new cc.Color(255, 35, 60, 255),
    CONGRATS_LIGHT_GREEN: new cc.Color(182, 248, 68, 255),
    CONGRATS_BLUE: new cc.Color(0, 177, 249, 255),
    CONGRATS_ORANGE: new cc.Color(233, 117, 38, 255),
    CONGRATS_PURPLE: new cc.Color(194, 11, 227, 255),
    CONGRATS_GREEN: new cc.Color(0, 209, 121, 255),
    CONGRATS_DARK_RED: new cc.Color(241, 15, 51, 255)
});

cleverapps.styles.Exclamations = {
    base: {
        width: 650,
        height: 200
    },
    spaceWidth: 40
};

cleverapps.styles.Exclamations.heroes = cleverapps.overrideStyles(cleverapps.styles.Exclamations.base, {
    width: 760,
    scale: [0.8, 1, 1],
    sound: { delay: 0.6 },

    default: {
        color: cleverapps.styles.COLORS.CONGRATS_BLUE
    },
    warning: {
        color: cleverapps.styles.COLORS.CONGRATS_DARK_RED
    },
    yeah: {
        color: cleverapps.styles.COLORS.CONGRATS_RED
    },
    super: {
        color: cleverapps.styles.COLORS.CONGRATS_LIGHT_GREEN
    },
    yay: {
        color: cleverapps.styles.COLORS.CONGRATS_BLUE
    },
    lets_go: {
        color: cleverapps.styles.COLORS.CONGRATS_ORANGE
    },
    ohyeah: {
        color: cleverapps.styles.COLORS.CONGRATS_PURPLE
    },
    oh: {
        color: cleverapps.styles.COLORS.CONGRATS_GREEN
    },
    wow: {
        color: cleverapps.styles.COLORS.CONGRATS_DARK_RED
    }
}, true);

cleverapps.styles.Exclamations.actor = cleverapps.overrideStyles(cleverapps.styles.Exclamations.base, {
    actorActions: [
        {
            animation: Actor.ANIMATIONS.ATTACK1,
            sound: bundles.game.urls.sc_welldone
        },
        {
            animation: Actor.ANIMATIONS.ATTACK2,
            sound: bundles.game.urls.sc_welldone2
        },
        {
            animation: Actor.ANIMATIONS.ATTACK3,
            sound: bundles.game.urls.sc_welldone3
        }
    ]
}, true);
