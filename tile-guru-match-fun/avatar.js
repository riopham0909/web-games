/**
 * Created by andrey on 08.05.2020
 */

cleverapps.UI.Avatar = cc.Node.extend({
    ctor: function (player, avatarFBUserId, styles) {
        var image = player;

        if (player && (player.avatar || player.id)) {
            image = player.avatar;
            avatarFBUserId = player.id;
        }

        this._super();
        var isPlayer = (avatarFBUserId === cleverapps.platform.getUserID());

        var avatar = new cc.Sprite(isPlayer ? bundles.avatar.frames.user_avatar : bundles.avatar.frames.default_avatar);
        this.addChild(avatar);
        this.avatar = avatar;

        var frameImage = player && !(player instanceof cc.SpriteFrame) && player.frame;
        if (!frameImage) {
            var avatarFramesBundle = cleverapps.skins.getSlot("avatarFramesBundle") || "avatar";
            frameImage = isPlayer ? bundles[avatarFramesBundle].frames.avatar_frame2 : bundles[avatarFramesBundle].frames.avatar_frame;
        }
        var frame = this.frame = new cc.Sprite(frameImage);
        frame.setLocalZOrder(1);
        this.addChild(frame);

        this.styles = styles || cleverapps.styles.UI.Avatar;
        this.setAnchorPoint(0.5, 0.5);
        this.setContentSize2(frame.getContentSize());
        avatar.setPositionRound(this.width / 2, this.height / 2 + (this.styles.bottom - this.styles.top) / 2);
        frame.setPositionRound(this.width / 2, this.height / 2);
        this.adjustSize();

        this.image = image;

        if (image && (typeof image === "string")) {
            if (cleverapps.social.isLoggedIn() && avatarFBUserId && image.indexOf("fbsbx.com") >= 0 && (cleverapps.social instanceof WebViewFacebook || cleverapps.social instanceof cleverapps.FacebookCanvasSocial)) {
                this.avatarFBUserId = avatarFBUserId;
                this.onImageLoadErrorListener = this.createListener(this.onImageLoadError.bind(this));
            }
        }
        this.onImageLoadListener = this.createListener(this.onImageLoad.bind(this));
    },

    onImageLoadError: function () {
        cleverapps.social.aboutUser(this.avatarFBUserId, this.createListener(this.onFBUserLoaded.bind(this)));
    },

    onFBUserLoaded: function (response) {
        if (response && response.picture && response.picture.data && response.picture.data.url) {
            this.image = response.picture.data.url;
            this.onImageLoadErrorListener = undefined;
            this.setImage(this.image);

            var data = { "avatar": this.image };
            cleverapps.RestClient.post("/info/" + this.avatarFBUserId, data, function () {
                // console.log("Success updating user avatar: " + data.avatar);
            }, function () {
                console.log("Failed updating user avatar: " + data.avatar);
            });
        }
    },

    onEnter: function () {
        this._super();

        if (this.image) {
            var isGood = true;
            ["stub_128x128.gif", "camera_200.png"].forEach(function (bad) {
                if (typeof this.image === "string" && this.image.indexOf(bad) !== -1) {
                    isGood = false;
                }
            }.bind(this));

            if (isGood) {
                this.setImage(this.image);
            }
        }
    },

    adjustSize: function () {
        this.avatar.setScale((this.width - 2 * this.styles.x) / this.avatar.width, (this.height - this.styles.top - this.styles.bottom) / this.avatar.height);
    },

    onImageLoad: function (code, data) {
        if (!code) {
            try {
                var newAvatar = new cc.Sprite(data);
                newAvatar.setPositionRound(this.width / 2, this.height / 2);

                this.avatar.removeFromParent();
                this.addChild(newAvatar);

                this.avatar = newAvatar;
                this.adjustSize();
            } catch (e) {
                console.log("Cross-domain??", e);
            }
        } else {
            if (this.onImageLoadErrorListener) {
                this.onImageLoadErrorListener();
            }
            console.log("Error loading avatar image!");
        }
    },

    loadGif: function (url) {
        if (!cc.sys.isNative) {
            url = url.replace("https:", "").replace("http:", "");
        }

        if (url === this.imageUrl) {
            return;
        }
        this.imageUrl = url;
        try {
            var gif = new SuperGif();
            gif.load_url(url, this.createListener(function () {
                if (url !== this.imageUrl) {
                    return;
                }

                var framesData = gif.getFrames();

                if (Array.isArray(framesData) && framesData.length > 0) {
                    var newAvatar = new cc.Sprite(framesData[0]);
                    newAvatar.setPositionRound(this.width / 2, this.height / 2);

                    this.avatar.removeFromParent();
                    this.addChild(newAvatar);

                    this.avatar = newAvatar;
                    this.adjustSize();

                    var frames = [];
                    framesData.forEach(function (frameData) {
                        frames.push(new cc.Sprite(frameData).getSpriteFrame());
                    });

                    var animation = new cc.Animation(frames, 0.075);
                    this.avatar.runAction(new cc.RepeatForever(new cc.Animate(animation)));
                }
            }.bind(this)));
        } catch (e) {
            if (url === this.imageUrl) {
                delete this.imageUrl;
            }
            console.log("Cross-domain??", e);
            if (this.onImageLoadErrorListener) {
                this.onImageLoadErrorListener();
            }
        }
    },

    getImageSpriteFrame: function (image) {
        if (image.indexOf("#") === 0 || image.indexOf("@") === 0) {
            return cc.spriteFrameCache.getSpriteFrame(image)
                || cc.spriteFrameCache.getSpriteFrame(image.replace(/\//g, "-"))
                || cc.spriteFrameCache.getSpriteFrame(image.replace(/\//g, "-").replace("#", "#main-"));
        }
    },

    setImage: function (image) {
        if (image instanceof cc.SpriteFrame) {
            this.avatar.setSpriteFrame(image);
            this.adjustSize();
        } else if ((image.indexOf("#") === 0 || image.indexOf("@") === 0) && this.getImageSpriteFrame(image)) {
            this.avatar.setSpriteFrame(this.getImageSpriteFrame(image));
            this.adjustSize();
        } else if (image.indexOf(".gif") !== -1) {
            this.loadGif(image);
        } else {
            image = decodeURIComponent(image);

            var data = cleverapps.UI.Avatar.cache.get(image);
            if (data) {
                this.onImageLoadListener(0, data);
                return;
            }

            // if (config && config.debugMode) console.log("Starting to load: " + image);
            cc.loader.loadImg(image, function (code, data) {
                // if (config && config.debugMode) console.log("Finished loading: " + image);
                this.onImageLoadListener(code, data);
            }.bind(this));
        }
    }
});

cleverapps.UI.Avatar.cache = new cleverapps.Cache();

cleverapps.UI.Avatar.preload = function (avatar, callback) {
    callback = callback || function () {};

    if (Array.isArray(avatar)) {
        var waiter = cleverapps.wait(avatar.length, callback);
        avatar.forEach(function (single) {
            cleverapps.UI.Avatar.preload(single.avatar || single, waiter);
        });
        return;
    }

    if (typeof avatar !== "string" || avatar.indexOf("#") === 0 || avatar.indexOf(".gif") !== -1) {
        callback();
        return;
    }

    avatar = decodeURIComponent(avatar);

    var data = cleverapps.UI.Avatar.cache.get(avatar);
    if (data) {
        callback(data);
        return;
    }

    cc.loader.loadImg(avatar, function (code, data) {
        if (!code) {
            cleverapps.UI.Avatar.cache.set(avatar, data);
        }
        callback(!code && data);
    });
};
