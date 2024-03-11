/**
 * Created by slava on 28/3/19
 */

var CurrentEpisodeLabel = cc.Node.extend({
    ctor: function (episode, episodeScene) {
        this._super();
        this.episode = episode;

        this.createContent();

        this.setAnchorPoint2();
        this.setPositionRound({x: {align: 'center'}, y: {align: 'center'}});
        this.setLocalZOrder(1);
    },

    createContent: function () {
        this.bg = this.createBg();

        var label = this.label = new cc.Node();
        label.setAnchorPoint2();
        label.setContentSize2(this.bg.getContentSize());
        label.addChild(this.bg);
        label.setPositionRound(cleverapps.styles.CurrentEpisodeLabel.label.alignment);
        this.addLabelText();

        this.setContentSize2(label.getContentSize());
        this.addChild(this.label);
    },

    createBg: function () {
        var styles = cleverapps.styles.CurrentEpisodeLabel.background;
        var bg;
        if (styles.json) {
            bg = new cc.Node();
            bg.setAnchorPoint2();
            bg.setContentSize2(styles);

            var animation = this.bgAnimation = new cleverapps.Spine(styles.json);
            animation.setAnimation(0, 'idle', false);
            animation.setPosition(bg.width / 2, bg.height / 2);
            bg.addChild(animation);
        } else {
            bg = cleverapps.UI.createScale9Sprite(styles.image, cleverapps.UI.Scale9Rect.TwoPixelXY);
            if (styles.width) {
                bg.setContentSize2(styles);
            }
        }
        bg.setPosition(bg.width / 2, bg.height / 2);
        return bg;
    },

    addLabelText: function () {
        var styles = cleverapps.styles.CurrentEpisodeLabel.label.islandText;
        var labelText = this.labelText = cleverapps.UI.generateTTFText('StartEpisodeWindow.Title' + this.episode.episodeNo, styles.font);
        labelText.fitTo(this.bg.width + styles.padding);
        labelText.setPositionRound(styles.alignment);
        this.label.addChild(labelText);
    },

    addLevelsLabel: function () {
        var styles = cleverapps.styles.CurrentEpisodeLabel.label.levelsText;
        if (!styles) {
            return;
        }

        var passed = this.episode.levels.filter(function(level) {
            return level.type === Episode.LEVEL_TYPE_PASSED;
        }).length;
        var all = this.episode.levels.length;

        var labelText = cleverapps.UI.generateTTFText(passed + '/' + all, styles.font);
        labelText.setPositionRound(styles.alignment);
        this.label.addChild(labelText);
    }
});