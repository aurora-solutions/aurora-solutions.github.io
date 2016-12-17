angular.module('showcase')
    .factory('Utilities', function($http) {

        var githubColors;

        return {
            initialize: function() {
                $http.get('github-colors.json')
                    .then(function(colors) {
                        githubColors = colors.data;
                    }).catch(function(error) {
                        console.log(error);
                    });
            },
            getGithubColor(language) {
                return githubColors[language].color;
            }
        }
    });