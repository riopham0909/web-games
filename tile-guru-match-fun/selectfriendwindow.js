/**
 * Created by slava on 24.03.17.
 */

var SelectFriendWindow = Window.extend({
    onWindowLoaded: function (type, onFriendsSelected) {
        var content = new cc.Node();
        content.setAnchorPoint(0.5, 0.5);
        this.content = content;
        this.type = type;

        if (cleverapps.config.debugMode) {
            SelectFriendWindow.PROCESS_PERIOD = "300 second";
        }

        var allFriends = cleverapps.friends.listFriends().concat(cleverapps.invitalbleFriends.listFriends());

        if (!allFriends.length) {
            this.generateNoFriendsContent();
        } else {
            this.generateFriendsContent(allFriends, onFriendsSelected);
        }

        this._super({
            title: SelectFriendWindow.ByType[this.type].title,
            name: "selectfriendwindow" + type,
            content: content,
            styles: cleverapps.styles.SelectFriendWindow.window
        });
    },

    addCheck: function (container, disabled) {
        var check = new cc.Sprite(bundles.checkbox.frames.check_mark_png);
        if (disabled) {
            cleverapps.UI.convertToGrayScale(check);
        }
        check.setPosition(container.width / 2, container.height / 2);
        container.check = check;
        container.addChild(check);
    },

    checkElementByFriendId: function (friendId, container) {
        var uid = this.selectedElements.friends.indexOf(friendId);

        if (uid !== -1) {
            this.selectedElements.data[friendId].checked = false;
            this.selectedElements.data[friendId].check.removeFromParent();
            this.selectedElements.data[friendId] = undefined;
            this.selectedElements.friends.splice(uid, 1);
        } else {
            this.addCheck(container);
            container.checked = true;
            this.selectedElements.data[friendId] = container;
            this.selectedElements.friends.push(friendId);
            if (this.selectedElements.friends.length > SelectFriendWindow.MAX_SELECTED) {
                this.checkElementByFriendId(this.selectedElements.friends[0]);
            }
        }
        this.updateSelectedContent();
    },

    generateCheckbox: function (friend, container) {
        var styles = cleverapps.styles.SelectFriendWindow.withFriends.friendContainer.checkBox;

        if (!this.processTimeData) {
            this.processTimeData = cleverapps.DataLoader.load(SelectFriendWindow.ByType[this.type].dataLoaderType());
            if (!this.processTimeData) {
                this.processTimeData = {};
            }
            for (var id in this.processTimeData) {
                if (this.processTimeData[id] < Date.now() - cleverapps.parseInterval(SelectFriendWindow.PROCESS_PERIOD)) {
                    this.processTimeData[id] = undefined;
                }
            }
        }

        var applyClick = function () {
            cleverapps.UI.onClick(container, function () {
                this.checkElementByFriendId(friend.id, checkBoxBg);
            }.bind(this), {
                ignoreScale: true
            });

            cleverapps.UI.applyHover(container, {
                onMouseOver: function () {
                    if (container.bg) {
                        container.bg.setColor(cleverapps.styles.COLORS.HOVER);
                    }
                    checkBoxBg.setScale(1.1);
                },
                onMouseOut: function () {
                    if (container.bg) {
                        container.bg.setColor(cleverapps.styles.COLORS.WHITE);
                    }
                    checkBoxBg.setScale(1);
                }
            });
        }.bind(this);

        var checkBoxBg = this.generateCheckBoxBg();
        checkBoxBg.setPositionRound(styles.x, container.height / 2 + cleverapps.styles.SelectFriendWindow.Avatar.y);

        container.fullData = {
            checkBox: checkBoxBg,
            id: friend.id
        };

        container.addChild(checkBoxBg);

        if (this.processTimeData) {
            if (this.processTimeData[friend.id] && this.processTimeData[friend.id] > Date.now() - cleverapps.parseInterval(SelectFriendWindow.PROCESS_PERIOD)) {
                var timerViewParams = {
                    showHours: true,
                    font: cleverapps.styles.FONTS.WINDOW_SMALL_TEXT,
                    imageFont: false
                };
                console.log("disabled", container);
                var timeLeft = this.processTimeData[friend.id] + cleverapps.parseInterval(SelectFriendWindow.PROCESS_PERIOD) - Date.now();
                var timer = new cleverapps.CountDownView(new cleverapps.CountDown(timeLeft), timerViewParams);
                var onFinish = function () {
                    timer.refresh();
                    timer.removeFromParent();
                    container.name.setVisible(true);
                    container.avatar.setOpacity(255);
                    checkBoxBg.setOpacity(255);
                    if (container.coinsIcon) {
                        container.coinsIcon.setOpacity(255);
                    }
                    checkBoxBg.check.removeFromParent();
                    container.notActive = false;
                    applyClick();
                };
                timer.onEnter = function () {
                    cleverapps.CountDownView.prototype.onEnter.call(this);
                    timer.countDown.onFinish = timer.createListener(onFinish);
                };

                timer.setPosition(container.width / 2, styles.timer.y);
                container.addChild(timer);
                container.name.setVisible(false);
                this.addCheck(checkBoxBg, true);
                checkBoxBg.setOpacity(150);
                container.avatar.setOpacity(120);
                container.notActive = true;
                if (container.coinsIcon) {
                    container.coinsIcon.setOpacity(150);
                }
                return;
            }
        }

        container.notActive = false;
        applyClick();
    },

    generateCheckBoxBg: function () {
        var checkBoxBg = new cc.Sprite(bundles.checkbox.frames.background_png);
        checkBoxBg.setAnchorPoint(0.5, 0.5);
        checkBoxBg.setCascadeOpacityEnabled(true);
        return checkBoxBg;
    },

    generateFriendContent: function (friend) {
        var styles = cleverapps.styles.SelectFriendWindow.withFriends.friendContainer;

        var container = new cc.Node();
        container.setAnchorPoint(0.5, 0.5);
        container.setContentSize(styles.width, styles.height);

        if (bundles.select_friend_window.frames.friend_bg_png) {
            var bg = cleverapps.UI.createScale9Sprite(bundles.select_friend_window.frames.friend_bg_png);
            bg.setAnchorPoint(0.5, 0.5);
            bg.setContentSize(styles.width, styles.height);
            bg.setPosition(container.width / 2, container.height / 2);
            container.addChild(bg);
            container.bg = bg;
        }

        var avatar = new cleverapps.UI.Avatar(friend);
        avatar.setPositionRound(cleverapps.styles.SelectFriendWindow.Avatar.x, container.height / 2 + cleverapps.styles.SelectFriendWindow.Avatar.y);
        avatar.setAnchorPoint2();
        container.avatar = avatar;
        avatar.setCascadeOpacityEnabled(true);
        container.addChild(avatar);

        var name = cleverapps.UI.generateTTFText(friend.name, cleverapps.styles.FONTS.WINDOW_SMALL_TEXT);
        name.setDimensions(styles.Name.width, styles.Name.height);
        name.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        name.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_TOP);
        container.addChild(name);
        name.setPositionRound(container.width / 2, styles.Name.y);
        container.name = name;

        this.generateCheckbox(friend, container);

        return container;
    },

    generateFriendsContent: function (friends, onFriendsSelected) {
        this.selectedElements = {
            friends: [],
            data: {}
        };

        var styles = cleverapps.styles.SelectFriendWindow.withFriends;
        this.content.setContentSize(styles.width, styles.height);

        var button = new cleverapps.UI.Button({
            text: SelectFriendWindow.ByType[this.type].button,
            width: styles.Button.width,
            height: styles.Button.height,
            onClicked: function () {
                if (this.selectedElements.friends.length) {
                    this.close();
                    onFriendsSelected(this.selectedElements.friends, function () {
                        if (this.processTimeData) {
                            for (var i = 0; i < this.selectedElements.friends.length; i++) {
                                this.processTimeData[this.selectedElements.friends[i]] = Date.now();
                            }
                            cleverapps.DataLoader.save(SelectFriendWindow.ByType[this.type].dataLoaderType(), this.processTimeData);
                        }
                    }.bind(this));
                }
            }.bind(this)
        });
        button.setPositionRound(this.content.width / 2 + styles.Button.x, styles.Button.y);
        this.button = button;
        this.content.addChild(button);

        var selectedNode = new cc.Node();
        selectedNode.setAnchorPoint(0, 0.5);
        selectedNode.setPositionRound(styles.SelectedBlock.x, styles.SelectedBlock.y);

        var selectedCheckBox = this.generateCheckBoxBg();
        selectedCheckBox.setAnchorPoint(0, 0.5);
        selectedCheckBox.setPositionRound(0, selectedCheckBox.height / 2);
        selectedNode.addChild(selectedCheckBox);
        var selectedText = cleverapps.UI.generateTTFText("Selected", cleverapps.styles.FONTS.WINDOW_TEXT);
        selectedText.fitTo(styles.selectedText.width);
        selectedText.setPositionRound(selectedCheckBox.width + styles.SelectedBlock.margin.x, selectedCheckBox.y + selectedText.height / 2);
        selectedText.setAnchorPoint(0, 0.5);
        selectedNode.addChild(selectedText);
        var selectedAmountText = cleverapps.UI.generateTTFText("", cleverapps.styles.FONTS.WINDOW_TEXT);
        selectedAmountText.setAnchorPoint(0.5, 0.5);
        this.selectedAmountText = selectedAmountText;
        selectedNode.addChild(selectedAmountText);
        this.updateSelectedContent();
        selectedAmountText.setPositionRound(selectedText.x + selectedText.width / 2, selectedCheckBox.y - selectedAmountText.height / 2);

        selectedNode.setContentSize(selectedCheckBox.width + selectedText.width + styles.SelectedBlock.margin.x, selectedCheckBox.height);
        this.content.addChild(selectedNode);

        cleverapps.UI.applyHover(selectedNode, {
            onMouseOver: function () {
                selectedCheckBox.setScale(1.1);
            },
            onMouseOut: function () {
                selectedCheckBox.setScale(1);
            }
        });

        cleverapps.UI.onClick(selectedNode, function () {
            this.switchSelectAll(selectedCheckBox);
        }.bind(this));

        var innerContainer = new cc.Node();

        this.friendContainers = friends.map(function (friendInfo, index) {
            return {
                container: this.generateFriendContent(friendInfo),
                order: index
            };
        }, this);

        levels.friendSorter.update();

        this.friendContainers.sort(function (a, b) {
            if (a.container.notActive !== b.container.notActive) {
                return a.container.notActive ? 1 : -1;
            }
            if (levels.friendSorter.canUse(a.container.fullData.id) !== levels.friendSorter.canUse(b.container.fullData.id)) {
                return levels.friendSorter.canUse(a.container.fullData.id) ? -1 : 1;
            }
            return a.order - b.order;
        });

        if (this.friendContainers.length > SelectFriendWindow.MAX_ROWS_AMOUNT * SelectFriendWindow.IN_ROW) {
            this.friendContainers = this.friendContainers.slice(0, SelectFriendWindow.MAX_ROWS_AMOUNT * SelectFriendWindow.IN_ROW);
        }

        for (var i = 0; i < this.friendContainers.length; i++) {
            innerContainer.addChild(this.friendContainers[i].container);
            this.friendContainers[i].container.setPositionRound(
                (i % SelectFriendWindow.IN_ROW) * (styles.friendContainer.margin + styles.friendContainer.width) + styles.friendContainer.width / 2,
                innerContainer.height - Math.floor(i / SelectFriendWindow.IN_ROW) * (styles.friendContainer.margin + styles.friendContainer.height) - styles.friendContainer.height / 2
            );
        }

        innerContainer = cleverapps.UI.wrap(innerContainer);
        this.friendsContainer = new cleverapps.UI.ScrollView(innerContainer);

        this.friendsContainer.setContentSize(innerContainer.width + cleverapps.styles.SelectFriendWindow.scroll.margin.mx[0], styles.friendsContainer.height);
        this.friendsContainer.setAnchorPoint(0.5, 0);
        this.friendsContainer.setPositionRound(this.content.width / 2, styles.friendsContainer.y);

        if (!cc.sys.isNative) {
            this.switchSelectAll(selectedCheckBox);
        }

        this.content.addChild(this.friendsContainer);
    },

    switchSelectAll: function (container) {
        if (container.selected) {
            container.selected = false;
            container.check.removeFromParent();
            for (var i = this.selectedElements.friends.length - 1; i >= 0; i--) {
                this.checkElementByFriendId(this.selectedElements.friends[i]);
            }
        } else {
            var checked = false;
            for (var j = 0; j < this.friendContainers.length; j++) {
                var friendContainer = this.friendContainers[j].container;
                var data = friendContainer.fullData;
                if (this.selectedElements.friends.length < SelectFriendWindow.MAX_SELECTED && !friendContainer.notActive && !data.checkBox.checked) {
                    this.checkElementByFriendId(data.id, data.checkBox);
                    checked = true;
                }
            }
            if (checked) {
                container.selected = true;
                this.addCheck(container);
            }
        }
    },

    updateSelectedContent: function () {
        this.selectedAmountText.setString(this.selectedElements.friends.length + "/" + SelectFriendWindow.MAX_SELECTED);
        if (!this.selectedElements.friends.length) {
            this.button.disable();
        } else {
            this.button.enable();
        }
    },

    generateNoFriendsContent: function () {
        var styles = cleverapps.styles.SelectFriendWindow.noFriends;
        this.content.setContentSize(styles.width, styles.height);

        var text = cleverapps.UI.generateTTFText(SelectFriendWindow.ByType[this.type].noFriends, cleverapps.styles.FONTS.WINDOW_TEXT);
        text.setPositionRound(this.content.width / 2, styles.Text.y);
        text.setDimensions(styles.Text.width, 0);
        text.fitTo(undefined, styles.Text.height);
        text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.content.addChild(text);

        var button = new cleverapps.UI.Button({
            text: "SettingsWindow.InviteFriends",
            width: styles.Button.width,
            height: styles.Button.height,
            onClicked: function () {
                cleverapps.platform.inviteFriends(this.createListener(this.close.bind(this)));
            }.bind(this)
        });
        button.setPositionRound(this.content.width / 2, styles.Button.y);
        this.content.addChild(button);
    }
});

SelectFriendWindow.ByType = {
    askLives: {
        title: "SelectFriendWindow.askLives.title",
        button: "Ask",
        noFriends: "SelectFriendWindow.askLives.noFriendsText",
        dataLoaderType: function () {
            return cleverapps.DataLoaderTypes.ASKED_LIVES;
        }
    },

    askStars: {
        title: "SelectFriendWindow.askStars.title",
        button: "Ask",
        noFriends: "SelectFriendWindow.askStars.noFriendsText",
        dataLoaderType: function () {
            return cleverapps.DataLoaderTypes.ASKED_STARS;
        }
    }
};

SelectFriendWindow.PROCESS_PERIOD = "1 day";
SelectFriendWindow.MAX_SELECTED = 10;
SelectFriendWindow.MAX_ROWS_AMOUNT = 10;
SelectFriendWindow.IN_ROW = 3;

cleverapps.styles.SelectFriendWindow = {
    Avatar: {
        x: 140,
        y: 20
    },

    scroll: {
        margin: {
            mx: [30]
        }
    },

    withFriends: {
        width: 670,
        height: 750,

        selectedText: {
            width: 250
        },

        friendsContainer: {
            height: 580,
            y: 175
        },

        friendContainer: {
            height: 180,
            width: 210,
            margin: 20,

            Name: {
                width: 200,
                height: 40,
                y: 24
            },

            checkBox: {
                x: 42,
                timer: {
                    y: 24,
                    height: 20
                }
            }
        },

        Button: {
            width: 300,
            height: 120,
            y: 75,
            x: 190,
            margin: 10
        },

        SelectedBlock: {
            y: 75,
            x: 0,
            margin: {
                x: 20
            }
        }
    },

    noFriends: {
        width: 550,
        height: 500,

        Text: {
            y: 300,
            width: 550,
            height: 250
        },

        Button: {
            width: 450,
            height: 120,
            y: 60
        }
    }
};