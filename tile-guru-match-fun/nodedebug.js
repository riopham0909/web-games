/**
 * Created by mac on 1/4/22
 */

cc.checkGLErrorDebug = function (glProgram, event) {
    if (cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
        var error = cc._renderContext.getError();

        if (!error && event === "afterCreateProgramObj" && !(glProgram._programObj instanceof WebGLProgram)) {
            error = "notWebGLProgram";
        }

        if (!error) {
            return;
        }

        var messages = [
            "error: " + error
        ];

        if (glProgram) {
            messages.push("glProgram._programObj isUndefined: " + (typeof glProgram._programObj === "undefined"));
            messages.push("glProgram._programObj is WebGLProgram: " + (glProgram._programObj instanceof WebGLProgram));
        }

        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            messages.push("info: " + JSON.stringify(cleverapps.info && cleverapps.info.data));
        }

        var message = "WebGL error: " + messages.join(" - ");

        if (cleverapps.Shaders.initializing) {
            console.log(message);
        } else {
            cleverapps.throwAsync(message);
        }
    }
};

// eslint-disable-next-line no-unused-vars
var checkBrokenLink = function (frame, args) {
    if (!frame && args.length !== 0 && frame !== null) {
        console.log(args);
        cleverapps.throwAsync("broken frame: " + frame);
    }
};

cc.Base.prototype.debugGetName = function () {
    var ClassObject = this.constructor;

    var res = "[unknown]";
    [window, cc, ccui, cleverapps, cleverapps.UI, sp, levels].forEach(function (root) {
        for (var i in root) {
            if (root[i] === ClassObject) {
                res = i;
                break;
            }
        }
    });

    return res;
};

cc.Base.prototype.debugParents = function () {
    var res = [];
    var object = this;
    while (object) {
        res.push(object.debugGetName());
        object = object.parent;
    }

    console.log("cleverapps.sceneDebugger.selectedNode -> " + res.join("->"));
};

cc.Base.prototype.debugBorder = function (options) {
    if (!cleverapps.config.debugMode) {
        return;
    }

    cleverapps.sceneDebugger.selectedNode = this;
    options = options || {};

    if (typeof selectedNode === "object" && typeof selectedNode.unselect === "function" && selectedNode !== this && !selectedNode.stopListeners) {
        selectedNode.unselect();
    }

    selectedNode = this;

    if (cleverapps.nodeAttributesPannel) {
        cleverapps.nodeAttributesPannel.remove();
        cleverapps.nodeAttributesPannel = undefined;
    }

    this.debugBorderDx = this.debugBorderDx || 0;
    this.debugBorderDy = this.debugBorderDy || 0;
    if (typeof EditorMap2dDecoratorView !== "undefined" && this instanceof EditorMap2dDecoratorView) {
        this.debugBorderDx = this.decorator.dx || 0;
        this.debugBorderDy = this.decorator.dy || 0;
    }

    var valueToFixed = function (value) {
        return +(value).toFixed(2);
    };

    var getMsg = function (separator) {
        var size = this.getBoundingBox();
        if (typeof UnitView !== "undefined" && this instanceof UnitView) {
            var mergeUnit = " " + this.unit.getType() + " " + Unit.GetKey(this.unit);
            var comp = this.unit.components.map(function (item) {
                return item.constructor.name;
            }).join(" ");
            mergeUnit += comp ? "\n" + comp : "";
        }

        var msg = [
            this.debugGetName() + (this instanceof cc.LabelTTF ? " " + this.getFontSize() : "") + (mergeUnit || ""),
            valueToFixed(size.width) + "x" + valueToFixed(size.height) + " (" + this.width + "x" + this.height + ")",
            "scale: " + Math.ceil(this.scaleX * 100) / 100 + " x " + Math.ceil(this.scaleY * 100) / 100,
            "pos: " + Math.floor(this.x * 100) / 100 + " x " + Math.floor(this.y * 100) / 100,
            "offset: " + Math.floor(this.debugBorderDx * 100) / 100 + " x " + Math.floor(this.debugBorderDy * 100) / 100,
            "rotation " + this.rotation
        ];

        var cell = this.decorator;
        if (cell && cell.x !== undefined && cell.y !== undefined) {
            msg.push("cell: " + cell.x + " x " + cell.y);
        }
        console.log(msg.join(separator));
        return msg.join(separator);
    }.bind(this);

    var updateDisplayData = function () {
        console.log(getMsg("\t"));
        if (this.labelSavedPtr && options.showPosition) {
            this.labelSavedPtr.setString(getMsg("\n"));
        }
    }.bind(this);

    this.debugBorderKeyboardListener = cc.EventListener.create({
        event: cc.EventListener.KEYBOARD,
        onKeyPressed: function (key) {
            for (var name in cleverapps.NodeDebugCommands) {
                var command = cleverapps.NodeDebugCommands[name];

                if (command.filter && !command.filter.call(this)) {
                    continue;
                }

                if (command.key === key && command.toggle) {
                    command.toggle.call(this);
                    break;
                }

                if ([cc.KEY.up, cc.KEY.down, cc.KEY.right, cc.KEY.left].indexOf(key) !== -1) {
                    if (command.key === undefined || cleverapps.keyboardController.isPressed(command.key)) {
                        command.action.call(this, key);

                        if (!command.noDisplayUpdate) {
                            updateDisplayData();
                        }

                        if (this.spriteSavedPtr) {
                            this.spriteSavedPtr.setContentSize(this.getContentSize());
                        }

                        break;
                    }
                }
            }
        }.bind(this)
    });

    cc.eventManager.addListener(this.debugBorderKeyboardListener, this);

    if (!this.spriteSavedPtr) {
        var sprite = cleverapps.UI.createScale9Sprite(bundles.dev_resources.frames.border, cleverapps.UI.Scale9Rect.TwoPixelY);
        sprite.setAnchorPoint2(0, 0);
        sprite.setContentSize(this.getContentSize());
        this.spriteSavedPtr = sprite;

        var colors = [new cc.Color(255, 0, 0, 255), new cc.Color(255, 0, 255, 0), new cc.Color(255, 255, 0, 0)];
        sprite.setColor(options.color || cleverapps.Random.choose(colors, this.debugGetName().length));

        var dpr = cc.view.getDevicePixelRatio();
        var labelDPR = engine === "cocos2d" && dpr > 1
            ? dpr : 1;
        if (this instanceof cc.LabelTTF) {
            sprite.setScale(labelDPR);

            if (this.debugRegionForFitTo) {
                sprite.setColor(new cc.Color(255, 255, 255, 255));

                var w = this.debugRegionForFitTo.width || this.getContentSize().width;
                var h = this.debugRegionForFitTo.height || this.getContentSize().height;

                var dx = 0;
                if (this.debugRegionForFitTo.width) {
                    dx = (this.debugRegionForFitTo.width - this.getContentSize().width) / 2;
                }

                var dy = 0;
                if (this.debugRegionForFitTo.height) {
                    dy = (this.debugRegionForFitTo.height - this.getContentSize().height);
                    if (this.verticalAlign === cc.VERTICAL_TEXT_ALIGNMENT_CENTER) {
                        dy /= 2;
                    }
                }

                sprite.setContentSize(w, h);
                sprite.x -= dx * labelDPR;
                sprite.y -= dy * labelDPR;
            }
        }

        var buttons = this.debugButtons = this.createEditButtons(options);
        if (buttons) {
            buttons.setAnchorPoint(0, 1);
            buttons.setPositionRound(sprite.width, sprite.height);
            sprite.addChild(buttons);
        }

        this.addChild(sprite);
        sprite.setLocalZOrder(10);
    }

    if (!this.labelSavedPtr) {
        var labelText;

        if (options.labelText) {
            labelText = options.labelText;
        } else if (options.showZOrder) {
            labelText = this.getLocalZOrder();
        } else if (options.showPosition) {
            labelText = getMsg("\n");
        } else {
            labelText = this.getContentSize().width + " x " + this.getContentSize().height + " " + this.debugGetName();
        }

        var label = this.labelSavedPtr = cleverapps.UI.generateOnlyText("", cleverapps.styles.FONTS.SYSTEM);
        label.setAnchorPoint2(0, 0);
        label.setLocalZOrder(10);
        this.addChild(label);

        label._super_setString = label.setString;
        label.setString = function () {
            label._super_setString.apply(label, arguments);
            label.setPosition(this.scaleX < 0 ? this.width : 0, this.scaleY < 0 ? 0 : this.height * labelDPR);
            label.setScaleX(1 / (this.scaleX / labelDPR));
            label.setScaleY(1 / (this.scaleY / labelDPR));
        }.bind(this);
        label.setString(labelText, { ignoreWarning: true });
    }

    if (options.showAttributes && cleverapps.flags.nodeDebugPanelMode) {
        this.showNodeDebugPanel();
    }
};

cc.Base.prototype.showNodeDebugPanel = function () {
    this.setCascadeOpacityEnabledRecursively(true);
    this.setRecCascadeColorEnabled(true);
    this.debugButtons && this.debugButtons.setCascadeColorEnabled(false);

    var container = cleverapps.nodeAttributesPannel = document.createElement("div");
    Object.assign(container.style, {
        position: "absolute",
        padding: "3px",
        backgroundColor: "rgb(0, 0, 34)",
        bottom: "0px",
        right: "0px",
        display: "grid",
        "grid-template-columns": "auto auto",
        "justify-items": "center",
        "align-items": "center"
    });
    container.ondragstart = function () {
        return false;
    };
    container.onmousedown = function (e) {
        var coords = getCoords(container);
        var shiftX = e.pageX - coords.left;
        var shiftY = e.pageY - coords.top;
        moveAt(e);
        function moveAt(e) {
            container.style.bottom = "";
            container.style.right = "";
            container.style.left = e.pageX - shiftX + "px";
            container.style.top = e.pageY - shiftY + "px";
        }

        document.onmousemove = function (e) {
            moveAt(e);
        };

        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
        };

        function getCoords(elem) { // кроме IE8-
            var box = elem.getBoundingClientRect();
            return {
                top: box.top,
                left: box.left
            };
        }
    };

    var addRange = function (innerText, min, max, step, value, callback) {
        var input = document.createElement("input");
        input.type = "range";
        input.min = String(min);
        input.max = String(max);
        input.step = String(step);
        input.value = String(value || max);
        input.style.width = "200px";
        input.style.height = "40px";
        input.oninput = input.onchange = function () {
            callback(parseFloat(input.value));
        };
        input.onmousedown = function (event) {
            event.stopPropagation();
        };
        input.onwheel = function (event) {
            event.preventDefault();
            input.value = String(parseFloat(input.value) + (event.deltaY >= 0 ? -1 : 1) * step);
            callback(parseFloat(input.value));
        };

        var text = document.createElement("div");
        text.innerText = innerText;

        container.appendChild(text);
        container.appendChild(input);
    };

    addRange("red", 0, 255, 1, this.color.r, function (value) {
        var color = this.color;
        color.r = value;
        cleverapps.sceneDebugger.selectedNode.setColor(color);
    }.bind(this));

    addRange("green", 0, 255, 1, this.color.g, function (value) {
        var color = this.color;
        color.g = value;
        cleverapps.sceneDebugger.selectedNode.setColor(color);
    }.bind(this));

    addRange("blue", 0, 255, 1, this.color.b, function (value) {
        var color = this.color;
        color.b = value;
        cleverapps.sceneDebugger.selectedNode.setColor(color);
    }.bind(this));

    addRange("opacity", 0, 255, 1, this.opacity, function (value) {
        this.opacity = value;
    }.bind(this));

    cc.container.appendChild(container);
};

cc.Base.prototype.showUnpackedRes = function () {
    if (typeof unpackedMap === "undefined") {
        return;
    }
    var depth = 0;
    var maxDepth = 10;
    var firstLink = undefined;

    var step = function (node) {
        if (maxDepth > depth++) {
            node.getChildren().forEach(function (child) {
                step(child);
            });
        }

        if (node.constructor === cc.Sprite || node.constructor === cc.Scale9Sprite) {
            var frame = processVirtualImage(node.spriteFrameName);
            if (frame) {
                if (frame[0] !== "#") {
                    frame = "#" + frame;
                }
                var unpacked = unpackedMap[frame];

                if (unpacked) {
                    var repo = ["cleverapps", "match3"].find(function (repo) {
                        return unpacked.startsWith(repo);
                    });

                    var resPath;
                    if (repo) {
                        resPath = unpacked.substring(repo.length);
                    } else {
                        resPath = "/" + unpacked;
                        repo = cleverapps.config.name;
                    }

                    if (!resPath.includes("dev_resources")) {
                        var link = "https://github.com/rvvslv/" + repo + "/tree/master" + resPath;
                        firstLink = firstLink || link;
                        console.log(node.spriteFrameName + "\n" + link);
                    }
                }
            }
        }
        if (node.constructor === sp.SkeletonAnimation) {
            var spineData = cleverapps.Spine.getGitPath(node.jsonName);
            if (spineData) {
                firstLink = firstLink || spineData.link;
                console.log(spineData.name + "\n" + spineData.link);
            }
        }
    };

    step(this);
    return firstLink;
};

cc.Base.prototype.createEditButtons = function (options) {
    delete this.debugEditUnitAnchorsMode;

    if (options.noResLinks) {
        return;
    }

    var styles = cleverapps.styles.NodeDebug.button;

    var createButton = function (options) {
        return new cleverapps.UI.Button({
            type: cleverapps.styles.UI.Button.Images.small_button_green,
            content: options.content,
            onClicked: options.onClicked,
            hint: options.hint,
            width: styles.width,
            height: styles.height
        });
    };

    var link = this instanceof cc.LabelTTF ? this.showLinkToLocalization() : this.showUnpackedRes();
    if (link) {
        var editLink = createButton({
            content: new cc.Sprite(bundles.dev_buttons.frames.icon_edit),
            hint: "Open link to git",
            onClicked: function () {
                setTimeout(window.open.bind(window, link, "_blank"), 0);
            }
        });
    }

    if (!cleverapps.git.checkAvailableErrors() && typeof UnitView !== "undefined" && this instanceof UnitView) {
        var editAnchorsButton = createButton({
            content: cleverapps.UI.generateOnlyText("A", cleverapps.UI.Button.WorkFont()),
            hint: "Toggle edit anchors mode",
            onClicked: function () {
                if (cleverapps.flags.keyboardAnchorsMode) {
                    cleverapps.notification.create("Disable anchors mode in debug tool (or press 'a').");
                    return;
                }

                this.debugEditUnitAnchorsMode = !this.debugEditUnitAnchorsMode;

                updateAnchorsButton();

                cleverapps.notification.create("Edit anchors mode " + (this.debugEditUnitAnchorsMode ? "activated" : "switched off"));
            }.bind(this)
        });

        var updateAnchorsButton = function () {
            editAnchorsButton.setType(cleverapps.flags.keyboardAnchorsMode || this.debugEditUnitAnchorsMode ? cleverapps.styles.UI.Button.Images.small_button_blue : cleverapps.styles.UI.Button.Images.small_button_green);
        }.bind(this);

        cleverapps.flags.on("change:keyboardAnchorsMode", updateAnchorsButton, editAnchorsButton);

        updateAnchorsButton();
    }

    if (this.unit && Families[this.unit.code].units[0].mission) {
        var demoLink = createButton({
            content: new cc.Sprite(bundles.dev_buttons.frames.icon_stages),
            hint: "Open unit demo",
            onClicked: function () {
                var url = cleverapps.RestClient.standsWeb("/?unitsDemo=" + cleverapps.travelBook.currentPage.id + "&code=" + this.unit.code);
                setTimeout(window.open.bind(window, url, "_blank"), 0);
            }.bind(this)
        });
    }

    var buttons = [editLink, editAnchorsButton, demoLink].filter(Boolean);
    if (!buttons.length) {
        return;
    }

    return new cleverapps.Layout(buttons, {
        direction: cleverapps.UI.HORIZONTAL,
        margin: styles.margin
    });
};

cc.Base.prototype.showGitLink = function () {
    if (this instanceof cc.LabelTTF) {
        return this.showLinkToLocalization();
    }
};

cc.Base.prototype.showLinkToLocalization = function () {
    if (typeof Messages === "undefined" || !Messages.debugMapping) {
        return;
    }

    var getLink = function (code) {
        cleverapps.copyToClipboard(code);
        var jsonPath = Messages.debugMapping[code];
        var unpackedPath = unpackedMap[jsonPath];
        if (unpackedPath) {
            var folder = unpackedPath.substring(0, unpackedPath.indexOf("/"));
            var path = unpackedPath.substring(unpackedPath.indexOf("/"));
            path += "?key=" + code;
            return "https://github.com/rvvslv/" + folder + "/edit/master" + path;
        }
    };

    var link = getLink(this.debugTextCode);
    var code = this.debugTextCode || this.getString();
    var msg = Messages.get(code, { ignoreWarning: true }) || code;

    console.log(code + "\n" + msg + "\n" + (link || "no link found"));
    return link;
};

cc.Base.prototype.cleanupBorder = function () {
    if (this.spriteSavedPtr) {
        this.spriteSavedPtr.removeFromParent();
        delete this.spriteSavedPtr;
    }
    if (this.labelSavedPtr) {
        this.labelSavedPtr.removeFromParent();
        delete this.labelSavedPtr;
    }
    cc.eventManager.removeListener(this.debugBorderKeyboardListener);

    if (typeof selectedNode === "object" && selectedNode === this) {
        selectedNode = undefined;
    }

    if (cleverapps.sceneDebugger.selectedNode === this) {
        cleverapps.sceneDebugger.selectedNode = undefined;
    }

    if (cleverapps.nodeAttributesPannel) {
        cleverapps.nodeAttributesPannel.remove();
        cleverapps.nodeAttributesPannel = undefined;
    }
};

cc.Base.prototype.drawRects = function (worldRects) {
    if (this.drawRectsNode) {
        this.drawRectsNode.removeFromParent();
        this.drawRectsNode = undefined;
    }

    this.drawRectsNode = new cc.DrawNode();
    this.drawRectsNode.setAnchorPoint(0, 0);
    this.drawRectsNode.setContentSize2(this.width, this.height);
    this.drawRectsNode.setLocalZOrder(10000);
    this.addChild(this.drawRectsNode);

    this.drawRectsNode.getBoundingBoxToWorld = function () {
        return cc.rect();
    };

    worldRects.forEach(function (worldRect) {
        var transform = this.getWorldToNodeTransform();
        var rect = cc.rectApplyAffineTransform(worldRect, transform);

        this.drawRectsNode.drawRect(cc.p(rect.x, rect.y), cc.p(rect.x + rect.width, rect.y + rect.height), null, 4, cc.color(255, 0, 0, 255));

        var positions = [{
            x: rect.x,
            y: rect.y + rect.height,
            anchorX: 0,
            anchorY: 0
        }, {
            x: rect.x + rect.width,
            y: rect.y + rect.height,
            anchorX: 1,
            anchorY: 0
        }, {
            x: rect.x,
            y: rect.y,
            anchorX: 0,
            anchorY: 1
        }, {
            x: rect.x + rect.width,
            y: rect.y,
            anchorX: 1,
            anchorY: 1
        }];

        var label = cleverapps.UI.generateOnlyText(worldRect.name || "Noname", cleverapps.styles.FONTS.SYSTEM);
        this.drawRectsNode.addChild(label);

        for (var i = 0; i < positions.length; ++i) {
            var position = positions[i];

            label.setAnchorPoint2(position.anchorX, position.anchorY);
            label.setPosition(position.x, position.y);

            if (cleverapps.UI.isNodeOnScene(label)) {
                break;
            }
        }
    }.bind(this));
};

// eslint-disable-next-line no-unused-vars
var previewRes = function (path) {
    path = processVirtualImage(path) || processVirtualJson(path);
    var type = path.split(".").slice(-1)[0];

    var addToScene = function (res) {
        var scene = cleverapps.scenes.getRunningScene();
        scene.addChild(res);
        res.setPositionRound(scene.width / 2, scene.height / 2);
    };

    if (type === "json") {
        var createSpine = function () {
            var res = new cleverapps.Spine(path);
            var animations = Object.keys(res.data.animations);
            res.setAnimation(0, animations[0], true);
            res.setSkin(cleverapps.Spine.getSkins(path)[0] || "default");
            res.debugBorder();

            addToScene(res);
            console.log(animations);
        };

        if (cleverapps.Spine.isAnimationLoaded(path)) {
            createSpine();
        } else {
            cleverapps.bundleLoader.loadBundle(cleverapps.Spine.listBundles(path), {
                onSuccess: createSpine
            });
        }
    } else if (type === "png" || type === "jpg") {
        addToScene(cleverapps.UI.createScale9Sprite(path));
    }
};

// eslint-disable-next-line no-unused-vars
var checkFonts = function (testFont) {
    var items = [];
    testFont = testFont || {};

    for (var size = 15; size < 90; size += 5) {
        var font = {
            name: testFont.name || "default", size: size, fnt: true, stroke: testFont.stroke, shadow: testFont.shadow
        };

        var one = cleverapps.UI.generateOnlyText("1235", font);
        var two = cleverapps.UI.generateImageText("1235", font);
        var some = new cleverapps.Layout([one, two], {
            direction: cleverapps.UI.HORIZONTAL,
            margin: 5
        });
        items.push(some);
    }

    var res = new cleverapps.Layout(items, {
        direction: cleverapps.UI.VERTICAL,
        margin: 5
    });

    cleverapps.scenes.getRunningScene().addChild(res);
    res.setPositionRound(cleverapps.UI.getSceneSize().width / 2, cleverapps.UI.getSceneSize().height / 2);
};

cleverapps.styles.NodeDebug = {
    button: {
        x: { align: "right", dx: 50 },
        y: { align: "top" },
        width: 50,
        height: 50,
        margin: 5
    }
};
