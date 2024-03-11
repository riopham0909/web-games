/**
 * Created by vladislav on 6/27/19
 */

var WorldMap = MapScrollView.extend({
    ctor: function () {
        this._super();

        this.setContentSize2(cleverapps.UI.getBgSize());
        this.setAnchorPoint2();

        var mapData, mapSize;
        mapData = cc.loader.getRes(bundles.world_map.jsons.mapData);

        mapSize = {
            width: mapData.map.width * resolutionScale,
            height: mapData.map.height * resolutionScale
        };
        this.setContainerSize(mapSize);

        if (bundles.world_map.urls.map) {
            var bg = new cc.Sprite(bundles.world_map.urls.map);
            bg.setScale(mapSize.width / bg.width);
            bg.setPositionRound(this.innerWidth / 2, this.innerHeight / 2);
            this.container.addChild(bg);
        }

        this.addBgs(mapData);
        this.buildingViews = {};

        this.setZoom(cleverapps.styles.WorldMap.zoom.unfocused);
        this.animateNewTask = function () {};

        this.updatePosition();
    },

    updateSize: function () {
        this.setContentSize2(cleverapps.UI.getBgSize());
        this.setZoom(this.zoom);
        this.updateChildren();
    },

    updatePosition: function () {
        var scene = cleverapps.scenes.getRunningScene();
        this.setPositionRound(scene.convertToNodeSpace(cc.p(this.width * this.scale / 2, this.height * this.scale / 2)));
    },

    addBgs: function (mapData) {
        for (var i = 0; i <= 30; i++) {
            var json;
            if (cleverapps.meta.getType() === Metha.FARM) {
                json = bundles.metha_top_layer_0.jsons["map_json" + i];
            } else if (cleverapps.meta.getType() === Metha.HOMEFIX) {
                json = bundles.world_map.jsons["map_json" + i] || bundles.world_map_nodither.jsons["map_json" + i];
            }

            if (json) {
                var animation = new cleverapps.Spine(json, 1);
                animation.setAnimation(0, "animation", true);

                if (mapData["map_json" + i]) {
                    var styles = mapData["map_json" + i];

                    var bgAnimation = new cc.Node();
                    bgAnimation.setAnchorPoint2();
                    bgAnimation.setContentSize2(styles.width * resolutionScale, styles.height * resolutionScale);
                    animation.setPosition(bgAnimation.width / 2, bgAnimation.height / 2);
                    bgAnimation.addChild(animation);
                    bgAnimation.setPosition(this.innerWidth / 2 + styles.x * resolutionScale, this.innerHeight / 2 + styles.y * resolutionScale);
                    this.container.addChild(bgAnimation, styles.zOrder);
                } else {
                    animation.setPosition(this.innerWidth / 2, this.innerHeight / 2);
                    this.container.addChild(animation);
                }
            }
        }
    },

    highlight: function (building) {
        building.addHighlight();
    },

    unhighlight: function (building) {
        building.removeHighlight();
    },

    onEnter: function () {
        this._super();

        if (cleverapps.config.debugMode) {
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: function (keyCode) {
                    if (keyCode === cc.KEY.b && !this.bordered) {
                        this.bordered = true;
                        for (var view in this.buildingViews) {
                            this.buildingViews[view].debugBorder();

                            var id = this.buildingViews[view].building.id;
                            var stages = this.buildingViews[view].building.amountStages();
                            if (cleverapps.home) {
                                for (var i = 0; i < cleverapps.home.furniture.length; i++) {
                                    if (cleverapps.home.furniture[i].id === this.buildingViews[view].building.id) {
                                        id = i;
                                        break;
                                    }
                                }
                            }

                            var idText = cleverapps.UI.generateImageText(id, cleverapps.styles.FONTS.WINDOW_TEXT);

                            var stagesText = cleverapps.UI.generateOnlyText("Stages: " + stages, cleverapps.styles.FONTS.TEXT);

                            var idView = new cleverapps.Layout([idText, stagesText], {
                                direction: cleverapps.UI.VERTICAL,
                                margin: 0
                            });
                            this.buildingViews[view].addChild(idView, 10);
                            idView.setPositionRound(this.buildingViews[view].width / 2, this.buildingViews[view].height / 2);
                            idView.replaceParentSamePlace(this.buildingViews[view].parent);
                            this.buildingViews[view].idView = idView;
                        }
                    }
                }.bind(this),
                onKeyReleased: function (keyCode) {
                    if (keyCode === cc.KEY.b) {
                        this.bordered = false;
                        for (var view in this.buildingViews) {
                            this.buildingViews[view].cleanupBorder();
                            this.buildingViews[view].idView.removeFromParent();
                        }
                    }
                }.bind(this)
            }, this);
        }
    },

    availableScrollPosition: function (scrollPosition) {
        var size = this.getContainerSize();

        var scrollSize = {
            x: size.width - this.width,
            y: size.height - this.height
        };

        if (scrollPosition.x > 0) {
            scrollPosition.x = 0;
        } else if (scrollPosition.x < -scrollSize.x) {
            scrollPosition.x = -scrollSize.x;
        }

        if (scrollPosition.y > 0) {
            scrollPosition.y = 0;
        } else if (scrollPosition.y < -scrollSize.y) {
            scrollPosition.y = -scrollSize.y;
        }

        return scrollPosition;
    },

    scrollTo: function (building, isJump, callback) {
        if (!building) {
            return;
        }

        if (!isJump && !cleverapps.meta.isFocused()) {
            console.log("Scroll:", building);
            cleverapps.meta.debugMessage("Trying to scroll without user focus!");
        }

        var startFocus = cleverapps.meta.focus;

        var view = this.buildingViews[building.name];
        var position = view.getPosition();

        var target = {
            x: this.width / 2 - position.x,
            y: this.height / 2 - position.y
        };

        target = this.availableScrollPosition(target);

        if (isJump) {
            this.setContainerPosition({
                x: target.x,
                y: target.y
            });
            if (callback) {
                callback();
            }
        } else {
            var SPEED = 1300;

            var v = this.getContainerPosition();
            v.x -= target.x;
            v.y -= target.y;

            var distance = Math.sqrt(v.x * v.x + v.y * v.y);
            var time = distance / SPEED;
            time = Math.min(0.7, Math.max(0.3, time));

            this.container.stopAllActions();
            this.container.runAction(new cc.Spawn(
                new cc.MoveTo(time, target.x, target.y).easing(cc.easeInOut(2.5)),

                new cc.Repeat(new cc.Sequence(
                    new cc.DelayTime(0.025),
                    new cc.CallFunc(this.updateChildren.bind(this))
                ), Math.ceil(time / 0.025))
            ));

            var methaError = new Error();

            this.runAction(new cc.Sequence(
                new cc.DelayTime(time * 0.45 || 0.5),
                new cc.CallFunc(function () {
                    if (!cleverapps.meta.isFocused() || cleverapps.meta.focus !== startFocus) {
                        console.log("Scroll:", building, startFocus, cleverapps.meta.focus);
                        cleverapps.throwAsync("Trying to scroll without user focus! Focus: " + cleverapps.meta.focus + " StartFocus: " + startFocus, methaError);
                    }
                    if (callback) {
                        callback();
                    }
                })
            ));
        }
    },

    showBuildings: function (buildings) {
        var order = [];
        buildings.forEach(function (building, ind) {
            if (!(building.isComplete() && building.throwaway)) {
                order.push(ind);
            }
        });

        order.sort(function (a, b) {
            return buildings[b].y - buildings[a].y;
        });

        order.forEach(function (id) {
            var building = buildings[id];
            var view = new BuildingView(building, this);
            this.buildingViews[building.name] = view;
            this.container.addChild(view);
        }, this);
    },

    removeBuilding: function (building) {
        var view = this.buildingViews[building.name];
        if (view) {
            view.runAction(new cc.RemoveSelf());
            delete this.buildingViews[building.name];
        }
    },

    removeTarget: function () {
        FingerView.remove(this.finger);
        this.finger = undefined;
    },

    addTarget: function (where) {
        this.removeTarget();

        this.finger = FingerView.hintClick(this.buildingViews[where.name]);
    },

    findClickedBuilding: function (touch) {
        var building;
        for (var name in this.buildingViews) {
            var view = this.buildingViews[name];

            if (!view.building.canTouch()) {
                continue;
            }

            if (!building || building.getLocalZOrder() <= view.getLocalZOrder()) {
                if (cc.rectContainsPoint(cc.rect(0, 0, view.width, view.height), view.convertTouchToNodeSpace(touch))) {
                    building = view;
                }
            }
        }
        return building;
    },

    onClick: function (touch) {
        var clickedBuilding = this.findClickedBuilding(touch);
        if (clickedBuilding) {
            if (cleverapps.debugMode && cleverapps.keyboardController.isPressed(cc.KEY.j)) {
                if (cleverapps.meta.getType() === Metha.FARM) {
                    Farm.Reset();
                    var newData = Farm.GetBuildingProgress(clickedBuilding.building.id, 0);
                    cleverapps.farm.load(newData);
                    cleverapps.farm.save();
                    cleverapps.refreshScene();
                } else if (cleverapps.meta.getType() === Metha.HOMEFIX) {
                    HomeTool.set(clickedBuilding.building.id, 0, false, function () {
                        cleverapps.refreshScene();
                    });
                }
                return;
            }
        }

        if (clickedBuilding) {
            clickedBuilding.building.onClick();
        }
    }
});

cleverapps.styles.WorldMap = {
    persons: {},
    zoom: {
        base: 1.0,
        unfocused: 0.7,
        minScale: 0.5
    }

};
