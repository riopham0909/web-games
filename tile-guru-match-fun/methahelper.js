/**
 * Created by mac on 2/3/20
 */

var MethaHelper = {
    start: function (f, level) {
        if (level.episode.isComingSoon()) {
            f();
            return;
        }

        if (!LevelStartWindow.isAvailable(level.episodeNo, level.levelNo) || cleverapps.config.features.includes("boosters_before") && !WindowBoostersBefore.isAvailable()) {
            level.play(f);
            return;
        }

        cleverapps.meta.showControlsWhileFocused("MenuBarGoldItem");

        if (level.building) {
            new BuildingStartWindow({
                building: level.building,
                level: level
            });
        } else {
            new LevelStartWindow({
                level: level
            });
        }
        cleverapps.meta.onceNoWindowsListener = f;
    },

    getCurrentLevel: function (building) {
        var label = undefined;

        if (cleverapps.meta.getType() === Metha.FARM) {
            label = building.label;

            cleverapps.playButton.disableIncLevel();
            if (label === undefined || label.episodeNo >= cleverapps.episodes.getAmountEpisodes()) {
                label = cleverapps.farm.chooseNextLevel(building);
            }

            if (building.label !== label) {
                building.label = label;
                cleverapps.farm.save();
            }
            cleverapps.playButton.enableIncLevel();
        } else if (cleverapps.isKnockoutGame()) {
            label = cleverapps.meta.getMainObject().knockoutGame.getNextLevel();
        } else {
            label = cleverapps.user.getCurrentLevel();
        }

        var level = MethaHelper.getLevel(label.episodeNo, label.levelNo);

        if (cleverapps.meta.getType() === Metha.FARM) {
            level.building = building;
        }
        return level;
    },

    getLevel: function (episodeNo, levelNo) {
        var episode, level;

        if (cleverapps.meta.getType() === Metha.HOSE) {
            episode = new HoseEpisode(episodeNo);
        } else {
            episode = new Episode(episodeNo, levelNo);
        }

        level = episode.getLevel(levelNo);
        return level;
    },

    prepare: function () {
        if (cleverapps.config.debugMode && cleverapps.meta.getType() === Metha.FARM) {
            MethaHelper.validateDialogues();
        }

        if (cleverapps.meta.getType() === Metha.FARM) {
            MethaHelper.validateQuestItems();
        }
    },

    listPersons: function () {
        var persons = {};
        if (cleverapps.meta.getType() === Metha.FARM) {
            for (var i = 0; i < 100; i++) {
                var id = "person" + i;
                if (!bundles[id]) {
                    break;
                }

                persons[id] = {
                    name: id,
                    json: bundles[id].jsons[id],
                    offsetY: 0
                };
            }
        }

        return persons;
    },

    validateQuestItems: function () {
        MethaHelper.readConfig().questItems.forEach(function (item, ind) {
            if (!bundles.farm_items.frames["item" + ind]) {
                throw "No questItem resource - " + item;
            }
        });
    },

    readConfig: function () {
        if (cleverapps.meta.getType() === Metha.FARM) {
            return cleverapps.farm.readConfig();
        } if (cleverapps.meta.getType() === Metha.HOMEFIX) {
            return cleverapps.home.readConfig();
        }
    },

    validateDialogues: function () {
        cleverapps.values(this.readConfig().dialogues).forEach(function (dialogue) {
            dialogue.forEach(function (step) {
                var person = step.person === "string" && step.person.split("_")[0];
                if (person && !PersonsLibrary.hasRole(person)) {
                    throw "No person: " + person;
                }
            });
        });
    },

    allIsComplete: function (f) {
        cleverapps.meta.compound(f, [
            function (f) {
                var dialogue = MethaHelper.createDialogue("Final");
                dialogue.on("afterClose", f);

                new DialogueView(dialogue);
            },

            function (f) {
                new AllDoneWindow();
                cleverapps.meta.onceNoWindowsListener = f;
            }
        ]);
    },

    createDialogue: function (dialogueName) {
        var dialogue = this.readConfig().dialogues[dialogueName];

        if (!dialogue) {
            return undefined;
        }

        var bundles = [];
        var data = [];
        dialogue.forEach(function (step) {
            var stepData = {
                text: "" + step.text,
                person: step.person
            };
            if (step.person2) {
                stepData.person2 = step.person2;
            }
            data.push(stepData);

            if (cleverapps.meta.getType() === Metha.FARM) {
                bundles.push(step.person.role);
                if (step.person2) {
                    bundles.push(step.person2.role);
                }
            }
        });

        return new Dialogue(data, {
            autoClose: true,
            showUp: true,
            bundles: bundles
        });
    }
};
