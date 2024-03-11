/**
 * Created by Aleksey Ovsyanitskii on 21 july 2023
 */

var FragileForceView = cc.Node.extend({
    ctor: function (element, force) {
        this._super();

        this.force = force;

        this.setLocalZOrder(31);

        this.pointer = PointerView.create({
            target: element
        });

        this.dialogue = new MinimalDialogue({
            text: this.force.text,
            person: this.force.person,
            forcePosition: Dialogue.POSITIONS.TOP_LOWER
        });
        this.addChild(this.dialogue);
        this.dialogue.display();

        this.runAction(new cc.Sequence(
            new cc.DelayTime(15),
            new cc.CallFunc(this.closeForce.bind(this))
        ));
        cleverapps.eventBus.on("changeFocus", this.closeForce.bind(this), this);

        cleverapps.scenes.getRunningScene().addChild(this);
    },

    close: function () {
        this.stopAllActions();
        if (this.dialogue) {
            this.dialogue.remove();
            this.dialogue = undefined;
        }

        PointerView.remove(this.pointer);

        this.runAction(new cc.Sequence(
            new cc.DelayTime(0.5),
            new cc.RemoveSelf()
        ));
    },

    closeForce: function () {
        if (cleverapps.forces.isRunningForce(this.force)) {
            cleverapps.forces.closeRunningForce();
        }
    }
});