/**
 * Created by vladislav on 19.05.2020
 */

var WordsListComponent = cc.Node.extend({
    ctor: function (options) {
        this._super();

        this.options = options;

        this.setAnchorPoint2();

        var styles = cleverapps.styles.WordsListComponent;
        var wordWidth = this.options.width - 2 * styles.word.padding.x;
        var wordHeight = styles.word.height;
        var baseWords = this.options.words;
        var minimalWordsAmount = this.options.minimalWordsAmount;

        if (baseWords.length < minimalWordsAmount) {
            var len = minimalWordsAmount - baseWords.length;
            for (var index = 0; index < len; index++) {
                baseWords.push("");
            }
        }

        var words = baseWords.map(function (word) {
            return this.createWord(word, wordWidth, wordHeight);
        }.bind(this));

        var wordsLayout = new cleverapps.GridLayout(words, {
            columns: 2,
            direction: cleverapps.UI.VERTICAL,
            reversed: true,
            margin: styles.words.margin,
            padding: styles.words.padding
        });

        var scroll = this.createScroll(wordsLayout);

        var container = new cc.Node();
        container.setAnchorPoint2();
        container.setContentSize2(scroll.width, this.options.height);
        container.addChild(scroll);

        this.setContentSize2(container.width, container.height + 2 * styles.topPadding);
        this.addChild(container);
        scroll.setPositionRound(this.width / 2, this.height / 2);
        container.setPositionRound(this.width / 2, this.height / 2);

        var bg = new cc.Scale9Sprite(bundles.wordlist.frames.words_border_png);
        bg.setContentSize(wordWidth * 2, Math.min(this.options.height, wordsLayout.height));
        bg.setPositionRound(this.width / 2, this.height / 2);
        container.addChild(bg);
    },

    createWord: function (word, wordWidth, wordHeight) {
        var styles = cleverapps.styles.WordsListComponent;
        var wordNode = new cc.Node();

        wordNode.setAnchorPoint2();
        wordNode.setContentSize2(wordWidth, wordHeight);

        var bg = this.createWordBg(wordWidth, wordHeight);
        wordNode.addChild(bg);
        bg.setPositionRound(wordNode.width / 2, wordNode.height / 2);

        var text = cleverapps.UI.generateOnlyText(word.toUpperCase(), cleverapps.styles.FONTS.WHITE_TEXT);
        wordNode.addChild(text);
        text.setPositionRound(styles.word.text);

        return wordNode;
    },

    createScroll: function (content) {
        var styles = cleverapps.styles.WordsListComponent;
        var scroll = new cleverapps.UI.ScrollView(content, {
            childrenVisibility: cleverapps.UI.ScrollView.CHILDREN_VISIBILITY_FULLCHECK,
            outOfBoundaryScale: false
        });
        scroll.setBarPadding(styles.scroll.barPadding);
        scroll.setContentSize2(this.options.width * 2 + styles.scroll.barPadding.sidePadding, styles.scroll.height);
        scroll.scrollToPercent(100);
        return scroll;
    },

    createWordBg: function (width, height) {
        var padding = cleverapps.styles.WordsListComponent.word.bg.padding;

        var bg = new cc.Scale9Sprite(bundles.wordlist.frames.words_bg_png);
        bg.setContentSize2(width - padding, height - padding);

        return bg;
    }
});

cleverapps.styles.WordsListComponent = {
    word: {
        height: 70,
        padding: {
            x: 25
        },
        text: {
            x: { align: "center" },
            y: { align: "center", dy: -5 }
        },
        bg: {
            padding: 3
        }
    },
    scroll: {
        height: 300,
        padding: {
            x: 30
        },
        barPadding: {
            sidePadding: 20
        }
    },
    words: {
        margin: 200,
        padding: {
            x: 0,
            y: 5
        }
    },
    topPadding: 4
};