/**
 * Created by vladislav on 22.07.2022
 */

var PersonsLibrary = {
    hasRole: function (role) {
        return Object.keys(cleverapps.config.persons).filter(function (group) {
            return cleverapps.config.persons[group][role] !== undefined;
        }).length > 0;
    },

    getPerson: function (role) {
        return cleverapps.styles.PersonsLibrary[role];
    },

    getMinimalJson: function (role) {
        return bundles["person_minimal_" + role] && bundles["person_minimal_" + role].jsons[role + "_minimal_json"];
    },

    initialize: function () {
        var allPersons = {};
        Object.keys(cleverapps.config.persons).forEach(function (group) {
            Object.keys(cleverapps.config.persons[group]).forEach(function (person) {
                allPersons[person] = {};
                allPersons[person].name = cleverapps.config.persons[group][person];
                allPersons[person].group = group;
            });
        });
        for (var role in allPersons) {
            if (!cleverapps.styles.PersonsLibrary[role]) {
                cleverapps.styles.PersonsLibrary[role] = {};
            }

            cleverapps.styles.PersonsLibrary[role].name = allPersons[role].name;
            cleverapps.styles.PersonsLibrary[role].bundle = "persons_" + allPersons[role].group;
            if (bundles["person_" + role] === undefined) {
                console.log(role);
            }
            cleverapps.styles.PersonsLibrary[role].json = bundles["person_" + role].jsons[role + "_json"];

            if (bundles["person_" + role + "_minimal"]) {
                cleverapps.styles.PersonsLibrary[role].minimalJson = bundles["person_" + role + "_minimal"].jsons[role + "_minimal_json"];
            }
        }

        var persons = MethaHelper.listPersons();
        if (!cleverapps.config.persons) {
            cleverapps.config.persons = {};
        }
        if (!cleverapps.config.persons.meta) {
            cleverapps.config.persons.meta = {};
        }
        for (var personId in persons) {
            cleverapps.config.persons.meta[personId] = personId;
        }
        Object.assign(cleverapps.styles.PersonsLibrary, persons);
    }
};

cleverapps.styles.PersonsLibrary = {

};
