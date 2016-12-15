angular.module('showcase')
    .factory('Utilities', function($http) {

        var githubColors;

        return {
            getRandomColor: function() {
                var color = new RColor;
                return color.get(true, 0.5, 0.99);
            },
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