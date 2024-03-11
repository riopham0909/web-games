/**
 * Created by mac on 7/8/18
 * @return {boolean}
 */

cleverapps.FBLoginOrInvite = function () {
    if (!cleverapps.platform.isConnected(Platform.SOCIAL) || cleverapps.flags.nologin || cleverapps.flags.noinvites) {
        return;
    }

    var node = new cc.Node();
    node.setAnchorPoint2();

    var removeSelf = node.createListener(function () {
        node.removeFromParent(true);
    });

    var button = new InviteButton({
        onSuccess: removeSelf
    });
    button.setPositionRound(button.width / 2, button.height / 2);
    node.setContentSize2(button);
    node.addChild(button);

    var styles = cleverapps.styles.FBLoginOrInvite;
    if (styles.images.avatars) {
        var rightAvatar = new cleverapps.UI.Avatar({ avatar: bundles.avatar.frames.default_avatar, frame: bundles.avatar.frames.avatar_frame2 });
        rightAvatar.setScale(styles.images.avatars.scale);
        rightAvatar.setPositionRound(styles.images.avatars.right.x, styles.images.avatars.right.y);
        rightAvatar.setRotation(styles.images.avatars.right.rotation);
        button.addChild(rightAvatar);

        var leftAvatar = new cleverapps.UI.Avatar({ avatar: bundles.avatar.frames.default_avatar, frame: bundles.avatar.frames.avatar_frame2 });
        leftAvatar.setScale(styles.images.avatars.scale);
        leftAvatar.setPositionRound(styles.images.avatars.left.x, styles.images.avatars.left.y);
        leftAvatar.setRotation(styles.images.avatars.left.rotation);
        button.addChild(leftAvatar);
    }

    var message = cleverapps.UI.generateTTFText("FBLoginOrInvite.invite", cleverapps.styles.FONTS.FBLOGINORINVITE_TEXT);
    message.setPosition(node.width / 2 + styles.text.offsetX, node.height + styles.text.offsetY);
    message.fitTo(styles.text.width);
    node.addChild(message);

    node.setVisible(false);
    node.runAction(new cc.Sequence(
        new cc.ScaleTo(0, 0),
        new cc.Show(),
        new cc.ScaleTo(0.5, 1).easing(cc.easeBackOut())
    ));

    message.setOpacity(0);
    message.runAction(new cc.Sequence(
        new cc.DelayTime(0.5),
        new cc.FadeIn(0.5)
    ));

    cleverapps.UI.wrap(node);

    return node;
};

cleverapps.styles.FBLoginOrInvite = {
    images: {
        avatars: {
            scale: 0.7,

            left: {
                x: { align: "left", dx: -90 },
                y: { align: "center" },
                rotation: -7
            },

            right: {
                x: { align: "left", dx: -60 },
                y: { align: "center", dy: 5 },
                rotation: 13
            }
        }
    },

    text: {
        offsetX: -40,
        offsetY: 26,
        width: 700
    }
};