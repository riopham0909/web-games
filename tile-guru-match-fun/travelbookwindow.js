/**
 * Created by vladislav on 09.08.2022
 */

var TravelBookWindow = Window.extend({
    onWindowLoaded: function (options) {
        this._super({
            title: "TravelBookWindow.Title",
            name: "travelbookwindow",
            content: this.getContent(),
            styles: cleverapps.styles.TravelBookWindow.window
        });

        if (options && options.targetPage) {
            this.showHint(options.targetPage);
        }
    },

    getContent: function () {
        var styles = cleverapps.styles.TravelBookWindow.content;

        var pageViews = this.pageViews = cleverapps.travelBook.listDisplayedPages().map(function (page) {
            return new ExpeditionPageView(page);
        }, this);

        var content = new cleverapps.Layout(pageViews, {
            direction: cleverapps.UI.HORIZONTAL,
            margin: styles.margin,
            padding: styles.padding
        });

        var wrap = new cc.Node();
        wrap.setAnchorPoint2();
        wrap.setContentSize2(Math.max(styles.width, content.width), content.height);
        wrap.addChild(content);
        content.setPositionRound(styles);

        return wrap;
    },

    showHint: function (targetId) {
        var target = this.pageViews.find(function (pageView) {
            return pageView.page.id === targetId && pageView.page.isActive();
        });

        if (target) {
            target.showHint();
        } else {
            var dialogue;
            this.runAction(new cc.Sequence(
                new cc.DelayTime(0.25),
                new cc.CallFunc(function () {
                    dialogue = this.dialogue = new MinimalDialogue({
                        person: "king",
                        delay: 0,
                        text: "MissionUnavailable",
                        rects: this.getMinimalDialogueRects()
                    });
                    this.addChild(dialogue);
                    dialogue.display();
                }.bind((this))),

                new cc.DelayTime(3),
                new cc.CallFunc(function () {
                    dialogue.remove();
                })
            ));
        }
    },

    listBundles: function () {
        return ["travel_book"];
    }
});

cleverapps.styles.TravelBookWindow = {
    window: {
        padding: {
            left: 24,
            right: 27,
            top: 30,
            bottom: 30
        }
    },

    content: {
        x: { align: "left" },
        y: { align: "center" },
        width: 1300,
        margin: 20,
        padding: {
            x: 60,
            y: 50
        }
    }
};
