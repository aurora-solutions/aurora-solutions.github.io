angular.module('showcase', [])
    .controller('homeController', function($scope, $http, $q, $window, Utilities) {

        // Variables
        var organizations = [];
        $scope.repos = [];
        $scope.orgs = [];
        $scope.sortOrder = "";
        $scope.loading = true;

        // Client ID and Secret
        var client_id = '259040d36f1705356ca2',
            client_secret = '7fd53a577a524c39f917cf4d213171a9fdd17181';

        Utilities.initialize();

        // Call to read local file repo links
        $http.get('repos.json')
            .then(function(organizations) {
                loadOrganizationsData(organizations.data);
                loadRepositoriesData(organizations.data);
            });

        //Loading Orgnaizations data for organizations listed in repos.json
        var loadOrganizationsData = function(organizationsList) {

            return $q.all(organizationsList.map(function(org) {
                    return $http
                        .get('https://api.github.com/users/' + org.name + '?client_id=' + client_id + '&client_secret=' + client_secret)
                }))
                .then(function(results) {
                    results.forEach(function(organization) {
                        $scope.orgs = $scope.orgs.concat(organization.data);
                    });

                    $scope.loading = false;
                });

        }

        //Loading Repositories data for organizations listed in repos.json
        var loadRepositoriesData = function(organizationsList) {
            return $q.all(organizationsList.map(function(org) {
                    return $http
                        .get('https://api.github.com/users/' + org.name + '/repos?type=all&per_page=100&client_id=' + client_id + '&client_secret=' + client_secret)
                }))
                .then(function(results) {
                    results.forEach(function(organization, i) {
                        angular.forEach(organization.data, function(repo) {
                            angular.forEach(organizationsList[i].repos, function(repository) {
                                //Check if repository exist in repos.json list that is to be shown 
                                if (repository.name.toLowerCase() == repo.name.toLowerCase()) {
                                    var url = 'https://api.github.com/repos/' + repo.owner.login + '/' + repo.name + '/languages?type=all&client_id=' + client_id + '&client_secret=' + client_secret;
                                    $http.get(url).then(function(languages) {
                                        repo.languages = getLanguages(languages.data, 3);
                                    });
                                    repo.frameworks = repository.frameworks;
                                    $scope.repos = $scope.repos.concat(repo);
                                }
                            });
                        });
                    });

                    $scope.loading = false;
                });
        }

        var getLanguages = function(languages, limit) {
            var keys = Object.keys(languages);
            if (keys.length < 1) {
                return [];
            }

            var languagesList = [],
                sum = 0;

            angular.forEach(keys, function(key, arrayIndex) {
                sum += languages[key];
            });

            angular.forEach(keys, function(key, arrayIndex) {
                if (arrayIndex < limit) {
                    var lang = {
                        name: key,
                        data: languages[key],
                        stats: ((languages[key] / sum) * 100).toFixed(2),
                        color: Utilities.getGithubColor(key)
                    };

                    languagesList.push(lang);
                } else {
                    //ret['Other'] = ret['Other'] + languages[key];
                }

            });

            return languagesList;
        }

        $scope.OpenRepo = function(url) {
            $window.open(url, "_blank");
        };
    });