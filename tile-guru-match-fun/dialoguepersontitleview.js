/**
 * Created by Andrey Popov on 3/17/21.
 */

var DialoguePersonTitleView = cc.Scale9Sprite.extend({
    ctor: function () {
        var styles = cleverapps.styles.DialoguePersonTitleView;

        this._super(styles.image, cleverapps.UI.getScale9Rect(styles.image, cleverapps.UI.Scale9Rect.TwoPixelXY));

        this.originalSize = this.getContentSize();

        var titleText = this.titleText = cleverapps.UI.generateOnlyText("", cleverapps.styles.FONTS.DIALOGUE_PERSON_TITLE_TEXT);
        titleText.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.addChild(titleText);

        this.setAnchorPoint2();
        this.setCascadeOpacityEnabled(true);
        this.setVisible(false);
    },

    updateString: function (title) {
        var styles = cleverapps.styles.DialoguePersonTitleView.text;
        var titleText = this.titleText;

        titleText.setString(title);
        titleText.setFontSize(cleverapps.styles.FONTS.DIALOGUE_PERSON_TITLE_TEXT.size);

        this.setContentSize2(
            Math.max(titleText.width + styles.padding.x * 2, this.originalSize.width),
            Math.max(titleText.height + styles.padding.y * 2, this.originalSize.height)
        );

        titleText.setPositionRound(this.width / 2, this.height / 2 + styles.offset.y);
    },

    updatePersonPosition: function (personPosition) {
        var styles = cleverapps.styles.DialoguePersonTitleView;
        var x = personPosition.x;
        var offsetX = styles.offsetX;
        if (x - this.width * this.scale / 2 - offsetX < 0) {
            x = this.width * this.scale / 2 + offsetX;
        }

        if (x + this.width * this.scale / 2 + offsetX > this.parent.baseContentSize.width) {
            x = this.parent.baseContentSize.width - this.width * this.scale / 2 - offsetX;
        }

        this.setPositionRound(x, cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL ? styles.mobileY : styles.y);
    },

    updateSize: function () {
        this.setScale(cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL ? 0.6 : 1);
    },

    updatePosition: function () {
        if (this.personView) {
            var personPosition = this.parent.convertToNodeSpace(this.personView.parent.convertToWorldSpace(this.personView.getPosition()));
            this.personView && this.updatePersonPosition(personPosition);
        }
    },

    update: function (title, personView, callback) {
        this.personView = personView;
        var personPosition = this.parent.convertToNodeSpace(personView.parent.convertToWorldSpace(personView.basePosition));
        if (!this.visible) {
            this.updateString(title);
            this.updateSize();
            this.updatePersonPosition(personPosition);
            this.setVisible(true);
            callback();
        } else if (this.orientation !== personView.getOrientation() || this.title !== title) {
            this.runAction(new cc.Sequence(
                new cc.FadeOut(0.2),
                new cc.CallFunc(function () {
                    this.updateString(title);
                    this.updateSize();
                    this.updatePersonPosition(personPosition);
                    callback();
                }.bind(this)),
                new cc.FadeIn(0.2)
            ));
        }

        this.orientation = personView.getOrientation();
        this.title = title;
    },

    hide: function () {
        if (this.visible) {
            this.runAction(new cc.Sequence(
                new cc.FadeOut(0.2),
                new cc.CallFunc(function () {
                    this.setVisible(false);
                    delete this.personView;
                }.bind(this))
            ));
        }
    }
});

cleverapps.styles.DialoguePersonTitleView = {
    image: bundles.dialogues.frames.dialogue_name,
    offsetX: 0,
    y: { align: "top", anchor: "center", dy: 0 },
    mobileY: { align: "top", anchor: "center", dy: 0 },
    text: {
        padding: {
            x: 5,
            y: 0
        },
        offset: { y: -3 }
    }
};
