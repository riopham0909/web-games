/**
 * Created by iamso on 07.10.2019.
 */

var MissionRulesOptionsBuilder = {
    build: function (mission) {
        return {
            name: mission.getName() + "GuideWindow",
            stagesContent: function () {
                var jsons = [1, 2, 3].map(function (index) {
                    return bundles[this.bundleName].jsons["rules_stages_" + index] || bundles[this.bundleName].jsons.rules_json;
                }, this);
                return this.createSpineStages(jsons);
            }
        };
    }
};
