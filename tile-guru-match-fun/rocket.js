/**
 * Created by vlad on 24.10.18.
 */

var Rocket = cc.Node.extend({
    ctor: function(startCell, targetCell, settings) {
        this._super();

        this.startCell = startCell;
        this.targetCell = targetCell;

        this.addChild(settings.rocket);

        this.setVisible(false);

        // For "sugar heroes" game we need separate DX,DY in "settings" and cleverapps.styles.Rocket because we must give different positions
        // for rocket start fly in 2 cases:
        // 1) FireworkCellView (dx = -4, dy = 40)         settings changes
        // 2) yellow hero cell view (dx = -20, dy = 0)    cleverapps.styles.Rocket changes
        // yellow hero can't use settings because called from combocellview.shots.rocket and there is no way
        // to pass such parameters only for yellow hero, but not for all elements using rockets (weak interface),
        // the initial problem is that rocket that fly on field must be initially ON rocket that created by cell animation to avoid
        // multiple rockets - they are visible and it is wrong (or anybody should tell designers that all rockets MUST fly from the center of cell)
        var additionalDX = 0;
        if (settings.startDX) {
            additionalDX += settings.startDX;   // settings must be defined because of usage "settings.rocket" above
        }
        if (cleverapps.styles.Rocket.startDX) {
            additionalDX += cleverapps.styles.Rocket.startDX;
        }
    
        var additionalDY = 0;
        if (settings.startDY) {
            additionalDY += settings.startDY;   // settings must be defined because of usage "settings.rocket" above
        }
        if (cleverapps.styles.Rocket.startDY) {
            additionalDY += cleverapps.styles.Rocket.startDY;
        }
         
        this.setPositionRound(BaseCellView.alignInTheGrid(startCell.x, startCell.y));
        this.setPosition(this.getPosition().x + additionalDX, this.getPosition().y + additionalDY);

        this.aim(settings);
    },

    aim: function(settings) {
        this.targetPos = BaseCellView.alignInTheGrid(this.targetCell.x ,this.targetCell.y);
        this.prevPos = this.getPosition();
        this.scheduleUpdate();
        this.animateFly(settings);
    },

    animateFly: function(settings) {
        var styles = cleverapps.styles.Rocket;

        var start = this.getPosition();
        var target = BaseCellView.alignInTheGrid(this.targetCell.x, this.targetCell.y);
        var first = cc.p(start.x, Math.max(start.y, target.y) + styles.flyUp);
        var second = cc.p(target.x, first.y);

        var dy = this.targetCell.y - this.startCell.y;

        if (this.targetCell.y > this.startCell.y && Math.abs(this.targetCell.x - this.startCell.x) <= 1) {
            var offsetX = Math.abs(dy) * cleverapps.styles.BaseCellView.CELL_SIZE_PX;
            if (this.startCell.x < Field.SIZE / 2)
                second.x += offsetX;
            else
                second.x -= offsetX;
        } else if (this.startCell.x === this.targetCell.x && this.startCell.y > this.targetCell.y) {
            var offsetX = Math.abs(dy) * cleverapps.styles.BaseCellView.CELL_SIZE_PX;
            first.y -= offsetX / 2;
            if (this.startCell.x < Field.SIZE / 2)
                first.x += offsetX / 2;
            else
                first.x -= offsetX / 2;
            second = cc.p(first.x, target.y + cleverapps.styles.BaseCellView.CELL_SIZE_PX);
        }

        this.runAction(
            new cc.Sequence(
                new cc.DelayTime(settings.delay),
                new cc.CallFunc(function(){
                    this.setVisible(true);
                    settings.onLaunch();
                }.bind(this)),
                new cc.BezierTo(settings.duration, [first, second, target]).easing(cc.easeIn(1)),
                new cc.CallFunc(function () {
                    this.unscheduleUpdate();

                    settings.onArrive(function() {
                        this.runAction(new cc.RemoveSelf());
                    }.bind(this));
                }.bind(this))
            )
        );
    },

    update: function(dt) {
        this._super(dt);

        this.setRotation(Math.atan2(this.x - this.prevPos.x, this.y - this.prevPos.y) * 180 / Math.PI);

        this.prevPos = this.getPosition();
    }
});

cleverapps.styles.Rocket = {
    flyUp: 150
};